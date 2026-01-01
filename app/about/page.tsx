"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Shield,
    Zap,
    FileSpreadsheet,
    Lock,
    Trash2,
    Eye,
    ArrowLeft,
    Check,
    Cloud,
    Server
} from "lucide-react";
import { GlassContainer } from "@/components/glass-container";

const features = [
    {
        icon: FileSpreadsheet,
        title: "Multi-Format Support",
        description: "PDF, CSV, XLS, XLSX - drop any document and get clean, structured data.",
    },
    {
        icon: Zap,
        title: "Instant Processing",
        description: "Spreadsheets parse locally in milliseconds. Zero wait time for structured files.",
    },
    {
        icon: Shield,
        title: "100% Private",
        description: "Your data never trains AI models. Files are processed and immediately discarded.",
    },
];

const privacyPoints = [
    {
        icon: Lock,
        title: "No Data Storage",
        description: "Files are processed in memory and immediately discarded. Nothing is saved to any database.",
    },
    {
        icon: Eye,
        title: "No AI Training",
        description: "We use Groq API which explicitly does NOT use your data for model training. Your data stays yours.",
    },
    {
        icon: Trash2,
        title: "Session-Only",
        description: "All extracted data exists only in your browser session. Close the tab and it's gone forever.",
    },
    {
        icon: Server,
        title: "Local-First for Spreadsheets",
        description: "CSV and Excel files are parsed entirely on-server without any AI - even more private.",
    },
];

export default function AboutPage() {
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
                                <Zap className="w-5 h-5 text-primary" />
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

                {/* Hero */}
                <section className="container mx-auto px-6 py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                            About <span className="gradient-text">FreightSnap</span>
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Zero-friction document intelligence for logistics. Extract data from any document format,
                            with complete privacy and no AI training on your data.
                        </p>
                    </motion.div>
                </section>

                {/* Features */}
                <section className="container mx-auto px-6 pb-16">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <GlassContainer className="p-6 h-full">
                                    <feature.icon className="w-10 h-10 text-primary mb-4" />
                                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        {feature.description}
                                    </p>
                                </GlassContainer>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Privacy Section */}
                <section className="container mx-auto px-6 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-5xl mx-auto"
                    >
                        <GlassContainer variant="intense" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <Shield className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-100">
                                        Privacy-First Architecture
                                    </h2>
                                    <p className="text-zinc-400">
                                        Your data is never stored, sold, or used for AI training
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {privacyPoints.map((point, index) => (
                                    <motion.div
                                        key={point.title}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (0.1 * index) }}
                                        className="flex gap-4"
                                    >
                                        <div className="flex-shrink-0 p-2 rounded-lg bg-zinc-800/50 h-fit">
                                            <point.icon className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-100 mb-1">
                                                {point.title}
                                            </h3>
                                            <p className="text-sm text-zinc-400">
                                                {point.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Privacy Badge */}
                            <div className="mt-8 pt-6 border-t border-zinc-700/50">
                                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check className="w-4 h-4" />
                                        <span>GDPR Friendly</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check className="w-4 h-4" />
                                        <span>No Data Retention</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check className="w-4 h-4" />
                                        <span>No Cookies</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check className="w-4 h-4" />
                                        <span>Open Source</span>
                                    </div>
                                </div>
                            </div>
                        </GlassContainer>
                    </motion.div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-6 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-2xl font-bold text-zinc-100 text-center mb-8">
                            How It Works
                        </h2>

                        <div className="space-y-4">
                            {[
                                { step: 1, title: "Drop your file", desc: "PDF, CSV, XLS, or XLSX - any logistics document" },
                                { step: 2, title: "Instant extraction", desc: "Spreadsheets parse locally; PDFs use privacy-respecting AI" },
                                { step: 3, title: "Edit & refine", desc: "Clean up any extraction errors directly in the table" },
                                { step: 4, title: "Export to Excel", desc: "Download a perfectly formatted .xlsx file" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (0.1 * index) }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                                        <p className="text-sm text-zinc-400">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-zinc-800/50 py-8 text-center">
                    <p className="text-sm text-zinc-500">
                        Built with Next.js 15, Tailwind CSS & Groq AI
                    </p>
                    <p className="text-xs text-zinc-600 mt-2">
                        <a
                            href="https://github.com/SetFodi/FreightSnap"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-zinc-400 transition-colors"
                        >
                            View on GitHub
                        </a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
