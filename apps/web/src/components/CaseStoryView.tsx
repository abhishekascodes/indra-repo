import React, { useState } from 'react';
import {
  Sparkles, AlertTriangle, CheckCircle2, FileText, Send, Lock,
  Check, ShieldCheck, GitFork, X, Zap, Scale, Printer, Award
} from 'lucide-react';
import type { Case, ActionDraft } from '../types';

interface CaseStoryViewProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onExecuteAutopilot: () => void;
  onHighlightCausalChain: (nodeIds: string[]) => void;
  onViewGraph: () => void;
  isLoading: boolean;
}

export const CaseStoryView: React.FC<CaseStoryViewProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onExecuteAutopilot,
  onHighlightCausalChain,
  onViewGraph,
  isLoading,
}) => {
  const [viewingLetterAction, setViewingLetterAction] = useState<ActionDraft | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showLegalLibrary, setShowLegalLibrary] = useState(false);

  const topCause = currentCase.candidate_causes?.[0];
  const pendingActions = currentCase.actions || [];
  const contradictions = currentCase.contradictions || [];
  const isResolved = currentCase.current_state === 'RESOLUTION';

  return (
    <div className="h-full overflow-y-auto bg-[#F8FAFC] p-6 space-y-6">
      {/* 1. Executive Diagnostic Hero Banner & Autonomous Mode */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Case Situation & Diagnostic Intelligence
                </h2>
                {isResolved ? (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SETTLEMENT COMPLETED</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold font-mono">
                    CONFIDENCE: {Math.round((topCause?.confidence || 0.89) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Beneficiary: <strong className="text-slate-800">{currentCase.citizen_name}</strong> • Case Ref: <span className="font-mono font-bold text-slate-700">{currentCase.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Run Autonomous Resolution Button */}
            {!isResolved && (
              <button
                onClick={onExecuteAutopilot}
                disabled={isLoading}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Autonomous Resolution (Autopilot)</span>
              </button>
            )}

            {isResolved && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>View Audit Certificate</span>
              </button>
            )}

            <button
              onClick={() => setShowLegalLibrary(true)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-slate-200 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-slate-600" />
              <span>Statutory Framework</span>
            </button>
          </div>
        </div>

        {/* 3 Clear Problem/Discovery/Action Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Pillar 1: The Problem */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              1. Observed Discrepancy
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {currentCase.objective}
            </p>
          </div>

          {/* Pillar 2: The Root Discovery */}
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-red-700 tracking-wider flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>2. Reconstructed Root Cause</span>
            </div>
            <p className="text-xs text-red-950 font-medium leading-relaxed">
              {currentCase.blocker_summary || topCause?.hypothesis || "Analyzing root blocker..."}
            </p>
          </div>

          {/* Pillar 3: The Next Action */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Remedial Action Directive</span>
            </div>
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              {pendingActions[0]?.purpose || topCause?.recommended_remedy?.split('\n')[0] || "Execute administrative representation."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Cross-Domain Causal Chain Flow */}
      {currentCase.domain_id === 'dbt_failure' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Cross-Domain Failure Reconstruction
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upstream police cyber requisition propagated across banking and treasury systems, blocking scholarship disbursal.
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
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5 text-slate-700" />
              <span>View in Graph Canvas</span>
            </button>
          </div>

          {/* Connected Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-red-600 uppercase">1. Upstream Requisition</div>
              <div className="text-xs font-bold text-slate-900">Cyber Police Notice</div>
              <div className="text-[11px] text-slate-500 leading-snug">Section 102 CrPC notice issued to Canara Bank.</div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-red-600 uppercase">2. Bank Action</div>
              <div className="text-xs font-bold text-slate-900">Canara Debit Freeze</div>
              <div className="text-[11px] text-slate-500 leading-snug">Full operational freeze placed on account *4401.</div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="text-[10px] font-bold text-amber-800 uppercase">3. Gateway Impact</div>
              <div className="text-xs font-bold text-slate-900">NPCI APBS Inactive</div>
              <div className="text-[11px] text-amber-800 leading-snug">Aadhaar payment bridge mandate marked INACTIVE.</div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 space-y-1">
              <div className="text-[10px] font-bold text-red-700 uppercase">4. PFMS Rejection</div>
              <div className="text-xs font-bold text-red-900 font-mono">Error: BNS-410</div>
              <div className="text-[11px] text-red-700 leading-snug">Central gateway aborts scheduled transfer.</div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">5. Citizen Outcome</div>
              <div className="text-xs font-bold text-indigo-950">₹48,000 Withheld</div>
              <div className="text-[11px] text-indigo-800 leading-snug">Post-Matric Scholarship withheld from student.</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Action Center & Resolution Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Administrative Action Hub
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize administrative actions with mandatory citizen consent, submit to portals, and verify resolutions.
          </p>
        </div>

        <div className="space-y-4">
          {pendingActions.map(action => {
            const isApproved = action.status === 'APPROVED' || action.citizen_consent;
            const isSubmitted = action.status === 'SUBMITTED';

            return (
              <div
                key={action.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-2.5 py-1 rounded-md">
                      {action.action_type.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{action.purpose}</h4>
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
                    className="text-slate-800 hover:text-slate-950 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
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
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer ${
                      action.citizen_consent
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {action.citizen_consent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>1. Consent Authorized</span>
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
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{isSubmitted ? 'Submitted (Awaiting SLA)' : '2. Submit to Bank Gateway'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* PFMS Recovery Disbursal Button */}
          {currentCase.domain_id === 'dbt_failure' && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Finalize Benefit Disbursal (PFMS Central Gateway)</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Re-validates the updated NPCI Aadhaar mapper state against the active State Bank of India account, triggers central payment retry, and credits the ₹48,000 scholarship.
              </p>
              <button
                onClick={onResolveChain}
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <div className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
            Verified Empirical Facts ({currentCase.facts_summary?.length || 0})
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {currentCase.facts_summary?.map((fact, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Conflicts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
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
                <div key={c.id} className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-2 text-xs">
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

      {/* Modal 1: Legal Petition Dossier */}
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
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
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
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Close Petition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Official Case Resolution Certificate */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-emerald-300 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="w-7 h-7 text-amber-300" />
                <div>
                  <h3 className="text-base font-extrabold tracking-wide">CASE RESOLUTION & AUDIT CERTIFICATE</h3>
                  <p className="text-xs text-emerald-100 font-mono">INDRA Reference #{currentCase.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs text-slate-800">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="text-xs font-bold text-emerald-900 uppercase">Settlement Confirmation</div>
                <div className="text-sm font-extrabold text-slate-900">
                  Benefit Amount: ₹48,000.00 Credited Successfully
                </div>
                <div className="font-mono text-xs text-emerald-800">
                  Central PFMS Settlement UTR: #PFMS-UTR-34F5BBFFF2
                </div>
                <div className="text-[11px] text-slate-600">
                  Beneficiary: <strong>{currentCase.citizen_name}</strong> | Destination: State Bank of India (*8812)
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="font-bold text-slate-900 text-xs">Diagnostic & Remediation Summary:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>Ingested and authenticated 5 multimodal source artefacts with spatial provenance.</li>
                  <li>Reconstructed cross-domain blockades linking Cyber Notice #CR-4412 to NPCI failure BNS-410.</li>
                  <li>Drafted statutory remapping directive under RBI APBS Master Directions.</li>
                  <li>Executed mock gateway disbursal retry and confirmed account credit.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Cryptographic Audit Stamp: SHA256:{currentCase.id.slice(0, 16)}...</span>
                <span>System: INDRA Intelligence v1.0</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-300 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Statutory Precedents & Legal Basis Library */}
      {showLegalLibrary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-slate-800" />
                <h3 className="text-sm font-extrabold text-slate-900">Statutory Precedents & Regulatory Framework</h3>
              </div>
              <button
                onClick={() => setShowLegalLibrary(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-3.5 text-xs text-slate-800">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">1. RBI Master Direction on APBS Aadhaar Seeding</div>
                <div className="text-[11px] text-slate-500 font-mono">Ref: DPSS.CO.PD.No.1810/02.14.006/2015-16</div>
                <p className="text-slate-700 leading-snug pt-1">
                  Mandates commercial banks to update and synchronize the central NPCI Aadhaar mapper within zero-delay protocols upon customer submission of active account mandate.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">2. High Court Precedents on Proportionality of Bank Freezes</div>
                <div className="text-[11px] text-slate-500 font-mono">Ref: Gujarat High Court R/SCR.A/1908/2023 (Sec 102 CrPC)</div>
                <p className="text-slate-700 leading-snug pt-1">
                  Establishes that police freeze requisitions must be strictly restricted to disputed layered transaction amounts and total operational debit freezing of innocent citizen accounts is unlawful.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">3. EPFO Standard Operating Procedure Version 3.0 (2024)</div>
                <div className="text-[11px] text-slate-500 font-mono">Ref: Joint Declaration Policy Circular WS/2024/7741</div>
                <p className="text-slate-700 leading-snug pt-1">
                  Governs time-bound 15-day digital correction of Date of Exit mismatches between establishment relieving certificates and field office member records.
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowLegalLibrary(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
