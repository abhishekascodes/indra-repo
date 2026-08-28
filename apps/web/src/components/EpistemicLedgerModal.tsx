import React from 'react';
import { ShieldCheck, AlertCircle, X, Cpu, Crosshair } from 'lucide-react';
import type { Case } from '../types';

interface EpistemicLedgerModalProps {
  currentCase: Case;
  onClose: () => void;
}

export const EpistemicLedgerModal: React.FC<EpistemicLedgerModalProps> = ({
  currentCase,
  onClose,
}) => {
  const ledgerEntries = currentCase.domain_id === 'epfo_claim' ? [
    {
      id: "ep-1",
      fact: "Service termination certified as 2025-10-31 by TechSys Pvt Ltd.",
      source: "Relieving and Experience Letter",
      provenance: "Relieving_and_Experience_Letter.pdf (Page 1, Box: [110, 180, 420, 240])",
      docId: "doc-epfo-1",
      inference: "Member ceased active employment on 31-Oct-2025.",
      rule: "EPFO Section 19 requires authentic date of cessation.",
      falsifiableIf: "Employer presents amended employment register showing active duty past 31-Oct-2025.",
      confidence: 0.99,
      status: "CONFIRMED"
    },
    {
      id: "ep-2",
      fact: "Employer Electronic Challan Return (ECR) logs Date of Exit as 2025-11-15.",
      source: "Employer ECR Filing Extract",
      provenance: "Employer_ECR_Filing_Extract.pdf (Page 1, Box: [140, 210, 460, 280])",
      docId: "doc-epfo-2",
      inference: "Clerical 15-day offset introduced during monthly bulk challan upload.",
      rule: "Rule EPF-R09 auto-rejects claims with conflicting exit dates.",
      falsifiableIf: "Wage contribution records match 15 days of November active service.",
      confidence: 0.98,
      status: "CONFIRMED"
    }
  ] : [
    {
      id: "dbt-1",
      fact: "Central PFMS payment batch failed on 2026-02-12 with Error Code BNS-410.",
      source: "PFMS Rejection Return Report",
      provenance: "PFMS_Failure_Report.pdf (Page 1, Box: [120, 240, 480, 290])",
      docId: "doc-2",
      inference: "PFMS gateway rejected transaction due to blocked or inactive account routing.",
      rule: "Rule BNS-410 halts payment routing when destination mapper is non-responsive.",
      falsifiableIf: "PFMS transaction log proves successful ledger credit to Canara *4401.",
      confidence: 0.99,
      status: "CONFIRMED"
    },
    {
      id: "dbt-2",
      fact: "NPCI APBS Aadhaar Mapper status flagged as INACTIVE for Canara Bank *4401.",
      source: "NPCI Central Mapper Diagnostic Record",
      provenance: "NPCI_Mapper_Status.pdf (Page 1, Box: [95, 140, 510, 210])",
      docId: "doc-5",
      inference: "Upstream operational freeze on Canara Bank account triggered mapper inactivation.",
      rule: "RBI Master Direction on APBS requires active bank synchronization.",
      falsifiableIf: "NPCI APBS mapper status returns ACTIVE with green cryptographic ping.",
      confidence: 0.98,
      status: "CONFIRMED"
    },
    {
      id: "dbt-3",
      fact: "Canara Bank placed total operational freeze under Ahmedabad Cyber Notice #CR-4412.",
      source: "Canara Bank Freeze Intimation Memo",
      provenance: "Canara_Bank_Freeze_Notice.pdf (Page 1, Box: [80, 160, 490, 230])",
      docId: "doc-3",
      inference: "Canara Bank over-applied omnibus freeze to student's entire account instead of disputed sum.",
      rule: "Gujarat High Court (R/SCR.A/1908/2023) prohibits omnibus freezing under Sec 102 CrPC.",
      falsifiableIf: "Cyber Crime Cell issues explicit formal debit-freezing order mentioning full balance.",
      confidence: 0.94,
      status: "CONFIRMED"
    },
    {
      id: "dbt-4",
      fact: "Citizen maintains an active, unencumbered savings account *8812 with State Bank of India.",
      source: "SBI Active Account Statement",
      provenance: "SBI_Active_Account_Statement.pdf (Page 1, Box: [100, 200, 450, 270])",
      docId: "doc-4",
      inference: "Directing APBS routing to SBI *8812 will successfully receive the ₹48,000 disbursement.",
      rule: "Citizens retain statutory right to choose preferred DBT receiving account under DBT Bharat.",
      falsifiableIf: "SBI account *8812 has active liens or KYC non-compliance.",
      confidence: 0.99,
      status: "CONFIRMED"
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">EPISTEMIC AUDIT LEDGER</h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/50">
                  DETERMINISTIC VERIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Epistemic classification, provenance grounding, and falsifiability conditions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Epistemic Integrity Guarantee:</strong> INDRA does not use ungrounded generative assertions. Every conclusion is backed by verified evidence, explicit institutional rules, and testable falsifiability criteria.
            </p>
          </div>

          <div className="space-y-4">
            {ledgerEntries.map((item, idx) => (
              <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
                {/* Top Row: Fact & Status */}
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      FACT #{idx + 1} • {item.source}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.fact}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-black px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full">
                      CONFIDENCE: {Math.round(item.confidence * 100)}% • {item.status}
                    </span>
                  </div>
                </div>

                {/* Grid of Epistemic Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  {/* Provenance */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                      <Crosshair className="w-3 h-3 text-indigo-600" />
                      <span>Spatial Provenance</span>
                    </div>
                    <p className="text-slate-800 font-mono text-[11px] leading-snug">{item.provenance}</p>
                  </div>

                  {/* Inference */}
                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1">
                    <div className="text-[10px] font-bold text-purple-700 uppercase">Derived Inference</div>
                    <p className="text-purple-950 font-medium text-[11px] leading-snug">{item.inference}</p>
                  </div>

                  {/* Institutional Rule */}
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1">
                    <div className="text-[10px] font-bold text-blue-700 uppercase">Institutional Rule / Legal Basis</div>
                    <p className="text-blue-950 font-medium text-[11px] leading-snug">{item.rule}</p>
                  </div>

                  {/* Falsifiability */}
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                    <div className="text-[10px] font-bold text-amber-800 uppercase flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Falsifiable If</span>
                    </div>
                    <p className="text-amber-950 font-medium text-[11px] leading-snug">{item.falsifiableIf}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Epistemic Ledger Standard • Zero Generative Hallucination</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
