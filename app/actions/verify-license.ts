"use server";

interface GumroadResponse {
    success: boolean;
    uses?: number;
    purchase?: {
        refunded: boolean;
        chargebacked: boolean;
        email: string;
        subscription_cancelled_at?: string | null;
        subscription_failed_at?: string | null;
        subscription_ended_at?: string | null;
    };
}

// The new subscription product permalink
const PRODUCT_PERMALINK = "freightsnap-pro";

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
                product_permalink: PRODUCT_PERMALINK,
                license_key: licenseKey.trim(),
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

        // Check for cancelled/failed subscription
        if (data.purchase?.subscription_cancelled_at) {
            return { success: false, error: "Your subscription has been cancelled" };
        }

        if (data.purchase?.subscription_failed_at) {
            return { success: false, error: "Your subscription payment failed. Please update your payment method." };
        }

        if (data.purchase?.subscription_ended_at) {
            return { success: false, error: "Your subscription has ended. Please renew to continue." };
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
