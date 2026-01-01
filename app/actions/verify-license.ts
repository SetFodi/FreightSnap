"use server";

interface GumroadResponse {
    success: boolean;
    uses?: number;
    purchase?: {
        refunded: boolean;
        chargebacked: boolean;
        email: string;
    };
}

const PRODUCT_ID = "3Caa9prCBLnt-IVumId2tA==";
const MAX_USES = 3; // Maximum number of devices/activations allowed

export async function verifyGumroadLicense(licenseKey: string): Promise<{
    success: boolean;
    error?: string;
    uses?: number;
}> {
    if (!licenseKey || licenseKey.trim().length === 0) {
        return { success: false, error: "Please enter a license key" };
    }

    try {
        const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: PRODUCT_ID,
                license_key: licenseKey.trim(),
                increment_uses_count: "true", // Count this as +1 activation
            }),
        });

        const data: GumroadResponse = await response.json();

        // Check if key is valid
        if (!data.success) {
            return { success: false, error: "Invalid license key" };
        }

        // Check for refund/chargeback
        if (data.purchase?.refunded) {
            return { success: false, error: "This license has been refunded" };
        }

        if (data.purchase?.chargebacked) {
            return { success: false, error: "This license has been chargebacked" };
        }

        // THE LIMIT CHECK: Max 3 devices
        if (data.uses && data.uses > MAX_USES) {
            return {
                success: false,
                error: `License limit reached (${MAX_USES} devices max). Contact support to reset.`,
                uses: data.uses,
            };
        }

        // Success!
        return {
            success: true,
            uses: data.uses,
        };
    } catch {
        return { success: false, error: "Failed to verify license. Please try again." };
    }
}
