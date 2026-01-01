"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileItem, type FileStatus } from "./file-item";

export interface UploadedFile {
    id: string;
    file: File;
    status: FileStatus;
    errorMessage?: string;
}

interface DropzoneProps {
    onFilesAdded: (files: File[]) => void;
    files: UploadedFile[];
    onRemoveFile?: (id: string) => void;
}

export function Dropzone({ onFilesAdded, files, onRemoveFile }: DropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Accept PDF, CSV, XLS, XLSX files
            const validFiles = acceptedFiles.filter((file) => {
                const name = file.name.toLowerCase();
                return (
                    file.type === "application/pdf" ||
                    file.type === "text/csv" ||
                    file.type.includes("spreadsheet") ||
                    file.type.includes("excel") ||
                    name.endsWith(".pdf") ||
                    name.endsWith(".csv") ||
                    name.endsWith(".xls") ||
                    name.endsWith(".xlsx")
                );
            });
            if (validFiles.length > 0) {
                onFilesAdded(validFiles);
            }
        },
        [onFilesAdded]
    );

    const { getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "text/csv": [".csv"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        onDropAccepted: () => setIsDragActive(false),
        onDropRejected: () => setIsDragActive(false),
    });

    return (
        <div className="space-y-6">
            {/* Dropzone Area */}
            <motion.div
                {...getRootProps()}
                data-drag-active={isDragActive}
                className={cn(
                    "dropzone-magnetic relative flex flex-col items-center justify-center gap-4",
                    "min-h-[280px] p-8 rounded-2xl cursor-pointer",
                    "border-2 border-dashed",
                    "bg-zinc-900/50",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : isDragReject
                            ? "border-error bg-error/5"
                            : "border-zinc-700 hover:border-zinc-600"
                )}
                animate={{
                    scale: isDragActive ? 1.02 : 1,
                    borderColor: isDragActive ? "rgb(99, 102, 241)" : undefined,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                <input {...getInputProps()} />

                {/* Magnetic glow effect */}
                <AnimatePresence>
                    {isDragActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
                        />
                    )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                    animate={{
                        y: isDragActive ? -10 : 0,
                        scale: isDragActive ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                        "p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/50",
                        isDragActive && "bg-primary/20 border-primary/30"
                    )}
                >
                    {isDragActive ? (
                        <FileText className="w-10 h-10 text-primary" />
                    ) : (
                        <Upload className="w-10 h-10 text-zinc-400" />
                    )}
                </motion.div>

                {/* Text */}
                <div className="text-center z-10">
                    <motion.p
                        className="text-lg font-medium text-zinc-100"
                        animate={{ scale: isDragActive ? 1.05 : 1 }}
                    >
                        {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files"}
                    </motion.p>
                    <p className="mt-1 text-sm text-zinc-500">
                        {isDragActive
                            ? "Release to upload"
                            : "or click to browse from your computer"}
                    </p>
                </div>

                {/* Supported format badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 mt-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-400">PDF, CSV, XLS, XLSX</span>
                </div>
            </motion.div>

            {/* File List */}
            <AnimatePresence mode="popLayout">
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        <p className="text-sm font-medium text-zinc-300 mb-3">
                            {files.length} file{files.length > 1 ? "s" : ""} queued
                        </p>
                        {files.map((file) => (
                            <FileItem
                                key={file.id}
                                filename={file.file.name}
                                status={file.status}
                                errorMessage={file.errorMessage}
                                onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
