import React from 'react';
import { Fingerprint, X, ShieldCheck, Database } from 'lucide-react';
import type { Case } from '../types';

interface IdentityEntropyModalProps {
  currentCase: Case;
  onClose: () => void;
}

export const IdentityEntropyModal: React.FC<IdentityEntropyModalProps> = ({
  currentCase,
  onClose,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  const identityRecords = isDbt ? [
    {
      system: "UIDAI Aadhaar Master (Synthetic)",
      name: "Aakash Verma",
      dob: "14-05-2004",
      status: "PRIMARY ANCHOR",
      matchScore: "100%",
      notes: "Demographic baseline. Aadhaar Seeded Token: ****-****-8821"
    },
    {
      system: "State Bank of India (*8812)",
      name: "Aakash Verma",
      dob: "14-05-2004",
      status: "PERFECT MATCH",
      matchScore: "100%",
      notes: "Exact demographic & spelling match. Active unencumbered KYC status."
    },
    {
      system: "Income Tax PAN Registry",
      name: "Akash Verma",
      dob: "14-05-2004",
      status: "MINOR DIVERGENCE",
      matchScore: "92%",
      notes: "Minor phonetic vowel transliteration (Akash vs Aakash). Non-fatal."
    },
    {
      system: "Canara Bank (*4401)",
      name: "Aakash K. Verma",
      dob: "14-05-2004",
      status: "MODERATE ENTROPY",
      matchScore: "84%",
      notes: "Middle initial 'K' present. Account placed under debit restriction."
    }
  ] : [
    {
      system: "EPFO UAN Member Master",
      name: "Pooja Sharma",
      dob: "22-08-1996",
      status: "PRIMARY ANCHOR",
      matchScore: "100%",
      notes: "UAN: 100984210988. Name & demographic details aligned."
    },
    {
      system: "Establishment Relieving Order",
      name: "Pooja Sharma",
      dob: "22-08-1996",
      status: "PERFECT MATCH",
      matchScore: "100%",
      notes: "Service Exit Date: 2025-10-31."
    },
    {
      system: "Employer Monthly ECR Return",
      name: "Pooja Sharma",
      dob: "22-08-1996",
      status: "EXIT DATE CONFLICT",
      matchScore: "78%",
      notes: "Date of Exit erroneously logged as 2025-11-15 (15-day offset)."
    }
  ];

  const coherenceScore = isDbt ? 88 : 84;
  const entropyScore = 100 - coherenceScore;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">IDENTITY ENTROPY ENGINE</h2>
                <span className="text-[10px] font-mono font-bold bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded border border-teal-500/50">
                  CROSS-REGISTRY SYNCHRONIZATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Demographic coherence, transliteration entropy, and institutional resolution
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
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono font-black text-emerald-700 text-lg">
                {coherenceScore}%
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400">Identity Coherence</div>
                <div className="text-xs font-bold text-slate-900">High Demographic Alignment</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-black text-amber-700 text-lg">
                {entropyScore}%
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400">Identity Entropy</div>
                <div className="text-xs font-bold text-slate-900">Minor Transliteration Offset</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400">Remediation Path</div>
                <div className="text-xs font-bold text-indigo-900">Remap to SBI (100% Match)</div>
              </div>
            </div>
          </div>

          {/* Diagnostic Note */}
          <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs text-teal-950 flex items-start space-x-2.5">
            <Database className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Synthetic Cross-Registry Analysis:</strong> While Canara Bank contains a middle initial divergence and PAN has single-vowel phonetic variation, the citizen's State Bank of India account achieves 100% demographic identity match with Aadhaar. Remapping APBS routing to SBI completely circumvents transliteration failures.
            </p>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black uppercase text-slate-700 tracking-wider">
              Cross-Registry Demographic Ledger
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {identityRecords.map((rec, rIdx) => (
                <div key={rIdx} className="p-4 flex items-start justify-between flex-wrap gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{rec.system}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${
                        rec.matchScore === '100%'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Recorded Name: <strong className="text-slate-900">{rec.name}</strong> • DOB: {rec.dob}
                    </div>
                    <p className="text-[11px] text-slate-500">{rec.notes}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Match Score</div>
                    <div className="font-mono font-bold text-sm text-slate-800">{rec.matchScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synthetic Demographic Engine • Zero Real Government Data</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Identity Engine
          </button>
        </div>
      </div>
    </div>
  );
};
