# GeM-Verify AI

AI-assisted bid compliance verification and decision-support prototype for GeM procurement (SIH Problem Statement 26100).

## What this version actually implements

- 11 verification connectors: Udyam, GSTN, Income Tax/PAN, MCA21, EPFO, ESIC, Startup India, NSIC, debarment, DigiLocker hash verification and OEM authorization.
- A connector abstraction backed by **SIH sandbox/mock datasets**. The connector interface is designed so authorized government APIs can replace the sandbox adapters later.
- Deterministic compliance checks for identity consistency, GST/PAN status, MCA director disqualification, debarment, Make in India local-content threshold, EPFO/ESIC status, Startup/MSME/NSIC eligibility, turnover/experience thresholds, OEM authorization and document integrity.
- Uploaded PDF/image processing: SHA-256 hashing plus PDF text extraction with OCR fallback for scanned PDFs and OCR for images when the host has `pdftotext`, `pdftoppm` and `tesseract` installed.
- Extracted document fields are stored as evidence and passed to the AI analysis layer.
- Gemini AI is optional. If no API key is configured, the deterministic compliance engine remains available.
- Persistent SQLite audit ledger with SHA-256 hash chaining and an audit-chain verification endpoint.
- Procurement Officer remains the final decision-maker: qualify, seek clarification or disqualify.

## Important SIH transparency note

This is a prototype. The project **does not claim live access to Government databases**. Government connector responses currently come from realistic sandbox/mock records because production government APIs require authorized access, credentials and deployment controls. Do not describe these records as live government data during judging.

## Run

### Backend

```bash
cd server
npm install
npm start
```

Runs on `http://localhost:5000` by default.

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:3000`.

### Optional document OCR tools

For local PDF/image extraction, install these command-line tools and make sure they are on `PATH`:

- `pdftotext`
- `pdftoppm`
- `tesseract`

If they are unavailable, the upload still gets a SHA-256 hash and the application records document extraction as unavailable instead of falsely marking the file verified.

## Gemini API key

Use `server/.env.example` as the template. Never commit a real API key. The UI can also configure the key at runtime.

## Project structure

```text
lapra/
├── client/
│   ├── package.json
│   └── src/
└── server/
    ├── package.json
    └── src/
        ├── controllers/
        │   ├── portalController.js
        │   └── verifyController.js
        ├── data/
        │   ├── mockPortals.js
        │   └── sampleBidders.js
        ├── database/
        │   ├── database.js
        │   ├── schema.js
        │   └── seed.js
        └── services/
            ├── auditService.js
            ├── documentService.js
            └── geminiService.js
```

## Verification flow

```text
Bid Documents + Bidder Data + Tender Criteria
                    ↓
          SHA-256 + PDF/OCR Extraction
                    ↓
              Structured Evidence
                    ↓
       Sandbox Government Connectors
                    ↓
         Deterministic Compliance Rules
                    ↓
          Gemini AI Explanation (optional)
                    ↓
          Score + Risk + Findings + Evidence
                    ↓
           Procurement Officer Decision
                    ↓
             Persistent Audit Ledger
```

## SIH demo scenarios

The seeded benchmark bidders intentionally cover different outcomes:

- compliant MSME / Class-I supplier
- DPIIT startup with turnover/experience exemption
- labor/GST warning requiring clarification
- debarred / forged-document scenario
- Make in India local-content failure
- NSIC/MSME compliant supplier

## Disclaimer

The rules and sample records are prototype logic for SIH demonstration and testing. They are not a substitute for the applicable tender documents, Government notifications, authorized portal records or the Procurement Officer's legal/commercial determination.
