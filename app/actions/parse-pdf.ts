"use server";

import { groq, GROQ_MODEL, DYNAMIC_EXTRACTION_PROMPT, type ExtractedData } from "@/lib/gemini";
import { extractText } from "unpdf";
import * as XLSX from "xlsx";

export interface ParseResult {
    success: boolean;
    data?: ExtractedData;
    error?: string;
}

// Find the actual header row (the one with the most non-empty columns)
function findHeaderRow(data: string[][]): number {
    let maxCols = 0;
    let headerRow = 0;

    for (let i = 0; i < Math.min(data.length, 10); i++) {
        const nonEmptyCols = data[i].filter((cell) => cell && cell.trim() !== "").length;
        if (nonEmptyCols > maxCols) {
            maxCols = nonEmptyCols;
            headerRow = i;
        }
    }

    return headerRow;
}

// Parse structured files (CSV/XLS/XLSX) directly without AI
function parseStructuredData(workbook: XLSX.WorkBook, fileName: string): ExtractedData {
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // Get raw data as array of arrays (preserves structure)
    const rawData: string[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        raw: false,
    });

    if (rawData.length < 2) {
        return {
            document_type: "spreadsheet",
            source: fileName,
            columns: [],
            rows: [],
            summary: { total_rows: 0, key_info: "Empty file" },
        };
    }

    // Find the header row (skip metadata rows)
    const headerRowIndex = findHeaderRow(rawData);
    const headerRow = rawData[headerRowIndex];

    // Clean column names and filter empty ones
    const columns: { index: number; name: string }[] = [];
    headerRow.forEach((cell, index) => {
        const cleaned = String(cell || "")
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^\w_]/g, "")
            .toLowerCase();
        if (cleaned && cleaned.length > 0) {
            columns.push({ index, name: cleaned });
        }
    });

    // Deduplicate column names
    const seenNames = new Map<string, number>();
    columns.forEach((col) => {
        const count = seenNames.get(col.name) || 0;
        if (count > 0) {
            col.name = `${col.name}_${count}`;
        }
        seenNames.set(col.name.replace(/_\d+$/, ""), count + 1);
    });

    // Extract data rows (skip everything before and including header)
    const rows: Record<string, string>[] = [];
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const row = rawData[i];

        // Skip empty rows or rows that look like repeated headers
        const firstCell = String(row[0] || "").toLowerCase();
        if (!row.some((cell) => cell && cell.trim() !== "")) continue;
        if (firstCell.includes("event type") || firstCell.includes("header")) continue;

        const rowObj: Record<string, string> = {};
        columns.forEach((col) => {
            rowObj[col.name] = String(row[col.index] || "").trim();
        });

        // Only add if has some actual data
        if (Object.values(rowObj).some((v) => v !== "")) {
            rows.push(rowObj);
        }
    }

    const columnNames = columns.map((c) => c.name);

    return {
        document_type: "spreadsheet",
        source: fileName,
        columns: columnNames,
        rows,
        summary: {
            total_rows: rows.length,
            key_info: `Extracted ${rows.length} rows with ${columnNames.length} columns`,
        },
    };
}

export async function parseDocument(formData: FormData): Promise<ParseResult> {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const fileName = file.name.toLowerCase();
        const bytes = await file.arrayBuffer();

        // For CSV/Excel - parse directly without AI (faster & more reliable)
        if (fileName.endsWith(".csv") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
            try {
                const workbook = XLSX.read(bytes, { type: "array" });
                const data = parseStructuredData(workbook, file.name);
                return { success: true, data };
            } catch (err) {
                console.error("Spreadsheet parsing error:", err);
                return { success: false, error: "Failed to parse spreadsheet file." };
            }
        }

        // For PDF - use AI extraction
        if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
            const buffer = new Uint8Array(bytes);
            let pdfText: string;

            try {
                const result = await extractText(buffer);
                pdfText = Array.isArray(result.text) ? result.text.join("\n") : String(result.text);
            } catch (pdfError) {
                console.error("PDF extraction error:", pdfError);
                return { success: false, error: "Failed to read PDF file." };
            }

            if (!pdfText || pdfText.trim().length < 10) {
                return { success: false, error: "Could not extract text from PDF." };
            }

            const maxLength = 50000;
            const truncatedText = pdfText.length > maxLength
                ? pdfText.substring(0, maxLength) + "\n...[truncated]"
                : pdfText;

            const completion = await groq.chat.completions.create({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: DYNAMIC_EXTRACTION_PROMPT },
                    { role: "user", content: `Filename: ${file.name}\n\nContent:\n${truncatedText}` },
                ],
                temperature: 0.1,
                max_tokens: 8000,
            });

            const responseText = completion.choices[0]?.message?.content || "";

            try {
                let cleanedText = responseText.trim();
                if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7);
                else if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3);
                if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
                cleanedText = cleanedText.trim();

                const data: ExtractedData = JSON.parse(cleanedText);
                if (!data.columns || !data.rows || !Array.isArray(data.rows)) {
                    return { success: false, error: "Invalid AI response format" };
                }
                return { success: true, data };
            } catch {
                console.error("Failed to parse AI response:", responseText.substring(0, 500));
                return { success: false, error: "Failed to parse AI response" };
            }
        }

        return { success: false, error: "Unsupported file type" };
    } catch (error) {
        console.error("Document parsing error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to parse document",
        };
    }
}

export async function parsePDF(formData: FormData): Promise<ParseResult> {
    return parseDocument(formData);
}
