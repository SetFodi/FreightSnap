"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
    email: string;
    reason: string;
    message: string;
}

export async function sendContactEmail(data: ContactFormData) {
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return {
            success: false,
            error: "Email service not configured (Missing API Key). Please contact support manually."
        };
    }

    const { email, reason, message } = data;

    try {
        await resend.emails.send({
            from: "FreightSnap Contact <onboarding@resend.dev>", // Default Resend test sender
            to: "lukafartenadze2004@gmail.com",
            replyTo: email,
            subject: `[FreightSnap] New Inquiry: ${reason}`,
            text: `
New message from FreightSnap Contact Form

Reason: ${reason}
From: ${email}

Message:
${message}
            `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email. Please try again or email directly." };
    }
}
