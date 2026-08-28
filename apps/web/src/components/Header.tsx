import React, { useState } from 'react';
import {
  Shield, Clock, Play, RotateCcw, Sliders,
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

const STATE_CONFIG: Record<AgentState, { label: string; bg: string; text: string; dot: string }> = {
  CASE_CREATED: { label: 'Case Initialized', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
  EVIDENCE_ANALYSIS: { label: 'Analyzing Evidence', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
  ACTION_REQUIRED: { label: 'Action Required', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', dot: 'bg-amber-600' },
  USER_APPROVAL: { label: 'Awaiting Citizen Consent', bg: 'bg-amber-50 border-amber-400', text: 'text-amber-900', dot: 'bg-amber-600' },
  SUBMITTED: { label: 'Submitted to Portal', bg: 'bg-cyan-50 border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-600' },
  WAITING: { label: 'Waiting on Institution (15d SLA)', bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-800', dot: 'bg-yellow-600' },
  RESPONSE_RECEIVED: { label: 'Response Received', bg: 'bg-teal-50 border-teal-300', text: 'text-teal-800', dot: 'bg-teal-600' },
  VERIFICATION: { label: 'Verifying Settlement', bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  ESCALATION_REQUIRED: { label: 'SLA Breached - Escalation', bg: 'bg-red-50 border-red-300', text: 'text-red-700', dot: 'bg-red-600' },
  RESOLUTION: { label: 'Benefit Recovered & Credited', bg: 'bg-emerald-50 border-emerald-400', text: 'text-emerald-900', dot: 'bg-emerald-600' },
  BLOCKED: { label: 'Action Blocked', bg: 'bg-rose-50 border-rose-300', text: 'text-rose-700', dot: 'bg-rose-600' },
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

  const stateCfg = currentCase
    ? STATE_CONFIG[currentCase.current_state] || { label: currentCase.current_state, bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' }
    : { label: 'Loading', bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between select-none z-30 shadow-xs">
      {/* Brand & Clean Switcher */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">INDRA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                AI AGENCY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Citizen Case Intelligence</p>
          </div>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 space-x-1 text-xs">
          <button
            onClick={() => onSelectDomain('dbt_failure')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              currentCase?.domain_id === 'dbt_failure'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DBT Scholarship Failure (Flagship)
          </button>
          <button
            onClick={() => onSelectDomain('epfo_claim')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              currentCase?.domain_id === 'epfo_claim'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EPFO PF Claim Rejection
          </button>
        </div>
      </div>

      {/* Case Status Pill */}
      {currentCase && (
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full border ${stateCfg.bg} flex items-center space-x-2 shadow-2xs`}>
            <span className={`w-2 h-2 rounded-full ${stateCfg.dot} animate-pulse`}></span>
            <span className={`text-xs font-bold ${stateCfg.text}`}>
              {stateCfg.label}
            </span>
          </div>

          <div className="text-xs text-slate-500 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            Day: <span className="font-bold text-slate-900">{currentCase.simulated_day}</span>
          </div>
        </div>
      )}

      {/* Controls & Quick Actions */}
      <div className="flex items-center space-x-2">
        {currentCase && (
          <>
            <button
              onClick={() => onAdvanceTime(15)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Advance time 15 days to test statutory SLA expiration"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Fast-Forward +15d</span>
            </button>

            {/* Demo Adaptive Scenarios */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all border border-slate-200"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Simulate</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-100">
                    ADAPTIVE SCENARIOS
                  </div>
                  <button
                    onClick={() => {
                      onSimulateEvent('SLA_TIMEOUT');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-700 font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Hourglass className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-bold">Trigger 15-Day SLA Timeout</div>
                      <div className="text-[10px] text-red-500">Auto-escalates to CPGRAMS</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onSimulateEvent('GOV_DELAY');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-amber-50 text-amber-800 font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold">Simulate Bank Delay (+7d)</div>
                      <div className="text-[10px] text-amber-600">Adds institutional notice</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onSimulateEvent('NEW_EVIDENCE');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium flex items-center space-x-2 transition-colors"
                  >
                    <FilePlus className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold">Ingest Bank Receipt</div>
                      <div className="text-[10px] text-blue-500">Dynamic evidence reload</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={onReset}
          disabled={isLoading}
          className="p-2 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg text-xs transition-all shadow-xs"
          title="Reset Case Simulation"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
