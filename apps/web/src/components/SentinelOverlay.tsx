import React from 'react';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import type { Case } from '../types';

interface SentinelOverlayProps {
  currentCase: Case;
  onAdvanceTime: (days: number) => void;
  onSimulateResponse?: () => void;
}

export const SentinelOverlay: React.FC<SentinelOverlayProps> = ({
  currentCase,
  onAdvanceTime,
  onSimulateResponse,
}) => {
  const simulatedDay = currentCase.simulated_day || 1;
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const slaMaxDays = 15;
  const daysRemaining = Math.max(0, slaMaxDays - simulatedDay);

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-slate-50/95 border-2 border-slate-300 rounded-3xl p-8 shadow-lg space-y-6 select-none font-sans"
      role="region"
      aria-label="Sentinel Temporal Observation State"
    >
      {/* 1. Radar Pulse & Sentinel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Active Radar Pulse Animation */}
          <div className="relative flex items-center justify-center w-12 h-12">
            <span className={`absolute w-12 h-12 rounded-full opacity-30 ${isEscalated ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-ping'}`} />
            <span className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              isEscalated
                ? 'bg-red-600 border-red-700 text-white'
                : 'bg-blue-600 border-blue-700 text-white'
            }`}>
              {isEscalated ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                isEscalated
                  ? 'bg-red-100 text-red-900 border-red-300'
                  : 'bg-blue-100 text-blue-900 border-blue-300'
              }`}>
                {isEscalated ? 'STATUTORY SLA BREACH DETECTED' : 'SENTINEL ASYNCHRONOUS OBSERVATION'}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                DAY {simulatedDay} OF {slaMaxDays}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              {isEscalated
                ? 'Statutory 15-Day Inaction Threshold Exceeded • Automatic CPGRAMS Escalation Active'
                : 'Observing Institutional Compliance & Payment Gateway Synchronization'}
            </h3>
          </div>
        </div>

        {/* SLA Status Pill */}
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase">SLA Window</div>
          <div className={`text-lg font-mono font-black ${daysRemaining === 0 ? 'text-red-600' : 'text-slate-800'}`}>
            {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : 'EXPIRED (ESCALATED)'}
          </div>
        </div>
      </div>

      {/* 2. Sentinel Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Day 0: Submission Dispatched</span>
          <span>Day 15: Statutory SLA Deadline</span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEscalated ? 'bg-red-600' : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, (simulatedDay / slaMaxDays) * 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Operational Log & Escalation Detail */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
          Sentinel Diagnostic Telemetry
        </div>
        <p className="leading-relaxed">
          {isEscalated
            ? 'Canara Bank nodal branch did not respond within statutory 15 business days. INDRA autonomous core has activated Rule RULE_DBT_PFMS_DISBURSAL_ESCALATION, filing an administrative grievance with the Department of Financial Services (CPGRAMS).'
            : 'Statutory memorandum transmitted to Canara Bank nodal branch and State Bank of India. Sentinel listener is polling central PFMS payment batch queues for APBS status synchronization.'}
        </p>
      </div>

      {/* 4. Temporal Simulation Controls */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-slate-500 font-medium">
          Simulate Institutional Timeline:
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAdvanceTime(5)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Fast Forward +5 Days
          </button>
          <button
            onClick={() => onAdvanceTime(15)}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Fast Forward +15 Days (Trigger SLA Escalation)
          </button>
          {onSimulateResponse && (
            <button
              onClick={onSimulateResponse}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Bank Resolution</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
