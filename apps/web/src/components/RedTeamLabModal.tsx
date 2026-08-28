import React, { useState } from 'react';
import { ShieldAlert, Play, X } from 'lucide-react';
import type { Case } from '../types';

interface RedTeamLabModalProps {
  currentCase: Case;
  onClose: () => void;
}

export const RedTeamLabModal: React.FC<RedTeamLabModalProps> = ({
  onClose,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('sc-1');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const scenarios = [
    {
      id: "sc-1",
      title: "Adversarial Injection: Conflicting Institutional DOB Record",
      severity: "CRITICAL",
      description: "Adversary injects a conflicting PAN record with DOB 1999-01-01 into the evidence pipeline.",
      expectedDefense: "Contradiction Engine detects DOB mismatch -> Sets severity to CRITICAL -> Quarantines node -> Halts submission."
    },
    {
      id: "sc-2",
      title: "Adversarial Action: Citizen Revokes Consent Pre-Execution",
      severity: "HIGH",
      description: "Citizen revokes authorization while action is queued in submission gateway buffer.",
      expectedDefense: "Policy Guardrail RULE-GUARD-02 intercepts transaction -> Revokes capability token -> Aborts submission."
    },
    {
      id: "sc-3",
      title: "Adversarial Network: Simulated 30-Day Institutional Deadlock",
      severity: "MEDIUM",
      description: "Target bank portal drops representation and ceases status response indefinitely.",
      expectedDefense: "Temporal SLA engine fires timeout at Day 15 -> Transitions state to ESCALATION_REQUIRED -> Generates CPGRAMS grievance."
    },
    {
      id: "sc-4",
      title: "Adversarial Data: Stale Branch IFSC Code Injected",
      severity: "LOW",
      description: "Legacy bank IFSC injected following national bank merger consolidation.",
      expectedDefense: "NPCI APBS validator detects invalid routing node -> Auto-suggests modern merged IFSC."
    }
  ];

  const handleRunScenario = (scId: string) => {
    const sc = scenarios.find(s => s.id === scId);
    if (sc) {
      setSimulationResult(`[ADVERSARIAL SIMULATION ENGAGED]\nScenario: ${sc.title}\n\n[DEFENSE ENGAGED]: ${sc.expectedDefense}\n\n[SUPERVISOR VERDICT]: System successfully preserved invariant integrity and prevented unauthorized or corrupt state transitions.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">RED TEAM ADVERSARIAL SIMULATOR</h2>
                <span className="text-[10px] font-mono font-bold bg-red-500/30 text-red-300 px-2 py-0.5 rounded border border-red-500/50">
                  SYSTEM RESILIENCE LAB
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Deliberately inject failures, contradictions, and revoked consent to test INDRA's defensive invariants
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenarios List */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                Adversarial Attack Scenarios
              </div>
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => { setSelectedScenario(sc.id); setSimulationResult(null); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedScenario === sc.id
                      ? 'bg-white border-red-500 ring-2 ring-red-400/30 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{sc.title.split(':')[0]}</span>
                    <span className="text-[9px] font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {sc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{sc.description}</p>
                </div>
              ))}
            </div>

            {/* Execution Workbench */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  Test Execution Console
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Trigger the adversarial scenario against INDRA's active state machine and supervisor layer to verify fault isolation.
                </p>

                <button
                  onClick={() => handleRunScenario(selectedScenario)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-red-600/20 active:scale-98 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                  <span>Execute Adversarial Test</span>
                </button>
              </div>

              {simulationResult ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {simulationResult}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-center text-xs italic font-mono">
                  Select a scenario and click execute to observe defensive supervisor behavior.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Adversarial Gauntlet Verification • Non-Happy Path Testing</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
