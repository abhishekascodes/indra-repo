import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Clock, RotateCcw, X, Zap } from 'lucide-react';
import type { Case } from '../types';

interface ActionGraphModalProps {
  currentCase: Case;
  onClose: () => void;
  onSelectAction?: (actionId: string) => void;
}

export const ActionGraphModal: React.FC<ActionGraphModalProps> = ({
  currentCase,
  onClose,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  const candidateInterventions = isDbt ? [
    {
      id: "opt-1",
      title: "Intervention A: Statutory APBS Remapping to Active SBI Account",
      badge: "RECOMMENDED INTERVENTION",
      eruScore: 0.94,
      successProbability: "96%",
      timeframe: "1 - 2 Business Days",
      reversibility: "HIGH",
      dependencyReadiness: "100% (SBI Account *8812 Active & KYC Verified)",
      legalBasis: "RBI Master Direction DPSS.CO.PD.No.1810 & DBT Bharat SOP",
      downstreamChain: [
        "NPCI Central APBS Status becomes ACTIVE",
        "PFMS Gateway Rule BNS-410 cleared",
        "Automated Payment Retry triggered",
        "₹48,000 Scholarship credited to SBI *8812"
      ],
      recommended: true,
      rationale: "Highest expected resolution utility. Bypasses the frozen Canara Bank account entirely by exercising citizen's statutory right to choose DBT receiving account."
    },
    {
      id: "opt-2",
      title: "Intervention B: High Court Sec 102 CrPC Police Lien Challenge",
      badge: "ALTERNATIVE (HIGH LATENCY)",
      eruScore: 0.38,
      successProbability: "42%",
      timeframe: "60 - 90 Days",
      reversibility: "LOW",
      dependencyReadiness: "Requires Ahmedabad Magistrate Docket Filing",
      legalBasis: "Gujarat HC Precedent R/SCR.A/1908/2023",
      downstreamChain: [
        "Formal court petition filed with magistrate",
        "Police cyber cell response filed",
        "Bank compliance hearing scheduled",
        "Canara Bank unfreezes account *4401"
      ],
      recommended: false,
      rationale: "High procedural friction and unpredictable judicial timeline. Delays critical student living expenses despite strong legal merits."
    },
    {
      id: "opt-3",
      title: "Intervention C: General District Grievance Application",
      badge: "SUB-OPTIMAL",
      eruScore: 0.29,
      successProbability: "35%",
      timeframe: "30 - 45 Days",
      reversibility: "HIGH",
      dependencyReadiness: "Collectorate Welfare Cell",
      legalBasis: "Public Grievance Redressal Charter",
      downstreamChain: [
        "Inter-departmental inquiry letter routed",
        "Bank nodal officer query sent",
        "No direct authority to alter NPCI routing"
      ],
      recommended: false,
      rationale: "Administrative deadlock prone. District collectorate lacks automated API integration to update central NPCI APBS routing."
    }
  ] : [
    {
      id: "epfo-opt-1",
      title: "Intervention A: Joint Declaration Correction under EPFO SOP v3.0 (2024)",
      badge: "RECOMMENDED INTERVENTION",
      eruScore: 0.96,
      successProbability: "98%",
      timeframe: "7 - 15 Business Days",
      reversibility: "HIGH",
      dependencyReadiness: "100% (Relieving Certificate dated 2025-10-31 available)",
      legalBasis: "EPFO Joint Declaration Circular WS/2024/7741",
      downstreamChain: [
        "Establishment digitally countersigns Joint Declaration",
        "Field Office updates Member Exit Date to 2025-10-31",
        "Rule EPF-R09 discrepancy resolved",
        "Form 19 Final PF Settlement approved & credited"
      ],
      recommended: true,
      rationale: "Fastest deterministic remedy. EPFO SOP v3.0 establishes time-bound 15-day statutory SLA for digital Joint Declaration corrections."
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">ACTION GRAPH & RESOLUTION UTILITY (ERU)</h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded border border-amber-500/50">
                  INTERVENTION OPTIMIZATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Comparative utility evaluation of candidate administrative remedies
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
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Expected Resolution Utility Principle:</strong> INDRA evaluates candidate administrative interventions across Success Probability, Downstream Reversibility, Dependency Readiness, and Execution Speed to recommend the path of least friction.
            </p>
          </div>

          <div className="space-y-4">
            {candidateInterventions.map((opt) => (
              <div
                key={opt.id}
                className={`p-5 rounded-2xl border transition-all ${
                  opt.recommended
                    ? 'bg-white border-amber-500/80 ring-2 ring-amber-400/40 shadow-md'
                    : 'bg-white/80 border-slate-200 opacity-80'
                }`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      opt.recommended
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {opt.badge}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-1">{opt.title}</h3>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">ERU Score</div>
                      <div className={`font-mono font-black text-sm ${opt.recommended ? 'text-amber-600' : 'text-slate-600'}`}>
                        {opt.eruScore.toFixed(2)} / 1.00
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium mb-3 leading-relaxed">
                  {opt.rationale}
                </p>

                {/* Score Attributes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs pt-1 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Success Likelihood</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">{opt.successProbability}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      <span>Estimated Time</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">{opt.timeframe}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3 text-purple-600" />
                      <span>Reversibility</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">{opt.reversibility}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Dependency Status</div>
                    <div className="font-bold text-slate-900 mt-0.5 truncate">{opt.dependencyReadiness}</div>
                  </div>
                </div>

                {/* Downstream Impact Flow */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1.5 text-xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">
                    Downstream Causal Progression:
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap text-[11px] text-slate-700">
                    {opt.downstreamChain.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span className="font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                          {step}
                        </span>
                        {sIdx < opt.downstreamChain.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Deterministic ERU Computation Engine</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Action Graph
          </button>
        </div>
      </div>
    </div>
  );
};
