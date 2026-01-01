"use client";

import { useState, useCallback } from "react";
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
import { Pencil, Check, X, Trash2 } from "lucide-react";
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

export function DataTable({ data, onUpdateRow, onDeleteRow }: DataTableProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [editValue, setEditValue] = useState("");

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

    if (!data.rows || data.rows.length === 0) {
        return null;
    }

    // Use columns from data, or infer from first row
    const columns = data.columns.length > 0
        ? data.columns
        : Object.keys(data.rows[0] || {});

    // Limit visible columns for better UX (show first 8, scrollable)
    const visibleColumns = columns.slice(0, 10);
    const hasMoreColumns = columns.length > 10;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
        >
            {/* Header with document info */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                        Extracted Data
                    </h3>
                    <p className="text-sm text-zinc-500">
                        {data.document_type && <span className="capitalize">{data.document_type}</span>}
                        {data.source && <span> • {data.source}</span>}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-sm text-zinc-400">
                        {data.rows.length} rows • {columns.length} columns
                    </span>
                    {hasMoreColumns && (
                        <p className="text-xs text-zinc-500">Scroll right for more →</p>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.summary?.key_info && (
                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <p className="text-sm text-zinc-300">{data.summary.key_info}</p>
                </div>
            )}

            {/* Scrollable table container */}
            <div className="overflow-x-auto">
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
                            {data.rows.map((row, rowIndex) => (
                                <motion.tr
                                    key={rowIndex}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-b border-border transition-colors hover:bg-muted/50 group"
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
                                                        <span className="text-zinc-100 truncate">
                                                            {value || <span className="text-zinc-600">—</span>}
                                                        </span>
                                                        <Pencil className="w-3 h-3 text-zinc-600 opacity-0 group-hover/cell:opacity-100 transition-opacity flex-shrink-0" />
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className="sticky right-0 bg-zinc-900/80 backdrop-blur-sm">
                                        <button
                                            onClick={() => onDeleteRow(rowIndex)}
                                            className="p-1.5 text-zinc-600 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                                            aria-label="Delete row"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}
