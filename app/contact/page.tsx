"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Send, CheckCircle, MessageSquare, Bug, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassContainer } from "@/components/glass-container";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/app/actions/send-email";
import { Loader2 } from "lucide-react";

type ContactReason = "technical" | "billing" | "feature" | "other";

interface ReasonOption {
    id: ContactReason;
    label: string;
    icon: typeof Bug;
}

const reasons: ReasonOption[] = [
    { id: "technical", label: "Technical Issue", icon: Bug },
    { id: "billing", label: "Billing / License", icon: HelpCircle },
    { id: "feature", label: "Feature Request", icon: MessageSquare },
    { id: "other", label: "Other", icon: Mail },
];

export default function ContactPage() {
    const [selectedReason, setSelectedReason] = useState<ContactReason | null>(null);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSending(true);

        const result = await sendContactEmail({
            email,
            reason: reasons.find(r => r.id === selectedReason)?.label || "Inquiry",
            message
        });

        setIsSending(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            alert(result.error);
        }
    };

    const isValid = selectedReason && email.trim() && message.trim();

    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="relative z-10">
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <main className="container mx-auto px-6 pt-32 pb-12 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Contact Us</h1>
                            <p className="text-zinc-400">
                                Have a question or issue? We&apos;re here to help.
                            </p>
                        </div>

                        {submitted ? (
                            <GlassContainer className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-zinc-100 mb-2">Message Sent!</h2>
                                    <p className="text-zinc-400 mb-6">
                                        Thanks for reaching out. We&apos;ll get back to you at <span className="text-zinc-100 font-medium">{email}</span> as soon as possible.
                                    </p>
                                    <div className="mt-8">
                                        <Button variant="outline" onClick={() => {
                                            setSubmitted(false);
                                            setMessage("");
                                            setSelectedReason(null);
                                        }}>
                                            Send Another Message
                                        </Button>
                                    </div>
                                </motion.div>
                            </GlassContainer>
                        ) : (
                            <GlassContainer className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Reason Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-3">
                                            What&apos;s this about?
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {reasons.map((reason) => (
                                                <button
                                                    key={reason.id}
                                                    type="button"
                                                    onClick={() => setSelectedReason(reason.id)}
                                                    className={cn(
                                                        "p-4 rounded-xl border transition-all text-left group",
                                                        selectedReason === reason.id
                                                            ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                                                            : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600"
                                                    )}
                                                >
                                                    <reason.icon className={cn(
                                                        "w-5 h-5 mb-2 transition-colors",
                                                        selectedReason === reason.id ? "text-primary" : "text-zinc-500"
                                                    )} />
                                                    <span className={cn(
                                                        "text-sm font-medium transition-colors",
                                                        selectedReason === reason.id ? "text-zinc-100" : "text-zinc-400"
                                                    )}>
                                                        {reason.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Your Email
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            placeholder="Describe your issue or question..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            required
                                            className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={!isValid || isSending}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </GlassContainer>
                        )}

                        {/* Direct Email */}
                        <p className="text-center text-sm text-zinc-500 mt-6">
                            Or email us directly at{" "}
                            <a
                                href="mailto:lukafartenadze2004@gmail.com"
                                className="text-primary hover:underline"
                            >
                                lukafartenadze2004@gmail.com
                            </a>
                        </p>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-800/50 py-8 mt-12 text-center">
                    <div className="flex justify-center gap-6 mb-4 text-sm text-zinc-500">
                        <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
                        <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
                    </div>
                    <p className="text-sm text-zinc-600">© 2025 FreightSnap. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
