"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProStatus } from "@/components/license-modal";
import { UsageBadge } from "@/components/usage-badge";
import { LicenseModal, ProBadge } from "@/components/license-modal";

export function Navbar() {
    const pathname = usePathname();
    const { isPro, refresh: refreshProStatus } = useProStatus();
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { href: "/about", label: "About" },
        { href: "/pricing", label: "Pricing" },
        { href: "/privacy", label: "Privacy" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <>
            <LicenseModal
                isOpen={showLicenseModal}
                onClose={() => setShowLicenseModal(false)}
                onSuccess={() => {
                    refreshProStatus();
                    setMobileMenuOpen(false);
                }}
            />

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "py-4" : "py-6"
                )}
            >
                <div className="container mx-auto px-6">
                    <div className={cn(
                        "flex items-center justify-between p-2 pl-4 pr-2 rounded-2xl transition-all duration-300",
                        isScrolled
                            ? "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl shadow-black/20"
                            : "bg-transparent"
                    )}>
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Image
                                    src="/logo.png"
                                    alt="FreightSnap"
                                    width={40}
                                    height={40}
                                    className="rounded-xl shadow-lg shadow-black/20 relative z-10"
                                />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                                FreightSnap
                            </span>
                            {isPro && <ProBadge />}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-zinc-800/50 backdrop-blur-md absolute left-1/2 -translate-x-1/2">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                                            isActive
                                                ? "text-zinc-100"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-pill"
                                                className="absolute inset-0 bg-zinc-800 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {!isPro && <UsageBadge />}

                            {!isPro && (
                                <button
                                    onClick={() => setShowLicenseModal(true)}
                                    className="group relative flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <Crown className="w-4 h-4 fill-white/20" />
                                    Upgrade
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-zinc-800/50 bg-zinc-950/90 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 active:bg-zinc-900"
                                    >
                                        <span className="text-zinc-200 font-medium">{link.label}</span>
                                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}
