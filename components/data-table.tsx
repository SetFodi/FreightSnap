"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pencil, Check, X, Trash2, Search, TrendingDown, DollarSign } from "lucide-react";
import type { ExtractedData } from "@/lib/gemini";

interface DataTableProps {
    data: ExtractedData;
    onUpdateRow: (rowIndex: number, field: string, value: string) => void;
    onDeleteRow: (rowIndex: number) => void;
}

interface EditingCell {
    rowIndex: number;
    field: string;
}

// Currency symbols for detection
const currencyPatterns = [
    { symbol: "$", code: "USD" },
    { symbol: "€", code: "EUR" },
    { symbol: "£", code: "GBP" },
    { symbol: "₾", code: "GEL" },
    { symbol: "¥", code: "JPY" },
    { symbol: "USD", code: "USD" },
    { symbol: "EUR", code: "EUR" },
    { symbol: "GBP", code: "GBP" },
    { symbol: "GEL", code: "GEL" },
];

// Detect currencies in data
function detectCurrencies(rows: Record<string, string>[]): string[] {
    const found = new Set<string>();
    rows.forEach((row) => {
        Object.values(row).forEach((val) => {
            if (!val) return;
            currencyPatterns.forEach(({ symbol, code }) => {
                if (val.includes(symbol)) {
                    found.add(code);
                }
            });
        });
    });
    return Array.from(found);
}

// Find the "price" column and the best (lowest) price row
function findBestPriceRow(rows: Record<string, string>[], columns: string[]): number | null {
    const priceColumns = columns.filter((col) =>
        /price|rate|amount|total|cost|charge|fee/i.test(col) &&
        !/tax|vat|surcharge/i.test(col)
    );

    if (priceColumns.length === 0) return null;

    const priceCol = priceColumns[0];
    let bestRow = -1;
    let bestPrice = Infinity;

    rows.forEach((row, index) => {
        const val = row[priceCol];
        if (!val) return;

        const numericStr = val.replace(/[^0-9.-]/g, "");
        const price = parseFloat(numericStr);

        if (!isNaN(price) && price > 0 && price < bestPrice) {
            bestPrice = price;
            bestRow = index;
        }
    });

    return bestRow >= 0 ? bestRow : null;
}

export function DataTable({ data, onUpdateRow, onDeleteRow }: DataTableProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [editValue, setEditValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const startEditing = useCallback((rowIndex: number, field: string, currentValue: string) => {
        setEditingCell({ rowIndex, field });
        setEditValue(currentValue || "");
    }, []);

    const saveEdit = useCallback(() => {
        if (editingCell) {
            onUpdateRow(editingCell.rowIndex, editingCell.field, editValue);
            setEditingCell(null);
            setEditValue("");
        }
    }, [editingCell, editValue, onUpdateRow]);

    const cancelEdit = useCallback(() => {
        setEditingCell(null);
        setEditValue("");
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                saveEdit();
            } else if (e.key === "Escape") {
                cancelEdit();
            }
        },
        [saveEdit, cancelEdit]
    );

    const filteredRows = useMemo(() => {
        if (!searchQuery.trim()) return data.rows;
        const query = searchQuery.toLowerCase();
        return data.rows.filter((row) =>
            Object.values(row).some((val) =>
                String(val || "").toLowerCase().includes(query)
            )
        );
    }, [data.rows, searchQuery]);

    const bestPriceRow = useMemo(() => {
        return findBestPriceRow(data.rows, data.columns);
    }, [data.rows, data.columns]);

    const detectedCurrencies = useMemo(() => {
        return detectCurrencies(data.rows);
    }, [data.rows]);

    if (!data.rows || data.rows.length === 0) {
        return null;
    }

    const columns = data.columns.length > 0
        ? data.columns
        : Object.keys(data.rows[0] || {});

    const visibleColumns = columns.slice(0, 10);
    const hasMoreColumns = columns.length > 10;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                        Extracted Data
                    </h3>
                    <p className="text-sm text-zinc-500">
                        {data.document_type && <span className="capitalize">{data.document_type}</span>}
                        {data.source && <span> • {data.source}</span>}
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search rows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-64 h-9"
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-zinc-400">
                    Showing {filteredRows.length} of {data.rows.length} rows • {columns.length} columns
                </span>
                {bestPriceRow !== null && (
                    <span className="flex items-center gap-1 text-green-400 text-xs px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <TrendingDown className="w-3 h-3" />
                        Best price highlighted
                    </span>
                )}
                {detectedCurrencies.length > 0 && (
                    <span className="flex items-center gap-1 text-blue-400 text-xs px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <DollarSign className="w-3 h-3" />
                        {detectedCurrencies.join(", ")} detected
                    </span>
                )}
                {hasMoreColumns && (
                    <span className="text-xs text-zinc-500 ml-auto">Scroll right for more →</span>
                )}
            </div>

            {data.summary?.key_info && (
                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <p className="text-sm text-zinc-300">{data.summary.key_info}</p>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-zinc-700/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((col) => (
                                <TableHead key={col} className="whitespace-nowrap min-w-[100px]">
                                    {col.replace(/_/g, " ")}
                                </TableHead>
                            ))}
                            <TableHead className="w-[60px] sticky right-0 bg-zinc-900"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredRows.map((row, rowIndex) => {
                                const originalIndex = data.rows.indexOf(row);
                                const isBestPrice = originalIndex === bestPriceRow;

                                return (
                                    <motion.tr
                                        key={rowIndex}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "border-b border-border transition-colors hover:bg-muted/50 group",
                                            isBestPrice && "bg-green-500/5 hover:bg-green-500/10 border-green-500/20"
                                        )}
                                    >
                                        {visibleColumns.map((col) => {
                                            const isEditing =
                                                editingCell?.rowIndex === rowIndex && editingCell?.field === col;
                                            const value = row[col] || "";

                                            return (
                                                <TableCell key={col} className="whitespace-nowrap">
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onKeyDown={handleKeyDown}
                                                                autoFocus
                                                                className="h-7 text-sm min-w-[80px]"
                                                            />
                                                            <button
                                                                onClick={saveEdit}
                                                                className="p-1 text-success hover:text-success/80"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="p-1 text-zinc-400 hover:text-zinc-300"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => startEditing(rowIndex, col, value)}
                                                            className="flex items-center gap-2 cursor-pointer group/cell max-w-[200px] truncate"
                                                            title={value}
                                                        >
                                                            <span className={cn(
                                                                "truncate",
                                                                isBestPrice ? "text-green-300 font-medium" : "text-zinc-100"
                                                            )}>
                                                                {value || <span className="text-zinc-600">—</span>}
                                                            </span>
                                                            <Pencil className="w-3 h-3 text-zinc-600 opacity-0 group-hover/cell:opacity-100 transition-opacity flex-shrink-0" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell className={cn(
                                            "sticky right-0 backdrop-blur-sm",
                                            isBestPrice ? "bg-green-500/10" : "bg-zinc-900/80"
                                        )}>
                                            <button
                                                onClick={() => onDeleteRow(originalIndex)}
                                                className="p-1.5 text-zinc-600 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                                                aria-label="Delete row"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {filteredRows.length === 0 && searchQuery && (
                <div className="text-center py-8 text-zinc-500">
                    No rows match &quot;{searchQuery}&quot;
                </div>
            )}
        </motion.div>
    );
}
