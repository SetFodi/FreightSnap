import Groq from "groq-sdk";

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Use Llama 3.3 70B for high quality extraction
export const GROQ_MODEL = "llama-3.3-70b-versatile";

// Dynamic extraction prompt - adapts to ANY document type
export const DYNAMIC_EXTRACTION_PROMPT = `You are a document data extraction specialist. Analyze the provided text and extract ALL structured data into a clean, normalized format.

INSTRUCTIONS:
1. Identify ALL columns/fields present in the data
2. Extract EVERY row of data with ALL available fields
3. Normalize field names to be clean (no special chars, use underscores)
4. Keep data values exactly as they appear (numbers, dates, IDs, etc.)
5. If a field is empty or N/A, use empty string ""

Return a JSON object with this structure:
{
  "document_type": "invoice/quote/report/manifest/etc",
  "source": "detected source/company name if visible",
  "columns": ["column1", "column2", ...],
  "rows": [
    {"column1": "value1", "column2": "value2", ...},
    ...
  ],
  "summary": {
    "total_rows": number,
    "key_info": "brief summary of what this document contains"
  }
}

IMPORTANT:
- Extract ALL rows, not just a sample
- Preserve container IDs, invoice numbers, tariff codes exactly
- Keep numeric values as strings to preserve formatting
- Detect date formats and keep them consistent

Only return valid JSON, no additional text or explanation.`;

// Type for dynamic extracted data
export interface ExtractedData {
  document_type: string;
  source: string;
  columns: string[];
  rows: Record<string, string>[];
  summary: {
    total_rows: number;
    key_info: string;
  };
}
