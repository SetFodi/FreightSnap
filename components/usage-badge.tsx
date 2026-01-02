"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Zap } from "lucide-react";
import Link from "next/link";

const FREE_LIMIT = 3;
const STORAGE_KEY = "freightsnap_usage";

interface UsageData {
    count: number;
    date: string;
}

function getTodayUsage(): number {
    if (typeof window === "undefined") return 0;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;

    try {
        const data: UsageData = JSON.parse(stored);
        const today = new Date().toISOString().split("T")[0];

        if (data.date !== today) {
            // Reset for new day
            return 0;
        }

        return data.count;
    } catch {
        return 0;
    }
}

export function incrementUsage(): number {
    const today = new Date().toISOString().split("T")[0];
    const current = getTodayUsage();
    const newCount = current + 1;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        count: newCount,
        date: today,
    }));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("freightsnap_usage_updated"));

    return newCount;
}

export function canProcessFile(): boolean {
    return getTodayUsage() < FREE_LIMIT;
}

export function UsageBadge() {
    const [usage, setUsage] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setUsage(getTodayUsage());

        // Listen for storage changes (cross-tab) AND custom event (same-tab)
        const handleStorage = () => setUsage(getTodayUsage());
        window.addEventListener("storage", handleStorage);
        window.addEventListener("freightsnap_usage_updated", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("freightsnap_usage_updated", handleStorage);
        };
    }, []);

    if (!mounted) return null;

    const remaining = FREE_LIMIT - usage;
    const isLow = remaining <= 1;
    const isExhausted = remaining <= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
        >
            {/* Usage indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isExhausted
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : isLow
                    ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                    : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400"
                }`}>
                <FileText className="w-3.5 h-3.5" />
                <span>
                    {isExhausted
                        ? "Daily limit reached"
                        : `${remaining}/${FREE_LIMIT} files left today`}
                </span>
            </div>

            {/* Upgrade prompt */}
            {(isLow || isExhausted) && (
                <Link
                    href="/pricing"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                    <Zap className="w-3.5 h-3.5" />
                    Upgrade
                </Link>
            )}
        </motion.div>
    );
}
