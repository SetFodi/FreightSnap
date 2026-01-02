"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { GlassContainer } from "@/components/glass-container";
import { cn } from "@/lib/utils";

const PRO_STORAGE_KEY = "freightsnap_pro";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "For occasional use",
        features: [
            "3 files per day",
            "PDF, CSV, XLS, XLSX support",
            "Excel & CSV export",
            "Best price highlighting",
            "Privacy-first processing",
        ],
        cta: "Get Started",
        href: "/",
        popular: false,
    },
    {
        name: "Pro Lifetime",
        price: "$20",
        originalPrice: "$29",
        period: "one-time",
        description: "Pay once, use forever",
        features: [
            "Everything in Free",
            "500 parsings/month (Fair Use)",
            "QuickBooks & Odoo export",
            "Currency conversion (Coming Soon)",
            "Best price auto-highlighter",
            "Priority processing",
            "Lifetime updates",
        ],
        cta: "Get Pro - Save $9",
        href: "https://freightsnap.gumroad.com/l/uygsqg/andromeda",
        popular: true,
    },
];

export default function PricingPage() {
    const [isPro, setIsPro] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsPro(localStorage.getItem(PRO_STORAGE_KEY) === "true");
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="relative z-10">
                {/* Navbar */}
                <Navbar />

                {/* Pro Status Banner */}
                <div className="pt-24">
                    {mounted && isPro && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20"
                        >
                            <div className="container mx-auto px-6 py-3 flex items-center justify-center gap-2">
                                <Crown className="w-4 h-4 text-amber-400" />
                                <span className="text-sm text-amber-300 font-medium">
                                    You have Pro access! Enjoy unlimited features.
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                                Simple, <span className="gradient-text">Transparent</span> Pricing
                            </h1>
                            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-6">
                                Start free. Upgrade when you need more power. No subscriptions.
                            </p>

                            {/* Discount Banner */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                >
                                    <Sparkles className="w-4 h-4 text-green-400" />
                                </motion.div>
                                <span className="text-sm text-green-300">
                                    Launch offer: <span className="font-bold">Save $9</span> with code{" "}
                                    <code className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-200 font-mono text-xs">
                                        ANDROMEDA
                                    </code>
                                </span>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Pricing Cards */}
                    <section className="container mx-auto px-6 pb-24">
                        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <GlassContainer
                                        variant={plan.popular ? "intense" : "default"}
                                        className={cn(
                                            "p-6 h-full flex flex-col relative",
                                            plan.popular && "border-primary/50 ring-1 ring-primary/20"
                                        )}
                                    >
                                        {/* Popular badge */}
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <motion.div
                                                    animate={{ y: [0, -3, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium shadow-lg shadow-orange-500/30"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    Best Value
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Plan header */}
                                        <div className="mb-6 pt-2">
                                            <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                                                {plan.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mb-4">{plan.description}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-zinc-100">
                                                    {plan.price}
                                                </span>
                                                {plan.originalPrice && (
                                                    <span className="text-lg text-zinc-500 line-through">
                                                        {plan.originalPrice}
                                                    </span>
                                                )}
                                                <span className="text-zinc-500">{plan.period}</span>
                                            </div>
                                            {plan.originalPrice && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="text-sm text-green-400 mt-1"
                                                >
                                                    You save $9 with launch discount!
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-zinc-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        {plan.popular && mounted && isPro ? (
                                            <div className="w-full py-3 text-center rounded-lg bg-green-500/10 border border-green-500/30">
                                                <span className="flex items-center justify-center gap-2 text-green-400 font-medium">
                                                    <Crown className="w-4 h-4" />
                                                    You have Pro!
                                                </span>
                                            </div>
                                        ) : (
                                            <Button
                                                asChild
                                                variant={plan.popular ? "default" : "outline"}
                                                className={cn(
                                                    "w-full",
                                                    plan.popular && "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/20"
                                                )}
                                            >
                                                <a href={plan.href} target={plan.popular ? "_blank" : undefined} rel="noopener noreferrer">
                                                    {plan.cta}
                                                </a>
                                            </Button>
                                        )}
                                    </GlassContainer>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="container mx-auto px-6 pb-24">
                        <h2 className="text-2xl font-bold text-zinc-100 text-center mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="max-w-2xl mx-auto space-y-4">
                            {[
                                {
                                    q: "Is my data really private?",
                                    a: "Yes. Files are processed in memory and immediately discarded. We use Groq API which does NOT train on your data.",
                                },
                                {
                                    q: "What does 'Lifetime' mean?",
                                    a: "Pay once, use forever. No monthly fees, no subscriptions. All future updates included.",
                                },
                                {
                                    q: "What file formats are supported?",
                                    a: "PDF, CSV, XLS, and XLSX. We parse spreadsheets locally (no AI) for maximum reliability.",
                                },
                                {
                                    q: "Do you offer refunds?",
                                    a: "Refunds are available for valid reasons (technical issues, product not working as advertised). Contact us via Gumroad.",
                                },
                            ].map((faq) => (
                                <div
                                    key={faq.q}
                                    className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30"
                                >
                                    <h3 className="font-medium text-zinc-100 mb-2">{faq.q}</h3>
                                    <p className="text-sm text-zinc-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-zinc-800/50 py-8 text-center">
                        <p className="text-sm text-zinc-500">
                            Built with Next.js 15, Tailwind CSS & Groq AI
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
