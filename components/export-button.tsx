"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Check, FileSpreadsheet, FileText, X, Building2, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExtractedData } from "@/lib/gemini";
import * as XLSX from "xlsx";

interface ExportButtonProps {
    data: ExtractedData | null;
    disabled?: boolean;
    onUpgradeClick?: () => void;
}

type ExportFormat = "xlsx" | "csv" | "quickbooks" | "odoo";

interface FormatOption {
    id: ExportFormat;
    name: string;
    description: string;
    icon: typeof FileSpreadsheet;
    pro?: boolean;
}

const formatOptions: FormatOption[] = [
    {
        id: "xlsx",
        name: "Excel (.xlsx)",
        description: "Best for editing and analysis",
        icon: FileSpreadsheet,
    },
    {
        id: "csv",
        name: "CSV (.csv)",
        description: "Universal format, works everywhere",
        icon: FileText,
    },
    {
        id: "quickbooks",
        name: "QuickBooks Format",
        description: "Ready to import into QuickBooks",
        icon: Building2,
        pro: true,
    },
    {
        id: "odoo",
        name: "Odoo Format",
        description: "Ready to import into Odoo",
        icon: Building2,
        pro: true,
    },
];

// Column mappings for different accounting software
const columnMappings: Record<string, Record<string, string>> = {
    quickbooks: {
        event_type_id: "Item",
        event_entity_id: "Description",
        amount: "Amount",
        rate_billed: "Rate",
        quantity_billed: "Quantity",
        description: "Memo",
        invoice_final_nbr: "RefNumber",
        event_perform_from: "Date",
    },
    odoo: {
        event_type_id: "product_id",
        event_entity_id: "name",
        amount: "price_unit",
        rate_billed: "price_subtotal",
        quantity_billed: "quantity",
        description: "display_name",
        invoice_final_nbr: "move_name",
        event_perform_from: "invoice_date",
    },
};

const PRO_STORAGE_KEY = "freightsnap_pro";

export function ExportButton({ data, disabled, onUpgradeClick }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isPro, setIsPro] = useState(false);

    // Check Pro status on mount and when modal opens
    useEffect(() => {
        setIsPro(localStorage.getItem(PRO_STORAGE_KEY) === "true");
    }, [showModal]);

    const handleExport = useCallback(async (format: ExportFormat) => {
        if (!data || data.rows.length === 0 || disabled) return;

        // Check if Pro feature and user doesn't have Pro
        if ((format === "quickbooks" || format === "odoo") && !isPro) {
            setShowModal(false);
            onUpgradeClick?.();
            return;
        }

        setIsExporting(true);
        setShowModal(false);

        try {
            const workbook = XLSX.utils.book_new();
            let exportRows = data.rows;
            let exportColumns = data.columns;

            // Apply column mappings for accounting software
            if (format === "quickbooks" || format === "odoo") {
                const mapping = columnMappings[format];
                exportRows = data.rows.map((row) => {
                    const newRow: Record<string, string> = {};
                    data.columns.forEach((col) => {
                        const newCol = mapping[col] || col;
                        newRow[newCol] = row[col] || "";
                    });
                    return newRow;
                });
                exportColumns = data.columns.map((col) => mapping[col] || col);
            }

            const worksheet = XLSX.utils.json_to_sheet(exportRows, {
                header: exportColumns,
            });

            // Auto-size columns
            const colWidths = exportColumns.map((col) => {
                const maxLen = Math.max(
                    col.length,
                    ...exportRows.map((row) => String(row[col] || "").length)
                );
                return { wch: Math.min(maxLen + 2, 40) };
            });
            worksheet["!cols"] = colWidths;

            XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");

            const date = new Date().toISOString().split("T")[0];
            const formatSuffix = format === "quickbooks" ? "_QB" : format === "odoo" ? "_Odoo" : "";

            if (format === "csv") {
                XLSX.writeFile(workbook, `FreightSnap${formatSuffix}_${date}.csv`, { bookType: "csv" });
            } else {
                XLSX.writeFile(workbook, `FreightSnap${formatSuffix}_${date}.xlsx`);
            }

            setExportComplete(true);
            setTimeout(() => setExportComplete(false), 2000);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    }, [data, disabled, isPro, onUpgradeClick]);

    const rowCount = data?.rows?.length || 0;

    return (
        <>
            <Button
                onClick={() => setShowModal(true)}
                disabled={disabled || rowCount === 0 || isExporting}
                size="lg"
                className={cn(
                    "relative overflow-hidden transition-all duration-300",
                    exportComplete && "bg-success hover:bg-success/90"
                )}
            >
                <motion.div
                    className="flex items-center gap-2"
                    animate={{ scale: isExporting ? 0.95 : 1 }}
                >
                    {exportComplete ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    <span>
                        {exportComplete
                            ? "Exported!"
                            : isExporting
                                ? "Exporting..."
                                : "Export"}
                    </span>
                </motion.div>
            </Button>

            {/* Export Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setShowModal(false)}
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
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-zinc-100">
                                        Export Data
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Row count */}
                                <div className="mb-6 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                    <p className="text-sm text-zinc-400">
                                        Exporting <span className="text-zinc-100 font-medium">{rowCount} rows</span> with{" "}
                                        <span className="text-zinc-100 font-medium">{data?.columns.length || 0} columns</span>
                                    </p>
                                </div>

                                {/* Format options */}
                                <div className="space-y-3">
                                    {formatOptions.map((option) => {
                                        const isLocked = option.pro && !isPro;

                                        return (
                                            <motion.button
                                                key={option.id}
                                                onClick={() => handleExport(option.id)}
                                                whileHover={{ scale: isLocked ? 1 : 1.02 }}
                                                whileTap={{ scale: isLocked ? 1 : 0.98 }}
                                                className={cn(
                                                    "w-full p-4 rounded-xl border transition-all group text-left relative",
                                                    isLocked
                                                        ? "bg-zinc-800/30 border-zinc-700/30 cursor-not-allowed"
                                                        : "bg-zinc-800/50 border-zinc-700/50 hover:border-primary/50 hover:bg-zinc-800"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-lg transition-colors",
                                                        isLocked
                                                            ? "bg-zinc-700/30"
                                                            : "bg-zinc-700/50 group-hover:bg-primary/20"
                                                    )}>
                                                        {isLocked ? (
                                                            <Lock className="w-5 h-5 text-zinc-500" />
                                                        ) : (
                                                            <option.icon className={cn(
                                                                "w-5 h-5 transition-colors",
                                                                isLocked ? "text-zinc-500" : "text-zinc-400 group-hover:text-primary"
                                                            )} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className={cn(
                                                                "font-medium",
                                                                isLocked ? "text-zinc-500" : "text-zinc-100"
                                                            )}>
                                                                {option.name}
                                                            </p>
                                                            {option.pro && (
                                                                <span className={cn(
                                                                    "text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1",
                                                                    isPro
                                                                        ? "bg-amber-500/20 text-amber-400"
                                                                        : "bg-zinc-700 text-zinc-400"
                                                                )}>
                                                                    <Crown className="w-2.5 h-2.5" />
                                                                    PRO
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={cn(
                                                            "text-sm",
                                                            isLocked ? "text-zinc-600" : "text-zinc-500"
                                                        )}>
                                                            {isLocked ? "Upgrade to unlock" : option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Upgrade prompt for non-Pro users */}
                                {!isPro && (
                                    <div className="mt-4 pt-4 border-t border-zinc-700/50 text-center">
                                        <p className="text-sm text-zinc-500">
                                            Unlock Pro exports for just{" "}
                                            <span className="text-zinc-300 font-medium">$29</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
