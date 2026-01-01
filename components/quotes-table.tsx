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

export interface FreightQuote {
    id: string;
    carrier: string;
    origin: string;
    destination: string;
    weight: string;
    price: string;
    currency: string;
    transitDays: string;
    serviceType: string;
}

interface QuotesTableProps {
    quotes: FreightQuote[];
    onUpdateQuote: (id: string, field: keyof FreightQuote, value: string) => void;
    onDeleteQuote: (id: string) => void;
}

interface EditingCell {
    id: string;
    field: keyof FreightQuote;
}

export function QuotesTable({ quotes, onUpdateQuote, onDeleteQuote }: QuotesTableProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [editValue, setEditValue] = useState("");

    const startEditing = useCallback((id: string, field: keyof FreightQuote, currentValue: string) => {
        setEditingCell({ id, field });
        setEditValue(currentValue);
    }, []);

    const saveEdit = useCallback(() => {
        if (editingCell) {
            onUpdateQuote(editingCell.id, editingCell.field, editValue);
            setEditingCell(null);
            setEditValue("");
        }
    }, [editingCell, editValue, onUpdateQuote]);

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

    if (quotes.length === 0) {
        return null;
    }

    const columns: { key: keyof FreightQuote; label: string; width?: string }[] = [
        { key: "carrier", label: "Carrier", width: "w-[140px]" },
        { key: "origin", label: "Origin", width: "w-[120px]" },
        { key: "destination", label: "Destination", width: "w-[120px]" },
        { key: "weight", label: "Weight" },
        { key: "price", label: "Price" },
        { key: "transitDays", label: "Transit" },
        { key: "serviceType", label: "Service" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">
                    Extracted Quotes
                </h3>
                <span className="text-sm text-zinc-500">
                    {quotes.length} quote{quotes.length !== 1 ? "s" : ""}
                </span>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key} className={col.width}>
                                {col.label}
                            </TableHead>
                        ))}
                        <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence mode="popLayout">
                        {quotes.map((quote) => (
                            <motion.tr
                                key={quote.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="border-b border-border transition-colors hover:bg-muted/50 group"
                            >
                                {columns.map((col) => {
                                    const isEditing =
                                        editingCell?.id === quote.id && editingCell?.field === col.key;
                                    const value = quote[col.key];

                                    return (
                                        <TableCell key={col.key} className={cn("relative", col.width)}>
                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        autoFocus
                                                        className="h-7 text-sm"
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
                                                    onClick={() => startEditing(quote.id, col.key, value)}
                                                    className="flex items-center gap-2 cursor-pointer group/cell"
                                                >
                                                    <span className="text-zinc-100">
                                                        {col.key === "price"
                                                            ? `${quote.currency} ${value}`
                                                            : col.key === "transitDays"
                                                                ? `${value} days`
                                                                : value}
                                                    </span>
                                                    <Pencil className="w-3 h-3 text-zinc-600 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>
                                    <button
                                        onClick={() => onDeleteQuote(quote.id)}
                                        className="p-1.5 text-zinc-600 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label="Delete quote"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </TableBody>
            </Table>
        </motion.div>
    );
}
