"use client";

import { motion } from "framer-motion";
import { File, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileStatus = "pending" | "reading" | "extracting" | "done" | "error";

interface FileItemProps {
    filename: string;
    status: FileStatus;
    errorMessage?: string;
    onRemove?: () => void;
}

const statusConfig = {
    pending: {
        icon: Loader2,
        text: "Waiting...",
        className: "text-zinc-500",
        iconClass: "animate-spin",
    },
    reading: {
        icon: Loader2,
        text: "Reading file...",
        className: "text-blue-400",
        iconClass: "animate-spin",
    },
    extracting: {
        icon: Loader2,
        text: "Extracting data...",
        className: "text-primary",
        iconClass: "animate-spin",
    },
    done: {
        icon: CheckCircle,
        text: "Done",
        className: "text-success",
        iconClass: "",
    },
    error: {
        icon: AlertCircle,
        text: "Failed",
        className: "text-error",
        iconClass: "",
    },
};

export function FileItem({ filename, status, errorMessage, onRemove }: FileItemProps) {
    const config = statusConfig[status];
    const StatusIcon = config.icon;

    // Get file extension for icon color
    const ext = filename?.split(".")?.pop()?.toLowerCase() || "";
    const extColors: Record<string, string> = {
        pdf: "text-red-400",
        csv: "text-green-400",
        xls: "text-emerald-400",
        xlsx: "text-emerald-400",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="group relative flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors"
        >
            {/* File icon with extension color */}
            <div className="flex-shrink-0">
                <File className={cn("w-8 h-8", extColors[ext] || "text-zinc-400")} />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate" title={filename}>
                    {filename}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    <StatusIcon className={cn("w-3.5 h-3.5", config.className, config.iconClass)} />
                    <span className={cn("text-xs", config.className)}>
                        {status === "error" && errorMessage ? errorMessage : config.text}
                    </span>
                </div>
            </div>

            {/* Progress bar for reading/extracting */}
            {(status === "reading" || status === "extracting") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden bg-zinc-700">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                            width: status === "reading" ? "40%" : "80%",
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary/50"
                    />
                    {status === "extracting" && (
                        <motion.div
                            className="absolute inset-0 h-full"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                </div>
            )}

            {/* Remove button */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="flex-shrink-0 p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove file"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}
