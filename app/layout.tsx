import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "FreightSnap - PDF to Excel Converter for Logistics",
    description:
        "Zero-friction PDF freight quote parser. Drag, drop, and export clean data to Excel in seconds.",
    keywords: ["freight", "logistics", "PDF", "Excel", "quote", "parser", "AI"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
                suppressHydrationWarning
            >
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    );
}
