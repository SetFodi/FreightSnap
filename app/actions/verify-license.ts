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

// The subscription product ID (from Gumroad API response)
const PRODUCT_ID = "Xucy2_FoFL3942NxJfO32A==";

async function tryVerifyWithProductId(licenseKey: string): Promise<GumroadResponse | null> {
    try {
        const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: PRODUCT_ID,
                license_key: licenseKey.trim(),
            }),
        });
        return await response.json();
    } catch {
        return null;
    }
}

export async function verifyGumroadLicense(licenseKey: string): Promise<{
    success: boolean;
    error?: string;
    uses?: number;
}> {
    if (!licenseKey || licenseKey.trim().length === 0) {
        return { success: false, error: "Please enter a license key" };
    }

    const data = await tryVerifyWithProductId(licenseKey);

    // Debug logging
    console.log("Gumroad API Response:", JSON.stringify(data, null, 2));

    if (!data || !data.success) {
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
}

