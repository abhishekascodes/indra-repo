import React, { useState } from 'react';
import {
  Sparkles, AlertTriangle, CheckCircle2, FileText, Send, Lock,
  Check, ShieldCheck, GitFork, X
} from 'lucide-react';
import type { Case, ActionDraft } from '../types';

interface CaseStoryViewProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onHighlightCausalChain: (nodeIds: string[]) => void;
  onViewGraph: () => void;
  isLoading: boolean;
}

export const CaseStoryView: React.FC<CaseStoryViewProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onHighlightCausalChain,
  onViewGraph,
  isLoading,
}) => {
  const [viewingLetterAction, setViewingLetterAction] = useState<ActionDraft | null>(null);

  const topCause = currentCase.candidate_causes?.[0];
  const pendingActions = currentCase.actions || [];
  const contradictions = currentCase.contradictions || [];

  return (
    <div className="h-full overflow-y-auto bg-slate-50/70 p-6 space-y-6">
      {/* 1. Executive Summary Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Case Situation & Diagnostic Summary
              </h2>
              <p className="text-xs text-slate-500">
                Citizen: <strong className="text-slate-800">{currentCase.citizen_name}</strong> | Domain: <strong className="text-slate-800">{currentCase.domain_id}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold font-mono">
              Diagnostic Confidence: {Math.round((topCause?.confidence || 0.89) * 100)}%
            </span>
          </div>
        </div>

        {/* 3 Clear Problem/Discovery/Action Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Pillar 1: The Problem */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              1. What Went Wrong
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {currentCase.objective}
            </p>
          </div>

          {/* Pillar 2: The Root Discovery */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase text-red-700 tracking-wider flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>2. What INDRA Discovered</span>
            </div>
            <p className="text-xs text-red-950 font-medium leading-relaxed">
              {currentCase.blocker_summary || topCause?.hypothesis || "Analyzing root blocker..."}
            </p>
          </div>

          {/* Pillar 3: The Next Action */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Required Remedial Action</span>
            </div>
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              {pendingActions[0]?.purpose || topCause?.recommended_remedy?.split('\n')[0] || "Execute administrative representation."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Cross-Domain Causal Chain Flow */}
      {currentCase.domain_id === 'dbt_failure' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Cross-Domain Failure Chain (Visual Reconstitution)
              </h3>
              <p className="text-xs text-slate-500">
                How an upstream police cyber requisition blocked a downstream welfare scholarship across 3 institutions.
              </p>
            </div>
            <button
              onClick={() => {
                if (topCause?.causal_chain) {
                  onHighlightCausalChain(topCause.causal_chain);
                } else {
                  onViewGraph();
                }
              }}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <GitFork className="w-3.5 h-3.5 text-purple-600" />
              <span>Illuminate Causal Chain in Graph</span>
            </button>
          </div>

          {/* Connected Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-1">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-red-600 uppercase">1. Upstream Trigger</div>
              <div className="text-xs font-bold text-slate-900">Cyber Police Notice</div>
              <div className="text-[11px] text-slate-500">Police Requisition #CR-4412 issued under Sec 102 CrPC.</div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-red-600 uppercase">2. Bank Action</div>
              <div className="text-xs font-bold text-slate-900">Canara Bank Freeze</div>
              <div className="text-[11px] text-slate-500">Full operational debit restriction placed on account *4401.</div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="text-[10px] font-bold text-amber-800 uppercase">3. Gateway Impact</div>
              <div className="text-xs font-bold text-slate-900">NPCI APBS Inactive</div>
              <div className="text-[11px] text-amber-800">Aadhaar payment bridge mapping marked INACTIVE.</div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1">
              <div className="text-[10px] font-bold text-red-700 uppercase">4. PFMS Rejection</div>
              <div className="text-xs font-bold text-red-900 font-mono">Error Code: BNS-410</div>
              <div className="text-[11px] text-red-700">Central payment gateway aborts credit transfer.</div>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">5. Citizen Outcome</div>
              <div className="text-xs font-bold text-indigo-950">₹48,000 Withheld</div>
              <div className="text-[11px] text-indigo-800">Scholarship grant withheld from student.</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Action Center & Resolution Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Action Center & Resolution Execution
          </h3>
          <p className="text-xs text-slate-500">
            Authorize administrative actions with full citizen consent, submit to portals, and execute recovery cycles.
          </p>
        </div>

        <div className="space-y-4">
          {pendingActions.map(action => {
            const isApproved = action.status === 'APPROVED' || action.citizen_consent;
            const isSubmitted = action.status === 'SUBMITTED';

            return (
              <div
                key={action.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-full border border-indigo-200">
                      {action.action_type.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-2">{action.purpose}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Target Authority: <strong className="text-slate-800">{action.target_institution}</strong> | Legal Basis: <span className="text-slate-700">{action.legal_basis || 'Procedural Directive'}</span>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                    isSubmitted
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-300'
                      : isApproved
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}>
                    {action.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Inspect Generated Petition */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => setViewingLetterAction(action)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Inspect Formal Legal Petition Dossier</span>
                  </button>

                  <span className="text-xs text-slate-500 font-mono">
                    Statutory SLA: {action.response_deadline || 15} Days
                  </span>
                </div>

                {/* Big Step Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex items-center space-x-3">
                  {/* Step 1: Consent */}
                  <button
                    onClick={() => onGrantConsent(action.id, !action.citizen_consent)}
                    disabled={isSubmitted || isLoading}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs ${
                      action.citizen_consent
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {action.citizen_consent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>1. Consent Granted (Authorized)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>1. Authorize Action (Citizen Consent)</span>
                      </>
                    )}
                  </button>

                  {/* Step 2: Submit */}
                  <button
                    onClick={() => onSubmitAction(action.id)}
                    disabled={!action.citizen_consent || isSubmitted || isLoading}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-95"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{isSubmitted ? 'Submitted to Portal (Waiting)' : '2. Submit to Bank Portal'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* PFMS Recovery Disbursal Button */}
          {currentCase.domain_id === 'dbt_failure' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-sm font-bold text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>3. Finalize Benefit Disbursal (PFMS Central Gateway)</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Re-validates the updated NPCI Aadhaar mapper state against the active State Bank of India account, triggers central payment retry, and credits the ₹48,000 scholarship.
              </p>
              <button
                onClick={onResolveChain}
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
              >
                Verify & Execute PFMS Disbursal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Verified Evidence & Factual Conflicts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Verified Facts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
            Verified Empirical Facts ({currentCase.facts_summary?.length || 0})
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {currentCase.facts_summary?.map((fact, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Conflicts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
            Detected Administrative Conflicts ({contradictions.length})
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {contradictions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No factual conflicts detected in this case.
              </div>
            ) : (
              contradictions.map(c => (
                <div key={c.id} className="p-3 rounded-xl border border-red-200 bg-red-50/50 space-y-2 text-xs">
                  <div className="font-bold text-red-800">{c.field.replace(/_/g, ' ').toUpperCase()} Conflict</div>
                  <p className="text-slate-800 leading-snug">{c.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-bold">RECORD A</div>
                      <div className="text-slate-900 font-semibold truncate">{String(c.value_a)}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[9px] text-red-600 font-bold">RECORD B</div>
                      <div className="text-red-700 font-semibold truncate">{String(c.value_b)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Legal Petition Dossier */}
      {viewingLetterAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Generated Administrative Petition</h3>
                <p className="text-xs text-slate-500">{viewingLetterAction.purpose}</p>
              </div>
              <button
                onClick={() => setViewingLetterAction(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-900 whitespace-pre-wrap bg-slate-50/50 m-4 rounded-xl border border-slate-200 leading-relaxed shadow-inner">
              {viewingLetterAction.generated_content}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingLetterAction(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Close Petition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
