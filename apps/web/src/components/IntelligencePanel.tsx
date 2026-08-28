import React, { useState } from 'react';
import {
  Brain, AlertTriangle, CheckCircle,
  FileText, Send, Lock, Check, Sparkles, X
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
    <div className="h-full flex flex-col bg-[#F8FAFC] border-l border-slate-300 select-none font-mono">
      {/* Bloomberg Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-300 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-slate-800" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">INTELLIGENCE TERMINAL</h2>
        </div>
        <div className="flex items-center space-x-1">
          {contradictions.length > 0 && (
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span>{contradictions.length} CONFLICTS</span>
            </span>
          )}
        </div>
      </div>

      {/* Case Situation Banner */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>CASE OBJECTIVE & SYNTHESIS</span>
        </div>
        <p className="text-xs text-slate-900 font-semibold leading-relaxed font-sans">
          {currentCase.objective}
        </p>
        {currentCase.blocker_summary && (
          <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-[10px] text-red-900 font-mono">
            <span className="font-bold text-red-700">ROOT BLOCKER: </span>
            {currentCase.blocker_summary}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-300 bg-white text-[10px]">
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-2 font-bold transition-all border-b-2 ${
            activeTab === 'actions'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          ACTIONS ({pendingActions.length})
        </button>
        <button
          onClick={() => setActiveTab('root_cause')}
          className={`flex-1 py-2 font-bold transition-all border-b-2 ${
            activeTab === 'root_cause'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          ROOT CAUSE
        </button>
        <button
          onClick={() => setActiveTab('contradictions')}
          className={`flex-1 py-2 font-bold transition-all border-b-2 ${
            activeTab === 'contradictions'
              ? 'border-red-600 text-red-700 bg-red-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          CONFLICTS ({contradictions.length})
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-2 font-bold transition-all border-b-2 ${
            activeTab === 'facts'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          FACTS ({currentCase.facts_summary?.length || 0})
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#F8FAFC]">
        {/* TAB 1: ACTION CENTER */}
        {activeTab === 'actions' && (
          <div className="space-y-2.5">
            {pendingActions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">
                NO ADMINISTRATIVE ACTIONS REQUIRED
              </div>
            ) : (
              pendingActions.map(action => {
                const isApproved = action.status === 'APPROVED' || action.citizen_consent;
                const isSubmitted = action.status === 'SUBMITTED';

                return (
                  <div
                    key={action.id}
                    className="p-3 rounded border border-slate-300 bg-white hover:border-slate-400 transition-all space-y-2.5 shadow-2xs"
                  >
                    {/* Action Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                          {action.action_type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 font-sans">{action.purpose}</h4>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Target: <span className="text-slate-800 font-semibold">{action.target_institution}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isSubmitted
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-300'
                          : isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {action.status}
                      </span>
                    </div>

                    {/* Preview Generated Letter Button */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => setViewingLetterAction(action)}
                        className="text-amber-700 hover:text-amber-900 flex items-center space-x-1 font-bold transition-colors text-[10px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>INSPECT DRAFT PETITION</span>
                      </button>

                      <span className="text-[9px] text-slate-500">
                        SLA: {action.response_deadline || 15}D
                      </span>
                    </div>

                    {/* Citizen Consent & Submission Controls */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => onGrantConsent(action.id, !action.citizen_consent)}
                        disabled={isSubmitted || isLoading}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition-all ${
                          action.citizen_consent
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-400'
                            : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {action.citizen_consent ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>CONSENT GRANTED</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>AUTHORIZE ACTION</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onSubmitAction(action.id)}
                        disabled={!action.citizen_consent || isSubmitted || isLoading}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-[10px] font-bold flex items-center space-x-1 transition-all shadow-xs active:scale-95"
                      >
                        <Send className="w-3 h-3 text-amber-400" />
                        <span>{isSubmitted ? 'SUBMITTED' : 'SUBMIT PORTAL'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Resolve Complete Chain Trigger (DBT Flagship) */}
            {currentCase.domain_id === 'dbt_failure' && (
              <div className="p-3 rounded bg-emerald-50/70 border border-emerald-300 space-y-2 mt-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>EXECUTE PFMS RECOVERY CYCLE</span>
                </div>
                <p className="text-[10px] text-slate-700 leading-relaxed font-sans">
                  Re-validates updated NPCI mapper state and triggers mock PFMS central payment retry to finalize benefit credit.
                </p>
                <button
                  onClick={onResolveChain}
                  disabled={isLoading}
                  className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-all shadow-xs active:scale-98"
                >
                  VERIFY & DISBURSE BENEFIT
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROOT CAUSE */}
        {activeTab === 'root_cause' && (
          <div className="space-y-2.5">
            {topCause ? (
              <div className="p-3 rounded border border-purple-300 bg-purple-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300">
                    CANDIDATE ROOT CAUSE
                  </span>
                  <span className="text-xs font-bold text-purple-900">
                    {Math.round(topCause.confidence * 100)}% CONFIDENCE
                  </span>
                </div>

                <p className="text-xs text-slate-900 leading-relaxed font-sans font-medium">
                  {topCause.hypothesis}
                </p>

                {topCause.recommended_remedy && (
                  <div className="p-2 rounded bg-white border border-slate-200 text-[10px] text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 uppercase text-[9px]">RECOMMENDED REMEDY</div>
                    <div className="whitespace-pre-line text-slate-700 font-sans">{topCause.recommended_remedy}</div>
                  </div>
                )}

                {topCause.unknowns && topCause.unknowns.length > 0 && (
                  <div className="p-2 rounded bg-white border border-slate-200 text-[10px] text-slate-600 space-y-1">
                    <div className="font-bold text-amber-700 uppercase text-[9px]">UNCERTAINTIES & UNKNOWNS</div>
                    <ul className="list-disc list-inside space-y-0.5 font-sans">
                      {topCause.unknowns.map((u, i) => (
                        <li key={i} className="text-slate-700">{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">NO ROOT CAUSE FORMULATED</div>
            )}
          </div>
        )}

        {/* TAB 3: CONTRADICTIONS */}
        {activeTab === 'contradictions' && (
          <div className="space-y-2.5">
            {contradictions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">NO FACTUAL CONFLICTS DETECTED</div>
            ) : (
              contradictions.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded border border-red-300 bg-red-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                      CONFLICT: {c.field.replace('_', ' ')}
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-200 text-red-900 font-bold">
                      {c.severity} SEVERITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-900 leading-snug font-sans">{c.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="text-[8px] text-slate-400 font-bold">RECORD A</div>
                      <div className="text-slate-800 truncate font-semibold">{String(c.value_a)}</div>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="text-[8px] text-red-600 font-bold">RECORD B</div>
                      <div className="text-red-700 truncate font-semibold">{String(c.value_b)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: FACTS */}
        {activeTab === 'facts' && (
          <div className="space-y-1">
            {currentCase.facts_summary?.map((fact, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-800 flex items-start space-x-2 shadow-2xs font-sans"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft Letter Modal */}
      {viewingLetterAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-400 rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden font-mono">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase">GENERATED ACTION DOSSIER</h3>
                <p className="text-[10px] text-slate-500 font-sans">{viewingLetterAction.purpose}</p>
              </div>
              <button
                onClick={() => setViewingLetterAction(null)}
                className="p-1 text-slate-500 hover:text-slate-900 rounded transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-900 whitespace-pre-wrap bg-white m-3 rounded border border-slate-200 leading-relaxed">
              {viewingLetterAction.generated_content}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-300 flex justify-end">
              <button
                onClick={() => setViewingLetterAction(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-all shadow-xs"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
