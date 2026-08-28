import React, { useState } from 'react';
import {
  Brain, AlertTriangle, CheckCircle,
  FileText, Send, Lock, Check, Sparkles
} from 'lucide-react';
import type { Case, CandidateCause, ActionDraft } from '../types';

interface IntelligencePanelProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  isLoading: boolean;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'root_cause' | 'contradictions' | 'actions' | 'facts'>('actions');
  const [viewingLetterAction, setViewingLetterAction] = useState<ActionDraft | null>(null);

  const topCause: CandidateCause | undefined = currentCase.candidate_causes?.[0];
  const pendingActions = currentCase.actions || [];
  const contradictions = currentCase.contradictions || [];

  return (
    <div className="h-full flex flex-col bg-[#0B0F17] border-l border-slate-800/80 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">INDRA Intelligence</h2>
        </div>
        <div className="flex items-center space-x-1">
          {contradictions.length > 0 && (
            <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-700/60 px-2 py-0.5 rounded font-mono font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{contradictions.length} Conflicts</span>
            </span>
          )}
        </div>
      </div>

      {/* Case Situation Banner */}
      <div className="p-3 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border-b border-slate-800/60">
        <div className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider mb-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>Synthesized Case Situation</span>
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          {currentCase.objective}
        </p>
        {currentCase.blocker_summary && (
          <div className="mt-2 p-2 rounded bg-red-950/30 border border-red-800/40 text-[11px] text-red-300">
            <span className="font-bold text-red-400">Identified Root Blocker: </span>
            {currentCase.blocker_summary}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800/80 bg-[#080B11] text-[11px]">
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-2.5 font-bold transition-all border-b-2 ${
            activeTab === 'actions'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Action Center ({pendingActions.length})
        </button>
        <button
          onClick={() => setActiveTab('root_cause')}
          className={`flex-1 py-2.5 font-bold transition-all border-b-2 ${
            activeTab === 'root_cause'
              ? 'border-purple-500 text-purple-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Causal Hypothesis
        </button>
        <button
          onClick={() => setActiveTab('contradictions')}
          className={`flex-1 py-2.5 font-bold transition-all border-b-2 ${
            activeTab === 'contradictions'
              ? 'border-red-500 text-red-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Conflicts ({contradictions.length})
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-2.5 font-bold transition-all border-b-2 ${
            activeTab === 'facts'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Facts ({currentCase.facts_summary?.length || 0})
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {/* TAB 1: ACTION CENTER */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {pendingActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                No administrative actions currently required.
              </div>
            ) : (
              pendingActions.map(action => {
                const isApproved = action.status === 'APPROVED' || action.citizen_consent;
                const isSubmitted = action.status === 'SUBMITTED';

                return (
                  <div
                    key={action.id}
                    className="p-3.5 rounded-xl border border-slate-800 bg-[#0F1420] hover:border-slate-700 transition-all space-y-3"
                  >
                    {/* Action Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                          {action.action_type}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1.5">{action.purpose}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Target: <span className="text-slate-300 font-semibold">{action.target_institution}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isSubmitted
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                          : isApproved
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                      }`}>
                        {action.status}
                      </span>
                    </div>

                    {/* Preview Generated Letter Button */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => setViewingLetterAction(action)}
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Draft Representation</span>
                      </button>

                      <span className="text-[10px] text-slate-500 font-mono">
                        SLA: {action.response_deadline || 15} Days
                      </span>
                    </div>

                    {/* Mandatory Citizen Consent & Submission Controls */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      {/* Consent Toggle */}
                      <button
                        onClick={() => onGrantConsent(action.id, !action.citizen_consent)}
                        disabled={isSubmitted || isLoading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                          action.citizen_consent
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {action.citizen_consent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Consent Granted</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Authorize Action</span>
                          </>
                        )}
                      </button>

                      {/* Submit Action */}
                      <button
                        onClick={() => onSubmitAction(action.id)}
                        disabled={!action.citizen_consent || isSubmitted || isLoading}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitted ? 'Submitted' : 'Submit to Portal'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Resolve Complete Chain Trigger (DBT Flagship) */}
            {currentCase.domain_id === 'dbt_failure' && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-800/50 space-y-2 mt-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Execute PFMS Recovery Cycle</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Re-validates updated NPCI mapper state and triggers mock PFMS central payment retry to finalize benefit credit.
                </p>
                <button
                  onClick={onResolveChain}
                  disabled={isLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg active:scale-98"
                >
                  Verify & Execute PFMS Disbursal
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROOT CAUSE */}
        {activeTab === 'root_cause' && (
          <div className="space-y-3">
            {topCause ? (
              <div className="p-3.5 rounded-xl border border-purple-800/60 bg-purple-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-400 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700/50">
                    Candidate Root Cause
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {Math.round(topCause.confidence * 100)}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {topCause.hypothesis}
                </p>

                {topCause.recommended_remedy && (
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="font-bold text-blue-400 uppercase text-[10px]">Recommended Remedy</div>
                    <div className="whitespace-pre-line text-slate-200">{topCause.recommended_remedy}</div>
                  </div>
                )}

                {topCause.unknowns && topCause.unknowns.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="font-bold text-amber-400 uppercase text-[10px]">What is Unknown</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {topCause.unknowns.map((u, i) => (
                        <li key={i} className="text-slate-300">{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 italic">No root cause formulated yet.</div>
            )}
          </div>
        )}

        {/* TAB 3: CONTRADICTIONS */}
        {activeTab === 'contradictions' && (
          <div className="space-y-3">
            {contradictions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">No factual conflicts detected.</div>
            ) : (
              contradictions.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-red-800/60 bg-red-950/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-700/50">
                      Conflict: {c.field.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-900 text-red-200 font-bold">
                      {c.severity} SEVERITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-snug">{c.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-500">Record A</div>
                      <div className="text-slate-300 truncate">{String(c.value_a)}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-500">Record B</div>
                      <div className="text-red-300 truncate">{String(c.value_b)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: FACTS */}
        {activeTab === 'facts' && (
          <div className="space-y-1.5">
            {currentCase.facts_summary?.map((fact, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-[#0F1420] border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft Letter Modal */}
      {viewingLetterAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#0D121F] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Generated Action Representation</h3>
                <p className="text-xs text-slate-400">{viewingLetterAction.purpose}</p>
              </div>
              <button
                onClick={() => setViewingLetterAction(null)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap bg-[#080B11] m-3 rounded-xl border border-slate-800/80 leading-relaxed shadow-inner">
              {viewingLetterAction.generated_content}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setViewingLetterAction(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
