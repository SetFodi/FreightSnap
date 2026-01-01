"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Check, Loader2, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyGumroadLicense } from "@/app/actions/verify-license";

const STORAGE_KEY = "freightsnap_pro";

interface LicenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function LicenseModal({ isOpen, onClose, onSuccess }: LicenseModalProps) {
    const [licenseKey, setLicenseKey] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!licenseKey.trim()) {
            setError("Please enter your license key");
            return;
        }

        setIsVerifying(true);
        setError("");

        const result = await verifyGumroadLicense(licenseKey);

        if (result.success) {
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, "true");
            setShowSuccess(true);

            // Trigger confetti effect
            triggerConfetti();

            // Close after animation
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } else {
            setError(result.error || "Invalid license key");
        }

        setIsVerifying(false);
    }, [licenseKey, onSuccess, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6">
                            {showSuccess ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                                    >
                                        <Crown className="w-10 h-10 text-green-400" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-zinc-100 mb-2">
                                        Pro Unlocked! 🎉
                                    </h3>
                                    <p className="text-zinc-400">
                                        You now have unlimited access to all features.
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/20">
                                                <Key className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-zinc-100">
                                                Activate Pro
                                            </h3>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="mb-6 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm text-zinc-300 font-medium mb-1">
                                                    Pro Features Include:
                                                </p>
                                                <ul className="text-sm text-zinc-400 space-y-1">
                                                    <li>• Unlimited file processing</li>
                                                    <li>• QuickBooks & Xero export</li>
                                                    <li>• Priority processing</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* License Input */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                                License Key
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                                                value={licenseKey}
                                                onChange={(e) => {
                                                    setLicenseKey(e.target.value);
                                                    setError("");
                                                }}
                                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                                className="font-mono"
                                            />
                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-red-400 mt-2"
                                                >
                                                    {error}
                                                </motion.p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isVerifying || !licenseKey.trim()}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isVerifying ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Activate Pro
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Buy link */}
                                    <div className="text-center text-sm text-zinc-500 mt-4 space-y-1">
                                        <p>
                                            Don&apos;t have a license?{" "}
                                            <a
                                                href="https://freightsnap.gumroad.com/l/uygsqg/andromeda"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                Get it here →
                                            </a>
                                        </p>
                                        <p className="text-xs text-zinc-600">
                                            Cleared your cache? Just re-enter your key from the purchase email.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Simple confetti effect using canvas
function triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
    }> = [];

    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
        });
    }

    let frame = 0;
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; // gravity

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        frame++;
        if (frame < 60) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    }

    animate();
}

// Hook to check Pro status
export function useProStatus() {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        setIsPro(localStorage.getItem(STORAGE_KEY) === "true");
    }, []);

    const refresh = useCallback(() => {
        setIsPro(localStorage.getItem(STORAGE_KEY) === "true");
    }, []);

    return { isPro, refresh };
}

// Pro Badge component
export function ProBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <Crown className="w-3 h-3" />
            PRO
        </span>
    );
}
