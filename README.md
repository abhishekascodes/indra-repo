# INDRA — Persistent Multimodal Citizen Case Intelligence & Administrative Agency System

> **The citizen has one life. The government has fragmented systems. INDRA understands the complete case.**

INDRA is a case-centric administrative intelligence system that ingests messy multimodal evidence (PDFs, bank statements, SMS alerts, sanction orders, relieving letters), reconstructs the underlying situation into a typed **Case Graph** with strict provenance, deterministically flags factual contradictions and statutory rules, formulates causal root-cause hypotheses, and interacts directly with stateful mock government portals under mandatory citizen consent.

---

## Key Architecture & Capabilities

### 1. Epistemic Classifications & Typed Case Graph
- **Epistemic Categories**: `FACT`, `INFERENCE`, `RULE`, `SYSTEM_OBSERVATION`, `USER_ASSERTION`, `UNKNOWN`.
- **Node Types**: `PERSON`, `IDENTITY`, `INSTITUTION`, `EVENT`, `DOCUMENT`, `EVIDENCE`, `TRANSACTION`, `APPLICATION`, `RULE`, `PROCEDURE`, `ACTION`, `RESPONSE`, `DEADLINE`, `DEPENDENCY`, `CONTRADICTION`, `CASE_STATE`.
- **Edge Types**: `RELATES_TO`, `BELONGS_TO`, `MENTIONS`, `PROVES`, `CONTRADICTS`, `DEPENDS_ON`, `CAUSED_BY`, `REQUIRES`, `SUBMITTED_TO`, `RESPONDED_BY`, `PRECEDES`, `FOLLOWS`, `ESCALATES_TO`, `PROVES_ELIGIBILITY_FOR`.

### 2. Strict Evidence Provenance & Spatial Highlighting
- Every extracted fact points back to its source: `document_id` → `page_number` → `bounding_box` → `extracted_text` → `confidence` → `extraction_method`.
- In the frontend **Evidence Vault**, selecting any fact or node highlights the exact spatial bounding box on the source document canvas.

### 3. Declarative Domain Plugins & Deterministic Rule Engine
- **One Engine, Many Domains**:
  - `dbt_failure`: Direct Benefit Transfer (DBT), PFMS rejection code `BNS-410`, NPCI Aadhaar bank mapping, DBT Mandate.
  - `epfo_claim`: Form 19/10C Claim Rejection, Date of Exit conflict, Joint Declaration under Revised SOP 2024.
  - `cyber_restriction`: Bank Account Debit Freezes under Sec 102 CrPC / Sec 107 BNSS, Lien limitation petitions, Police NOC.

### 4. Deterministic Contradiction & Causal Root-Cause Engine
- Deterministic diffing for names, DOBs, Exit Dates, Account numbers, and Application vs Transaction statuses.
- Causal hypothesis generator synthesizes candidate cause chains with confidence scores, counter-evidence checks, and procedural remedies.

### 5. Stateful Mock Government World
- Stateful simulated backend for **PFMS Disbursals**, **NPCI APBS Mapper**, **Commercial Banks**, and **EPFO Field Offices**.
- Real API endpoints:
  - `GET /api/mock/pfms/status/{sanction_id}`
  - `POST /api/mock/bank/update-npci-mandate`
  - `POST /api/mock/pfms/retry-disbursal`
  - `GET /api/mock/epfo/claim-status/{uan}`
  - `POST /api/mock/epfo/submit-joint-declaration`

### 6. Temporal Simulation & Automatic SLA Escalation
- Fast-Forward Time controls (+5 Days, +15 Days).
- If institutional response exceeds statutory SLA (e.g. 15 days) while in `WAITING` state, the agent state machine automatically transitions to `ESCALATION_REQUIRED` and drafts a formal CPGRAMS / Banking Ombudsman administrative escalation.

### 7. Human-in-the-Loop Action Layer
- Action proposals (`NPCI_MAPPING_UPDATE_REQUEST`, `EPFO_JOINT_DECLARATION_SUBMISSION`) require explicit citizen consent (`Grant Citizen Consent`).
- Generates official legal letters/representations with full evidence citations.

---

## Directory Structure

```
.
├── apps/
│   └── web/                         # React + Vite + TypeScript + Tailwind CSS Case Workspace
├── services/
│   ├── api/                         # FastAPI Backend Application
│   └── mock_government/             # Stateful Mock PFMS, NPCI, Bank & EPFO Services
├── packages/
│   ├── schemas/                     # Typed Pydantic & TypeScript Models
│   ├── case_engine/                 # Graph, Contradiction, Rule, Root Cause & Temporal Engines
│   └── domain_plugins/              # Declarative Plugins (DBT, EPFO, Cyber)
├── data/
│   └── synthetic/                   # Synthetic PDFs, statements, rejection notices, SMS
├── tests/
│   ├── unit/                        # Unit tests (schemas, state machine, rules, contradictions)
│   ├── integration/                 # Mock government and API integration tests
│   └── e2e/                         # End-to-end Flagship and EPFO lifecycle tests
├── run_indra.py                     # One-click startup script
└── pytest.ini                       # Pytest configuration
```

---

## Getting Started

### 1. Install Backend Dependencies
```bash
pip install fastapi uvicorn pydantic pydantic-settings pytest pytest-asyncio httpx python-multipart jinja2 reportlab pillow pyyaml python-dotenv openai networkx
```

### 2. Install Frontend Dependencies
```bash
cd apps/web
npm install
```

### 3. Run the Full Test Suite
```bash
pytest -v
```
All 16 unit, integration, e2e, and adversarial tests will execute.

### 4. Start the Application
Run from repository root:
```bash
python run_indra.py
```
Or launch services individually:
- **Backend API**: `python -m uvicorn services.api.main:app --reload --port 8000`
- **Frontend Workspace**: `cd apps/web && npm run dev`

Open your browser at `http://localhost:5173`.

---

## Flagship Demo Walkthrough (DBT / PFMS Disbursal Recovery)

1. **Case Initialized**: Citizen Aakash Verma opens case for Rs. 48,000 scholarship payment failure.
2. **Evidence Ingestion**: INDRA parses 5 multimodal evidence records (Sanction Order, PFMS Rejection Slip, Canara Bank Statement, SBI Confirmation, SMS notice).
3. **Contradiction Detected**: Application is approved on portal, but transactional settlement failed with `BNS-410`. Canara Bank account has debit restriction and inactive NPCI mapping.
4. **Root Cause Formulated**: Destination bank restriction suspended NPCI APBS mapping, causing PFMS gateway to abort disbursal.
5. **Action Proposed**: Bank Remapping Directive to seed Aadhaar with active KYC-compliant SBI account.
6. **Citizen Grants Consent**: Citizen clicks **Authorize Action**.
7. **Submission**: Action is submitted to mock bank/NPCI portal. Case enters `WAITING` state.
8. **Time Fast-Forward**: Click **Fast-Forward 15d** to test deadline monitoring.
9. **PFMS Recovery Execution**: Click **Verify & Execute PFMS Disbursal**. PFMS validates active mapping, executes transfer, generates UTR number, and case transitions to `RESOLUTION`!
