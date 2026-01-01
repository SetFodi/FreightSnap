"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Check, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/glass-container";
import { cn } from "@/lib/utils";

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
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For busy logistics teams",
        features: [
            "Unlimited files",
            "Everything in Free",
            "QuickBooks export",
            "Xero export",
            "Currency conversion",
            "Priority processing",
            "Email support",
        ],
        cta: "Start Free Trial",
        href: "/",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "$299",
        period: "one-time",
        description: "Custom integration",
        features: [
            "Everything in Pro",
            "API access",
            "Custom export templates",
            "Direct database integration",
            "Dedicated support",
            "Custom AI training",
        ],
        cta: "Contact Us",
        href: "mailto:hello@freightsnap.com",
        popular: false,
    },
];

export default function PricingPage() {
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
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Start free. Upgrade when you need more power. No hidden fees.
                        </p>
                    </motion.div>
                </section>

                {/* Pricing Cards */}
                <section className="container mx-auto px-6 pb-24">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                                <Star className="w-3 h-3" />
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    {/* Plan header */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                                            {plan.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 mb-4">{plan.description}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-zinc-100">
                                                {plan.price}
                                            </span>
                                            <span className="text-zinc-500">{plan.period}</span>
                                        </div>
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
                                    <Button
                                        asChild
                                        variant={plan.popular ? "default" : "outline"}
                                        className="w-full"
                                    >
                                        <Link href={plan.href}>{plan.cta}</Link>
                                    </Button>
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
                                q: "Can I cancel anytime?",
                                a: "Absolutely. No contracts, no commitments. Cancel with one click.",
                            },
                            {
                                q: "What file formats are supported?",
                                a: "PDF, CSV, XLS, and XLSX. We parse spreadsheets locally (no AI) for maximum reliability.",
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "Yes, 30-day money-back guarantee. No questions asked.",
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
    );
}
