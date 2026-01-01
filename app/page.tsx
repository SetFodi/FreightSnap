"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Dropzone, type UploadedFile } from "@/components/dropzone";
import { DataTable } from "@/components/data-table";
import { ExportButton } from "@/components/export-button";
import { GlassContainer } from "@/components/glass-container";
import { parseDocument } from "@/app/actions/parse-pdf";
import { Zap, FileSpreadsheet, Sparkles } from "lucide-react";
import type { ExtractedData } from "@/lib/gemini";

export default function HomePage() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const processFile = useCallback(async (uploadedFile: UploadedFile) => {
        setFiles((prev) =>
            prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, status: "reading" as const } : f
            )
        );

        await new Promise((resolve) => setTimeout(resolve, 300));

        setFiles((prev) =>
            prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, status: "extracting" as const } : f
            )
        );

        const formData = new FormData();
        formData.append("file", uploadedFile.file);

        const result = await parseDocument(formData);

        if (result.success && result.data) {
            setExtractedData((prev) => {
                if (!prev) return result.data!;
                const allColumns = [...new Set([...prev.columns, ...result.data!.columns])];
                const allRows = [...prev.rows, ...result.data!.rows];
                return {
                    ...result.data!,
                    columns: allColumns,
                    rows: allRows,
                    summary: {
                        total_rows: allRows.length,
                        key_info: `Combined data from multiple files`,
                    },
                };
            });

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === uploadedFile.id ? { ...f, status: "done" as const } : f
                )
            );
        } else {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === uploadedFile.id
                        ? { ...f, status: "error" as const, errorMessage: result.error }
                        : f
                )
            );
        }
    }, []);

    const handleFilesAdded = useCallback(
        async (newFiles: File[]) => {
            const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                status: "pending" as const,
            }));

            setFiles((prev) => [...prev, ...uploadedFiles]);
            setIsProcessing(true);

            for (const uploadedFile of uploadedFiles) {
                await processFile(uploadedFile);
            }

            setIsProcessing(false);
        },
        [processFile]
    );

    const handleRemoveFile = useCallback((id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    }, []);

    const handleUpdateRow = useCallback((rowIndex: number, field: string, value: string) => {
        setExtractedData((prev) => {
            if (!prev) return null;
            const newRows = [...prev.rows];
            newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
            return { ...prev, rows: newRows };
        });
    }, []);

    const handleDeleteRow = useCallback((rowIndex: number) => {
        setExtractedData((prev) => {
            if (!prev) return null;
            const newRows = prev.rows.filter((_, i) => i !== rowIndex);
            return { ...prev, rows: newRows, summary: { ...prev.summary, total_rows: newRows.length } };
        });
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold gradient-text">FreightSnap</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/about"
                                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                About
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Sparkles className="w-4 h-4" />
                                <span>AI-Powered</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="container mx-auto px-6 py-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                            Extract Data from{" "}
                            <span className="gradient-text">Any Document</span>
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Drop PDFs, CSVs, or Excel files. AI extracts all data into clean, editable tables.
                        </p>
                    </motion.div>
                </section>

                {/* Main */}
                <section className="container mx-auto px-6 pb-24">
                    <GlassContainer className="p-8 max-w-5xl mx-auto" variant="intense">
                        <div className="space-y-8">
                            <Dropzone
                                files={files}
                                onFilesAdded={handleFilesAdded}
                                onRemoveFile={handleRemoveFile}
                            />

                            {extractedData && extractedData.rows.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <DataTable
                                        data={extractedData}
                                        onUpdateRow={handleUpdateRow}
                                        onDeleteRow={handleDeleteRow}
                                    />
                                </motion.div>
                            )}

                            {extractedData && extractedData.rows.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center justify-between pt-4 border-t border-zinc-700/50"
                                >
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <span className="text-sm">
                                            Ready to export {extractedData.rows.length} rows
                                        </span>
                                    </div>
                                    <ExportButton data={extractedData} disabled={isProcessing} />
                                </motion.div>
                            )}
                        </div>
                    </GlassContainer>
                </section>

                <footer className="fixed bottom-0 inset-x-0 py-4 text-center text-sm text-zinc-600">
                    <p>Built with Next.js 15, Tailwind CSS &amp; Groq AI</p>
                </footer>
            </div>
        </div>
    );
}
