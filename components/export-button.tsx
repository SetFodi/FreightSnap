"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExtractedData } from "@/lib/gemini";
import * as XLSX from "xlsx";

interface ExportButtonProps {
    data: ExtractedData | null;
    disabled?: boolean;
}

export function ExportButton({ data, disabled }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);

    const handleExport = useCallback(async () => {
        if (!data || data.rows.length === 0 || disabled) return;

        setIsExporting(true);

        try {
            // Create workbook
            const workbook = XLSX.utils.book_new();

            // Convert rows to worksheet
            const worksheet = XLSX.utils.json_to_sheet(data.rows, {
                header: data.columns,
            });

            // Auto-size columns
            const colWidths = data.columns.map((col) => {
                const maxLen = Math.max(
                    col.length,
                    ...data.rows.map((row) => String(row[col] || "").length)
                );
                return { wch: Math.min(maxLen + 2, 40) };
            });
            worksheet["!cols"] = colWidths;

            XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");

            // Generate filename
            const date = new Date().toISOString().split("T")[0];
            const docType = data.document_type?.replace(/[^a-zA-Z0-9]/g, "_") || "Data";
            const filename = `FreightSnap_${docType}_${date}.xlsx`;

            // Download
            XLSX.writeFile(workbook, filename);

            setExportComplete(true);
            setTimeout(() => setExportComplete(false), 2000);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    }, [data, disabled]);

    const rowCount = data?.rows?.length || 0;

    return (
        <Button
            onClick={handleExport}
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
                ) : isExporting ? (
                    <Sparkles className="w-5 h-5 animate-pulse" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>
                    {exportComplete
                        ? "Exported!"
                        : isExporting
                            ? "Generating..."
                            : "Export to Excel"}
                </span>
            </motion.div>
        </Button>
    );
}
