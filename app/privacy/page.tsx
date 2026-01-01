"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold gradient-text">FreightSnap</span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to App
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="container mx-auto px-6 py-12 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                <Shield className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-zinc-100">Privacy Policy</h1>
                                <p className="text-zinc-500">Last updated: January 2, 2025</p>
                            </div>
                        </div>

                        {/* Policy Content */}
                        <div className="prose prose-invert prose-zinc max-w-none">
                            <div className="space-y-8 text-zinc-300">

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">1. Introduction</h2>
                                    <p>
                                        FreightSnap (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
                                        This Privacy Policy explains how we collect, use, and safeguard your information when
                                        you use our document processing service.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">2. Information We Collect</h2>
                                    <h3 className="text-lg font-medium text-zinc-200 mb-2">Files You Upload</h3>
                                    <p>
                                        When you upload documents (PDF, CSV, XLS, XLSX files), we process them to extract
                                        structured data. <strong className="text-green-400">Files are processed in memory only and are
                                            immediately discarded after processing.</strong> We do not store your uploaded files on any server.
                                    </p>

                                    <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-4">Usage Data</h3>
                                    <p>
                                        We may collect anonymous usage statistics such as the number of files processed per day.
                                        This data is stored locally in your browser and is not transmitted to our servers.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">3. How We Use Your Information</h2>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>To provide the document processing service</li>
                                        <li>To extract and display data from your uploaded files</li>
                                        <li>To enable you to export processed data</li>
                                    </ul>
                                    <p className="mt-4">
                                        <strong className="text-green-400">We do NOT:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Store your files after processing</li>
                                        <li>Sell or share your data with third parties</li>
                                        <li>Use your data for advertising purposes</li>
                                        <li>Train AI models on your data</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">4. Third-Party Services</h2>
                                    <h3 className="text-lg font-medium text-zinc-200 mb-2">Groq AI</h3>
                                    <p>
                                        For PDF processing, we use Groq&apos;s AI API to extract text and structure data.
                                        According to Groq&apos;s privacy policy, they do not use API data to train their models.
                                        Data sent to Groq is processed and not retained beyond the API request.
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Learn more at: <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">groq.com/privacy-policy</a>
                                    </p>

                                    <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-4">Local Processing</h3>
                                    <p>
                                        For structured files (CSV, XLS, XLSX), all processing happens locally on our servers
                                        without any AI involvement. Your spreadsheet data never leaves the processing environment.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">5. Data Retention</h2>
                                    <p>
                                        <strong className="text-green-400">We practice zero data retention.</strong> Your uploaded
                                        files and extracted data exist only during your browser session. Once you close the tab
                                        or navigate away, all data is permanently deleted. We maintain no backups or copies.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">6. Cookies and Local Storage</h2>
                                    <p>
                                        We use browser local storage to track daily usage limits (for free tier users).
                                        This data is stored locally on your device and resets daily. We do not use
                                        tracking cookies or third-party analytics services.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">7. Data Security</h2>
                                    <p>
                                        We implement security measures including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 mt-2">
                                        <li>HTTPS encryption for all data transmission</li>
                                        <li>No persistent storage of user files</li>
                                        <li>Memory-only processing that clears after each request</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">8. Your Rights</h2>
                                    <p>You have the right to:</p>
                                    <ul className="list-disc list-inside space-y-2 mt-2">
                                        <li>Know what data we collect (this policy)</li>
                                        <li>Request deletion of your data (not applicable as we don&apos;t store it)</li>
                                        <li>Opt out of processing (simply don&apos;t use the service)</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">9. Children&apos;s Privacy</h2>
                                    <p>
                                        FreightSnap is not intended for use by children under 13 years of age. We do not
                                        knowingly collect personal information from children.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">10. Changes to This Policy</h2>
                                    <p>
                                        We may update this Privacy Policy from time to time. We will notify you of any
                                        changes by posting the new Privacy Policy on this page and updating the
                                        &quot;Last updated&quot; date.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold text-zinc-100 mb-4">11. Contact Us</h2>
                                    <p>
                                        If you have any questions about this Privacy Policy, please contact us at:
                                    </p>
                                    <p className="mt-2">
                                        <a href="mailto:privacy@freightsnap.com" className="text-primary hover:underline">
                                            privacy@freightsnap.com
                                        </a>
                                    </p>
                                </section>

                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-800/50 py-8 mt-12">
                    <div className="container mx-auto px-6 text-center text-sm text-zinc-500">
                        <div className="flex justify-center gap-6 mb-4">
                            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
                            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
                            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        </div>
                        <p>© 2025 FreightSnap. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
