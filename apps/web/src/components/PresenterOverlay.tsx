import React from 'react';
import {
  Sliders, RotateCcw, AlertTriangle, Zap,
  Clock, X, Check, FileText
} from 'lucide-react';
import type { Case } from '../types';

interface PresenterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case | null;
  onAdvanceTime: (days: number) => void;
  onSelectDomain: (domainId: string) => void;
  onSimulateEvent: (eventType: string) => void;
  onReset: () => void;
}

export const PresenterOverlay: React.FC<PresenterOverlayProps> = ({
  isOpen,
  onClose,
  currentCase,
  onAdvanceTime,
  onSelectDomain,
  onSimulateEvent,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-300 shadow-2xl p-6 font-sans select-none animate-in slide-in-from-top duration-200"
      role="dialog"
      aria-label="Presenter and Evaluator Control Console"
    >
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-900">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Presenter & Evaluator Control Deck
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  SHORTCUT: SHIFT+D / CTRL+SHIFT+O
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct deterministic invocation of state transitions, temporal advancement, and mock institutional responses.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Close Presenter Deck"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Col 1: Temporal Fast-Forward */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Temporal Fast-Forward</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Advance simulated clock to test statutory deadlines and autonomous escalations.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onAdvanceTime(5)}
                className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                +5 Days
              </button>
              <button
                onClick={() => onAdvanceTime(15)}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                +15 Days (SLA)
              </button>
            </div>
          </div>

          {/* Col 2: Institutional Response Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Mock Gateway Signals</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Inject synthetic bank approvals, timeouts, or data contradictions.
            </p>
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => onSimulateEvent('NPCI_MAPPER_UPDATED')}
                className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer text-left flex items-center justify-between"
              >
                <span>Simulate Bank Resolution</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </button>
              <button
                onClick={() => onSimulateEvent('BANK_REJECTED')}
                className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer text-left flex items-center justify-between"
              >
                <span>Simulate Inaction / Timeout</span>
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          </div>

          {/* Col 3: Domain Switcher */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Domain Case Sandbox</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Switch administrative domains to prove universal engine capabilities.
            </p>
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => onSelectDomain('dbt_failure')}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer text-left border ${
                  currentCase?.domain_id === 'dbt_failure'
                    ? 'bg-white text-blue-900 border-blue-400 font-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                1. DBT Scholarship (Aakash Verma)
              </button>
              <button
                onClick={() => onSelectDomain('epfo_claim')}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer text-left border ${
                  currentCase?.domain_id === 'epfo_claim'
                    ? 'bg-white text-blue-900 border-blue-400 font-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                2. EPFO Exit Dispute (Pooja Sharma)
              </button>
            </div>
          </div>

          {/* Col 4: State Reset */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Environment Reset</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">
                Wipe active case state and reset all mock institutional APIs to Day 0.
              </p>
            </div>
            <button
              onClick={onReset}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Clean Day 0 State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
