# FreightSnap 📦

> Zero-friction document intelligence for logistics. Extract data from any PDF, CSV, or Excel file in seconds.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Features

- **Multi-Format Support** — PDF, CSV, XLS, XLSX
- **Best Price Highlighter** — Automatically highlights the lowest price row
- **Currency Detection** — Detects USD, EUR, GBP, GEL and more
- **Privacy-First** — No data storage, no AI training on your files
- **Multi-Export** — Excel, CSV, QuickBooks, Xero formats
- **Editable Tables** — Fix any extraction errors before export

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/SetFodi/FreightSnap.git
cd FreightSnap

# Install
bun install

# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env.local

# Run
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Required. Get free at [console.groq.com](https://console.groq.com) |

## 📁 Project Structure

```
├── app/
│   ├── page.tsx          # Main app
│   ├── about/            # About page
│   ├── pricing/          # Pricing page
│   └── actions/          # Server actions (parsing)
├── components/
│   ├── dropzone.tsx      # File upload
│   ├── data-table.tsx    # Editable table
│   ├── export-button.tsx # Export modal
│   └── toast.tsx         # Notifications
├── lib/
│   └── gemini.ts         # AI extraction logic
└── public/
    └── test-files/       # Sample files for testing
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4, Framer Motion
- **AI:** Groq (Llama 3.3 70B)
- **PDF:** unpdf
- **Spreadsheets:** xlsx (no AI needed)

## 🔒 Privacy

- Files processed in memory only
- No data stored to any database
- Groq API does NOT train on your data
- Close the tab = data gone

## 📄 License

MIT

---

Built with ❤️ for logistics professionals who hate manual data entry.
