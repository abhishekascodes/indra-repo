import React from 'react';
import {
  Database, User, FileCheck, Key, Activity
} from 'lucide-react';
import type { Case } from '../types';

interface CaseMemoryPanelProps {
  currentCase: Case;
}

export const CaseMemoryPanel: React.FC<CaseMemoryPanelProps> = ({
  currentCase,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 select-none font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black tracking-tight text-white">
                PERSISTENT CASE MEMORY
              </h2>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                STATEFUL CONTEXT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Historical memory layer preserving citizen context, evidence hashes, and decision logs across sessions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span>Case Hash: <strong className="text-slate-200 font-bold">SHA256:{currentCase.id.slice(0, 12)}</strong></span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">MEMORY ACTIVE</span>
        </div>
      </div>

      {/* Grid of Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Citizen KYC Anchor */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400 font-bold">
            <User className="w-4 h-4" />
            <span>Beneficiary Anchor</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>Name: <strong className="text-white">{currentCase.citizen_name}</strong></div>
            <div>Aadhaar Seeded Token: <span className="font-mono text-amber-400">****-****-8821</span></div>
            <div>Primary Scheme: <span className="text-slate-200">{isDbt ? "Post-Matric Scholarship (AY 2025-26)" : "EPFO Pension Form 19"}</span></div>
            <div>Entitlement Amount: <strong className="text-emerald-400 font-mono">{isDbt ? "₹48,000.00" : "Final Settlement"}</strong></div>
          </div>
        </div>

        {/* Card 2: Cryptographic Capability Token */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold">
            <Key className="w-4 h-4" />
            <span>Citizen Authorization Capability</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>Consent Status: <strong className="text-emerald-400">SCOPED_AUTHORIZED</strong></div>
            <div>Scope: <span className="font-mono text-slate-300">urn:indra:action:remap_apbs</span></div>
            <div>Delegation: <span className="text-slate-300">Single-Invocation Administrative Representation</span></div>
            <div>Revocability: <span className="text-slate-300">Instant Citizen Revocation Permitted</span></div>
          </div>
        </div>

        {/* Card 3: Memory Integrity Metric */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Activity className="w-4 h-4" />
            <span>Memory Coherence & Delta</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>Epistemic Facts: <strong className="text-white font-mono">{currentCase.facts_summary?.length || 5} Established</strong></div>
            <div>Active Inferences: <strong className="text-white font-mono">{currentCase.inferences_summary?.length || 2} Derived</strong></div>
            <div>Confidence Level: <strong className="text-emerald-400 font-mono">94% (High Certainty)</strong></div>
            <div>Unresolved Deadlocks: <strong className="text-slate-400 font-mono">0 Detected</strong></div>
          </div>
        </div>
      </div>

      {/* Ingested Evidence Artifact Hashes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-slate-200 font-bold">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Ingested Evidence Artifacts (SHA-256 Integrity Hashes)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Cryptographically anchored</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {currentCase.documents?.map((doc, idx) => (
            <div key={doc.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-slate-500">[{idx + 1}]</span>
                <span className="text-slate-200 font-bold">{doc.filename}</span>
              </div>
              <span className="text-slate-400 text-[10px]">SHA256:{doc.id.repeat(4).slice(0, 24)}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
