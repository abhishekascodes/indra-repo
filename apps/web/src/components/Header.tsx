import React, { useState } from 'react';
import {
  Shield, Clock, Play, RotateCcw, Cpu, ChevronRight, Sliders,
  FilePlus, Hourglass, ChevronDown
} from 'lucide-react';
import type { Case, AgentState } from '../types';

interface HeaderProps {
  currentCase: Case | null;
  onAdvanceTime: (days: number) => void;
  onSelectDomain: (domainId: string) => void;
  onSimulateEvent: (eventType: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

const STATE_COLORS: Record<AgentState, { bg: string; text: string; border: string; dot: string }> = {
  CASE_CREATED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-600' },
  EVIDENCE_ANALYSIS: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300', dot: 'bg-indigo-600' },
  ACTION_REQUIRED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-400', dot: 'bg-amber-600' },
  USER_APPROVAL: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-600' },
  SUBMITTED: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-300', dot: 'bg-cyan-600' },
  WAITING: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-400', dot: 'bg-yellow-600' },
  RESPONSE_RECEIVED: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300', dot: 'bg-teal-600' },
  VERIFICATION: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-600' },
  ESCALATION_REQUIRED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400', dot: 'bg-red-600' },
  RESOLUTION: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-400', dot: 'bg-green-600' },
  BLOCKED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', dot: 'bg-rose-600' },
};

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  onAdvanceTime,
  onSelectDomain,
  onSimulateEvent,
  onReset,
  isLoading,
}) => {
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const stateStyle = currentCase
    ? STATE_COLORS[currentCase.current_state] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' }
    : { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' };

  return (
    <header className="h-14 bg-white border-b border-slate-300 px-5 flex items-center justify-between select-none z-30 shadow-xs">
      {/* Brand & Bloomberg Terminal Ticker */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-widest text-base text-slate-900 font-mono">INDRA</span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 bg-amber-500 text-white rounded-xs">
                TERMINAL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono -mt-0.5 tracking-tight">Citizen Administrative Agency</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>

        {/* Domain Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded border border-slate-300 space-x-1 font-mono text-xs">
          <button
            onClick={() => onSelectDomain('dbt_failure')}
            className={`px-3 py-1 rounded-xs font-semibold transition-all ${
              currentCase?.domain_id === 'dbt_failure'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            [1] Cross-Domain DBT/PFMS
          </button>
          <button
            onClick={() => onSelectDomain('epfo_claim')}
            className={`px-3 py-1 rounded-xs font-semibold transition-all ${
              currentCase?.domain_id === 'epfo_claim'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            [2] EPFO Claim Master
          </button>
        </div>
      </div>

      {/* Case Status & Bloomberg Ticker Bar */}
      {currentCase && (
        <div className="hidden md:flex items-center space-x-5 font-mono">
          {/* Active Case ID */}
          <div className="text-left border-r border-slate-200 pr-4">
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">CASE ID</div>
            <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
              <span className="text-amber-600">{currentCase.id}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800">{currentCase.citizen_name}</span>
            </div>
          </div>

          {/* State Machine Status Badge */}
          <div className={`px-2.5 py-1 rounded border ${stateStyle.bg} ${stateStyle.border} flex items-center space-x-2`}>
            <span className={`w-2 h-2 rounded-full ${stateStyle.dot} animate-pulse`}></span>
            <span className={`text-[11px] font-bold tracking-wide uppercase ${stateStyle.text}`}>
              {currentCase.current_state.replace('_', ' ')}
            </span>
          </div>

          {/* Simulated Clock Counter */}
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <div className="text-xs">
              <span className="text-slate-500">Day: </span>
              <span className="font-bold text-slate-900">{currentCase.simulated_day}</span>
            </div>
          </div>

          {/* Confidence Metric */}
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <div className="text-xs">
              <span className="text-slate-500">Conf: </span>
              <span className="font-bold text-emerald-700">
                {Math.round((currentCase.overall_confidence || 0.95) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls & Fast Forward */}
      <div className="flex items-center space-x-2 font-mono relative">
        {currentCase && (
          <>
            <button
              onClick={() => onAdvanceTime(5)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-300 rounded text-xs font-bold flex items-center space-x-1 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Advance simulated clock by 5 days"
            >
              <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
              <span>+5D</span>
            </button>
            <button
              onClick={() => onAdvanceTime(15)}
              disabled={isLoading}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Fast forward 15 days to test statutory SLA expiry"
            >
              <Play className="w-3 h-3 text-white fill-white" />
              <span>+15D SLA</span>
            </button>

            {/* Demo Adaptive Controls Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-bold flex items-center space-x-1 transition-all shadow-xs hover:bg-slate-800"
              >
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>DEMO</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-300 rounded-lg shadow-xl p-2 z-50 space-y-1 font-mono text-xs">
                  <div className="text-[9px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-100">
                    ADAPTIVE SCENARIOS
                  </div>
                  <button
                    onClick={() => {
                      onSimulateEvent('SLA_TIMEOUT');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-red-50 text-red-700 font-bold flex items-center space-x-2 transition-colors"
                  >
                    <Hourglass className="w-3.5 h-3.5 text-red-600" />
                    <span>Trigger 15-Day SLA Timeout</span>
                  </button>
                  <button
                    onClick={() => {
                      onSimulateEvent('GOV_DELAY');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-amber-50 text-amber-800 font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Simulate Institutional Delay</span>
                  </button>
                  <button
                    onClick={() => {
                      onSimulateEvent('NEW_EVIDENCE');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-blue-50 text-blue-700 font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <FilePlus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ingest Supplemental Receipt</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={onReset}
          disabled={isLoading}
          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 rounded text-xs transition-all shadow-xs"
          title="Reset Environment State"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
