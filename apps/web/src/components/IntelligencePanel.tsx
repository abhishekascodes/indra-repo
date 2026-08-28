import React, { useState } from 'react';
import {
  Brain, AlertTriangle, CheckCircle2,
  FileText, Send, Lock, Check, Sparkles, X, GitFork
} from 'lucide-react';
import type { Case, CandidateCause, ActionDraft } from '../types';

interface IntelligencePanelProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onHighlightCausalChain: (nodeIds: string[]) => void;
  highlightedChainNodeIds?: string[];
  isLoading: boolean;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onHighlightCausalChain,
  highlightedChainNodeIds = [],
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'action_center' | 'why_indra'>('action_center');
  const [viewingLetterAction, setViewingLetterAction] = useState<ActionDraft | null>(null);

  const topCause: CandidateCause | undefined = currentCase.candidate_causes?.[0];
  const pendingActions = currentCase.actions || [];
  const contradictions = currentCase.contradictions || [];

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 select-none">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Case Intelligence & Action
          </h2>
        </div>
        {contradictions.length > 0 && (
          <span className="text-[11px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>{contradictions.length} Conflict{contradictions.length > 1 ? 's' : ''} Detected</span>
          </span>
        )}
      </div>

      {/* Case Situation Hero Card */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 border-b border-slate-200">
        <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-wider mb-1 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Case Synthesis</span>
        </div>
        <p className="text-xs font-semibold text-slate-900 leading-snug">
          {currentCase.objective}
        </p>

        {currentCase.blocker_summary && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-red-50/80 border border-red-200 text-xs text-red-900 space-y-0.5">
            <div className="text-[10px] uppercase font-bold text-red-700">Root Blocker Identified:</div>
            <div className="leading-snug">{currentCase.blocker_summary}</div>
          </div>
        )}
      </div>

      {/* Clean 2-Tab Selector */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('action_center')}
          className={`flex-1 py-2.5 transition-all border-b-2 ${
            activeTab === 'action_center'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          1. Next Action ({pendingActions.length})
        </button>
        <button
          onClick={() => setActiveTab('why_indra')}
          className={`flex-1 py-2.5 transition-all border-b-2 ${
            activeTab === 'why_indra'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          2. Root Cause & Evidence
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {/* TAB 1: ACTION CENTER */}
        {activeTab === 'action_center' && (
          <div className="space-y-3">
            {pendingActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No administrative actions currently required.
              </div>
            ) : (
              pendingActions.map(action => {
                const isApproved = action.status === 'APPROVED' || action.citizen_consent;
                const isSubmitted = action.status === 'SUBMITTED';

                return (
                  <div
                    key={action.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {action.action_type.replace(/_/g, ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5">{action.purpose}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Target: <span className="text-slate-800 font-semibold">{action.target_institution}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isSubmitted
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-300'
                          : isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {action.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* View Draft Letter */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => setViewingLetterAction(action)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Draft Petition Dossier</span>
                      </button>

                      <span className="text-[11px] text-slate-500 font-mono">
                        SLA: {action.response_deadline || 15} Days
                      </span>
                    </div>

                    {/* 2 Big Clear Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                      {/* Step 1: Consent Toggle */}
                      <button
                        onClick={() => onGrantConsent(action.id, !action.citizen_consent)}
                        disabled={isSubmitted || isLoading}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-2xs ${
                          action.citizen_consent
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
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
                            <span>1. Authorize Action</span>
                          </>
                        )}
                      </button>

                      {/* Step 2: Submit */}
                      <button
                        onClick={() => onSubmitAction(action.id)}
                        disabled={!action.citizen_consent || isSubmitted || isLoading}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-2xs active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isSubmitted ? 'Submitted' : '2. Submit to Portal'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Resolve Cycle (PFMS Flagship) */}
            {currentCase.domain_id === 'dbt_failure' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 mt-4 shadow-xs">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Execute PFMS Disbursal Recovery Cycle</span>
                </div>
                <p className="text-xs text-emerald-800 leading-snug">
                  Re-validates active NPCI mapping and triggers mock central PFMS payment retry to credit the ₹48,000 scholarship.
                </p>
                <button
                  onClick={onResolveChain}
                  disabled={isLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-98"
                >
                  Verify & Execute PFMS Disbursal
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WHY INDRA BELIEVES THIS */}
        {activeTab === 'why_indra' && (
          <div className="space-y-3">
            {/* Root Cause Card */}
            {topCause && (
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    Causal Hypothesis
                  </span>
                  <span className="text-xs font-bold text-purple-900 font-mono">
                    {Math.round(topCause.confidence * 100)}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {topCause.hypothesis}
                </p>

                {topCause.causal_chain && topCause.causal_chain.length > 0 && (
                  <button
                    onClick={() => onHighlightCausalChain(topCause.causal_chain)}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>
                      {highlightedChainNodeIds.length > 0
                        ? 'Causal Path Highlighted in Graph'
                        : 'Highlight Causal Path in Graph'}
                    </span>
                  </button>
                )}

                {topCause.recommended_remedy && (
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">Recommended Remedy</div>
                    <div className="whitespace-pre-line text-slate-700 text-[11px]">{topCause.recommended_remedy}</div>
                  </div>
                )}
              </div>
            )}

            {/* Conflicts List */}
            {contradictions.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Factual Conflicts ({contradictions.length})
                </div>
                {contradictions.map(c => (
                  <div key={c.id} className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-1.5 text-xs">
                    <div className="font-bold text-red-800">{c.field.replace(/_/g, ' ').toUpperCase()} Conflict</div>
                    <p className="text-slate-800 leading-snug">{c.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-[9px] text-slate-400 font-bold">RECORD A</div>
                        <div className="text-slate-900 font-semibold">{String(c.value_a)}</div>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-[9px] text-red-600 font-bold">RECORD B</div>
                        <div className="text-red-700 font-semibold">{String(c.value_b)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Verified Facts */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Verified Empirical Facts ({currentCase.facts_summary?.length || 0})
              </div>
              {currentCase.facts_summary?.map((fact, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 flex items-start space-x-2 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{fact}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Draft Letter Modal */}
      {viewingLetterAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Generated Action Dossier</h3>
                <p className="text-xs text-slate-500">{viewingLetterAction.purpose}</p>
              </div>
              <button
                onClick={() => setViewingLetterAction(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-900 whitespace-pre-wrap bg-slate-50/50 m-3 rounded-xl border border-slate-200 leading-relaxed shadow-inner">
              {viewingLetterAction.generated_content}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingLetterAction(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
