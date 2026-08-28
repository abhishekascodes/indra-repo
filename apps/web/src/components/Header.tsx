import React from 'react';
import { Shield, Clock, Play, RefreshCw, Cpu } from 'lucide-react';
import type { Case, AgentState } from '../types';

interface HeaderProps {
  currentCase: Case | null;
  onAdvanceTime: (days: number) => void;
  onSelectDomain: (domainId: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

const STATE_COLORS: Record<AgentState, { bg: string; text: string; border: string }> = {
  CASE_CREATED: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-700/50' },
  EVIDENCE_ANALYSIS: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-700/50' },
  ACTION_REQUIRED: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-700/50' },
  USER_APPROVAL: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-700/50' },
  SUBMITTED: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-700/50' },
  WAITING: { bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-700/50' },
  RESPONSE_RECEIVED: { bg: 'bg-teal-950/60', text: 'text-teal-400', border: 'border-teal-700/50' },
  VERIFICATION: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-700/50' },
  ESCALATION_REQUIRED: { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-700/50' },
  RESOLUTION: { bg: 'bg-green-950/60', text: 'text-green-400', border: 'border-green-700/50' },
  BLOCKED: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-700/50' },
};

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  onAdvanceTime,
  onSelectDomain,
  onReset,
  isLoading,
}) => {
  const stateStyle = currentCase
    ? STATE_COLORS[currentCase.current_state] || { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700' }
    : { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700' };

  return (
    <header className="h-16 bg-[#0B0F17] border-b border-slate-800/80 px-6 flex items-center justify-between select-none z-30">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-widest text-lg text-white font-mono">INDRA</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                v1.0 AGENCY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Citizen Administrative Intelligence</p>
          </div>
        </div>

        {/* Case Switcher Tabs */}
        <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800 space-x-1 ml-4">
          <button
            onClick={() => onSelectDomain('dbt_failure')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentCase?.domain_id === 'dbt_failure'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            DBT / PFMS Failure (Flagship)
          </button>
          <button
            onClick={() => onSelectDomain('epfo_claim')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentCase?.domain_id === 'epfo_claim'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            EPFO Exit Date Claim (Domain 2)
          </button>
        </div>
      </div>

      {/* Case Status & Confidence Header */}
      {currentCase && (
        <div className="hidden md:flex items-center space-x-6">
          {/* Case Identifier */}
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Case</div>
            <div className="text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5">
              <span>{currentCase.id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-sans font-medium">{currentCase.citizen_name}</span>
            </div>
          </div>

          {/* State Machine Status Badge */}
          <div className={`px-3 py-1.5 rounded-lg border ${stateStyle.bg} ${stateStyle.border} flex items-center space-x-2`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className={`text-xs font-bold font-mono uppercase tracking-wide ${stateStyle.text}`}>
              {currentCase.current_state.replace('_', ' ')}
            </span>
          </div>

          {/* Simulated Day Counter */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400">Day </span>
              <span className="font-bold text-amber-300 font-mono">{currentCase.simulated_day}</span>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Confidence: </span>
              <span className="font-bold text-emerald-400 font-mono">
                {Math.round((currentCase.overall_confidence || 0.95) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls & Fast Forward */}
      <div className="flex items-center space-x-2.5">
        {currentCase && (
          <>
            <button
              onClick={() => onAdvanceTime(5)}
              disabled={isLoading}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Advance simulated clock by 5 days"
            >
              <Play className="w-3 h-3 fill-amber-400" />
              <span>+5 Days</span>
            </button>
            <button
              onClick={() => onAdvanceTime(15)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              title="Fast forward 15 days to test SLA expiry and escalation trigger"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Fast-Forward 15d</span>
            </button>
          </>
        )}

        <button
          onClick={onReset}
          disabled={isLoading}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg text-xs font-medium transition-all"
          title="Reset Demo State"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
