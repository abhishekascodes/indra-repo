import React from 'react';
import { Shield, Database, FileText, GitFork, Cpu, Clock, Send, Lock, X, ArrowDown } from 'lucide-react';

interface ArchitectureViewProps {
  activeDomainId: string;
  onClose: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ activeDomainId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">INDRA CORE ARCHITECTURE</h2>
              <p className="text-xs text-slate-400 font-mono">Autonomous Causal Engine for Fragmented Public Services</p>
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

        {/* Blueprint Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Core Engine Stack */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-slate-900" />
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  INDRA Autonomous Core Modules (Domain-Agnostic)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                DETERMINISTIC KERNEL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Persistent Case Memory</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Maintains historical case lifecycle, cross-session memory, and audit trails without loss of context.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Multimodal Evidence Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Spatial OCR extraction, bounding box coordinates, and document authenticity verification.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <GitFork className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Typed Causal Graph</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  7 typed nodes (Entity, Event, Rule, Action) & 7 typed edges (Causes, Proves, Contradicts).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>Epistemic Reasoning Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Distinguishes Document-Proved Facts (99%) from Inferred Hypotheses (91%) & System Observations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Temporal State Machine</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Tracks statutory SLAs (15d), automatic CPGRAMS escalation upon timeout, and recovery transitions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Action & Agency Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Mandatory 1-click citizen consent pad, legal petition generation, and portal submission.
                </p>
              </div>
            </div>
          </div>

          {/* Conduit Arrow */}
          <div className="flex items-center justify-center">
            <div className="p-2 rounded-full bg-slate-200 text-slate-700 flex items-center space-x-1.5 text-xs font-bold shadow-2xs">
              <ArrowDown className="w-4 h-4" />
              <span>DYNAMIC DOMAIN PLUGINS</span>
            </div>
          </div>

          {/* Domain Plugins Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Domain 1: Flagship DBT */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activeDomainId === 'dbt_failure'
                ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-300 shadow-md'
                : 'bg-white border-slate-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase">
                  [1] DBT / PFMS Domain Plugin
                </span>
                {activeDomainId === 'dbt_failure' && (
                  <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                    ACTIVE CASE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Rules for NPCI APBS mapping, Rule BNS-410, Cyber Police Sec 102 CrPC freezes, and central scholarship disbursal retries.
              </p>
            </div>

            {/* Domain 2: EPFO */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activeDomainId === 'epfo_claim'
                ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-300 shadow-md'
                : 'bg-white border-slate-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase">
                  [2] EPFO Domain Plugin
                </span>
                {activeDomainId === 'epfo_claim' && (
                  <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">
                    ACTIVE CASE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Rules for Form 19 settlements, Date of Exit employer ECR contradictions, and Joint Declaration SOP v3.0 digital rectification.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Deterministic Architecture • No Generic LLM Hallucinations</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
