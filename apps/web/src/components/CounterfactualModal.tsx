import React from 'react';
import { CheckCircle2, AlertTriangle, X, Zap, GitCompare } from 'lucide-react';
import type { Case } from '../types';

interface CounterfactualModalProps {
  currentCase: Case;
  onClose: () => void;
}

export const CounterfactualModal: React.FC<CounterfactualModalProps> = ({
  currentCase,
  onClose,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">COUNTERFACTUAL TWIN SIMULATION</h2>
                <span className="text-[10px] font-mono font-bold bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/50">
                  WHAT-IF CAUSAL ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Comparative simulation of observed reality versus simulated administrative intervention
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
          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 flex items-start space-x-2.5">
            <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Deterministic Counterfactual Simulation:</strong> Simulates the exact state trajectory of the administrative state machine if the recommended intervention is executed vs if no intervention occurs.
            </p>
          </div>

          {/* Side-by-Side Dual World Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* World A: Baseline Observed Reality */}
            <div className="p-5 rounded-2xl bg-red-50/40 border-2 border-red-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-black uppercase text-red-900 tracking-wider">
                    World A: Observed Reality (No Action)
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  CURRENT STATE
                </span>
              </div>

              {isDbt ? (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
                    <div className="text-[10px] font-bold text-red-600">1. Upstream Requisition</div>
                    <div className="font-semibold text-slate-900">Cyber Police Notice #CR-4412 on Canara Bank</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
                    <div className="text-[10px] font-bold text-red-600">2. Institutional Propagation</div>
                    <div className="font-semibold text-slate-900">Canara Bank marks NPCI APBS mapper INACTIVE</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
                    <div className="text-[10px] font-bold text-red-600">3. Central Gateway Execution</div>
                    <div className="font-semibold text-slate-900">PFMS payment batch aborts with Rule BNS-410</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-100/70 border border-red-300 space-y-1">
                    <div className="text-[10px] font-black uppercase text-red-800">Final Outcome</div>
                    <div className="text-sm font-black text-red-950">₹48,000 Withheld • Citizen in Distress</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
                    <div className="text-[10px] font-bold text-red-600">1. Portal Exit Record</div>
                    <div className="font-semibold text-slate-900">ECR Return logs Exit Date 2025-11-15</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
                    <div className="text-[10px] font-bold text-red-600">2. Rule Evaluation</div>
                    <div className="font-semibold text-slate-900">Rule EPF-R09 detects discrepancy with relieving letter</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-red-100/70 border border-red-300 space-y-1">
                    <div className="text-[10px] font-black uppercase text-red-800">Final Outcome</div>
                    <div className="text-sm font-black text-red-950">Form 19 Claim Rejected Automatically</div>
                  </div>
                </div>
              )}
            </div>

            {/* World B: Simulated Counterfactual Intervention */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border-2 border-emerald-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                    World B: Counterfactual Intervention
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  SIMULATED REMEDY
                </span>
              </div>

              {isDbt ? (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">1. Statutory Intervention</div>
                    <div className="font-semibold text-slate-900">APBS Remapping representation served to SBI (*8812)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">2. Gateway Synchronization</div>
                    <div className="font-semibold text-slate-900">NPCI Central APBS status transitions to ACTIVE</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">3. Central Gateway Execution</div>
                    <div className="font-semibold text-slate-900">PFMS payment retry satisfies Rule BNS-410</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 space-y-1">
                    <div className="text-[10px] font-black uppercase text-emerald-800">Final Outcome</div>
                    <div className="text-sm font-black text-emerald-950">₹48,000 Credited • UTR #PFMS-UTR-34F5BBFFF2</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">1. Statutory Intervention</div>
                    <div className="font-semibold text-slate-900">Joint Declaration submitted with relieving letter</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">2. Portal Rectification</div>
                    <div className="font-semibold text-slate-900">Member Exit Date corrected to 2025-10-31 (SLA: 15d)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 space-y-1">
                    <div className="text-[10px] font-black uppercase text-emerald-800">Final Outcome</div>
                    <div className="text-sm font-black text-emerald-950">Form 19 Settlement Approved & Disbursed</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Counterfactual State Simulation • Deterministic SCM Model</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
