"use client";

import { motion } from "framer-motion";
import { FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type FileStatus = "pending" | "reading" | "extracting" | "done" | "error";

interface FileItemProps {
    filename: string;
    status: FileStatus;
    errorMessage?: string;
    onRemove?: () => void;
}

const statusConfig: Record<
    FileStatus,
    { label: string; icon: React.ReactNode; color: string }
> = {
    pending: {
        label: "Queued",
        icon: <FileText className="w-4 h-4" />,
        color: "text-zinc-400",
    },
    reading: {
        label: "Reading PDF...",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        color: "text-zinc-300",
    },
    extracting: {
        label: "Extracting Prices...",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        color: "text-primary",
    },
    done: {
        label: "Done",
        icon: <Check className="w-4 h-4" />,
        color: "text-success",
    },
    error: {
        label: "Error",
        icon: <AlertCircle className="w-4 h-4" />,
        color: "text-error",
    },
};

export function FileItem({ filename, status, errorMessage, onRemove }: FileItemProps) {
    const config = statusConfig[status];
    const isProcessing = status === "reading" || status === "extracting";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn("flex-shrink-0 transition-colors", config.color)}>
                    {config.icon}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-zinc-100 truncate">
                        {filename}
                    </span>
                    <div className="flex items-center gap-2">
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-24" />
                                <span className={cn("text-xs streaming-text", config.color)}>
                                    {config.label}
                                </span>
                            </div>
                        ) : (
                            <span className={cn("text-xs", config.color)}>
                                {errorMessage || config.label}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {onRemove && (
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity p-1"
                    aria-label="Remove file"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
}
