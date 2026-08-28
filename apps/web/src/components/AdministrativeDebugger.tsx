import React, { useState } from 'react';
import {
  Bug, CheckCircle2, AlertTriangle, Terminal, Clock
} from 'lucide-react';
import type { Case } from '../types';

interface AdministrativeDebuggerProps {
  currentCase: Case;
}

export const AdministrativeDebugger: React.FC<AdministrativeDebuggerProps> = ({
  currentCase,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const [activeTab, setActiveTab] = useState<'stack' | 'preconditions' | 'twin' | 'logs'>('stack');

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 select-none font-mono text-xs">
      {/* Top Banner: DevTools for Bureaucracy */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Bug className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black tracking-tight text-white font-sans">
                ADMINISTRATIVE DEBUGGER
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                DEVTOOLS FOR BUREAUCRACY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Forensic failure inspection, precondition trace, and administrative digital twin simulation
            </p>
          </div>
        </div>

        {/* Quick Inspector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'stack' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Causal Call Stack
          </button>
          <button
            onClick={() => setActiveTab('preconditions')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'preconditions' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Policy Preconditions
          </button>
          <button
            onClick={() => setActiveTab('twin')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'twin' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Digital Twin State
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telemetry Logs
          </button>
        </div>
      </div>

      {/* Main Debugger Body */}
      {activeTab === 'stack' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>UNCAUGHT ADMINISTRATIVE EXCEPTION: {isDbt ? 'RULE_BNS_410_PAYMENT_ABORT' : 'RULE_EPF_R09_EXIT_MISMATCH'}</span>
              </div>
              <span className="text-[10px] text-slate-500">Originating Frame: Central Gateway Routing</span>
            </div>

            {/* Causal Call Stack Frames */}
            <div className="space-y-2 pt-1">
              {isDbt ? (
                <>
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 0: Failure Point] PFMS.DisbursementPipeline.ExecuteBatch()</span>
                      <span className="text-red-400">ERROR BNS-410</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Destination mapper state returned INACTIVE during settlement execution.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 1: Dependency] NPCI.APBSMapper.QueryAadhaar(*8821)</span>
                      <span className="text-amber-400">STATUS = INACTIVE</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Canara Bank flagged operational mapper as inactive due to upstream debit freeze.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 2: Bank Action] CanaraBank.CoreBanking.ApplyDebitFreeze(*4401)</span>
                      <span className="text-slate-400">STATUS = OMNIBUS_FREEZE</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Bank over-applied total debit restriction instead of disputed amount lien.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 3: Root Requisition] AhmedabadCyberCell.Sec102CrPC.IssueNotice()</span>
                      <span className="text-indigo-400">DOCKET #CR-4412/2026</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Police notice issued on mule account layered transaction chain.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 0: Failure Point] EPFO.ClaimSettlement.ValidateForm19()</span>
                      <span className="text-red-400">ERROR EPF-R09</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Automated exit date validation failed against employer ECR database.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">[Frame 1: Data Discrepancy] TechSys.Payroll.ECRReturnUpload()</span>
                      <span className="text-amber-400">EXIT_DATE = 2025-11-15</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Clerical 15-day offset during monthly bulk filing contradicted relieving letter (2025-10-31).
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Preconditions */}
      {activeTab === 'preconditions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Statutory Precondition Evaluation Gate</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Evaluating prerequisite rules for successful ₹48,000 central treasury disbursement
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">1. Citizen Scheme Eligibility & Sanction Order Validated</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">MET (AY 2025-26)</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">2. Active KYC-Compliant Bank Account Present (SBI *8812)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">MET (UNENCUMBERED)</span>
            </div>

            <div className={`p-3 rounded-xl flex items-center justify-between ${
              isResolved ? 'bg-emerald-950/30 border border-emerald-800/50' : 'bg-red-950/30 border border-red-800/50'
            }`}>
              <div className="flex items-center space-x-2.5">
                {isResolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                <span className="text-slate-200">3. NPCI Central APBS Mapper Status == ACTIVE</span>
              </div>
              <span className={`text-[10px] font-bold ${isResolved ? 'text-emerald-400' : 'text-red-400'}`}>
                {isResolved ? 'MET (REMAPPED TO SBI)' : 'FAILED (CANARA INACTIVE)'}
              </span>
            </div>

            <div className={`p-3 rounded-xl flex items-center justify-between ${
              isResolved ? 'bg-emerald-950/30 border border-emerald-800/50' : 'bg-amber-950/30 border border-amber-800/50'
            }`}>
              <div className="flex items-center space-x-2.5">
                {isResolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                <span className="text-slate-200">4. Central PFMS Payment Retry Executed & Acknowledged</span>
              </div>
              <span className={`text-[10px] font-bold ${isResolved ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isResolved ? 'MET (UTR GENERATED)' : 'PENDING REMEDY EXECUTION'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Digital Twin State */}
      {activeTab === 'twin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Administrative Digital Twin Topology</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Simulated state representation of cross-departmental administrative entities
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
              SIMULATION ENGINE ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Entity: Canara Bank (*4401)</div>
              <div className="text-slate-200">Account Operational Status: <strong className="text-red-400">DEBIT_FROZEN</strong></div>
              <div className="text-slate-200">Mapper Flag: <strong className="text-red-400">INACTIVE</strong></div>
              <div className="text-slate-400 text-[11px]">Trigger: Cyber Requisition #CR-4412</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Entity: State Bank of India (*8812)</div>
              <div className="text-slate-200">Account Operational Status: <strong className="text-emerald-400">ACTIVE_UNENCUMBERED</strong></div>
              <div className="text-slate-200">APBS Ready: <strong className="text-emerald-400">YES (100% KYC MATCH)</strong></div>
              <div className="text-slate-400 text-[11px]">Designated Target for Remapping</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Entity: NPCI APBS Gateway</div>
              <div className="text-slate-200">Active Routing: <strong className={isResolved ? "text-emerald-400" : "text-amber-400"}>{isResolved ? "State Bank of India (*8812)" : "Canara Bank (*4401 - INACTIVE)"}</strong></div>
              <div className="text-slate-400 text-[11px]">SLA Response: 0ms (Simulated Gateway)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Entity: PFMS Central Treasury</div>
              <div className="text-slate-200">Batch State: <strong className={isResolved ? "text-emerald-400" : "text-red-400"}>{isResolved ? "CREDITED_SUCCESS" : "REJECTED (BNS-410)"}</strong></div>
              <div className="text-slate-400 text-[11px]">UTR Settlement: {isResolved ? "#PFMS-UTR-34F5BBFFF2" : "Awaiting retry"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Telemetry Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>INDRA CORE RUNTIME TELEMETRY</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Real-time event stream</span>
          </div>

          <div className="p-4 bg-black rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-emerald-400/90 font-mono overflow-y-auto max-h-72">
            <div>[2026-02-12T14:30:00Z] INGEST: Ingested PFMS_Failure_Report.pdf (SHA256:88f921...)</div>
            <div>[2026-02-12T14:30:01Z] EXTRACT: Extracted Error Code BNS-410 with confidence 0.99</div>
            <div>[2026-02-12T14:30:02Z] GRAPH: Attached node-pfms-rejection to Case Graph</div>
            <div>[2026-02-12T14:30:03Z] INGEST: Ingested Canara_Bank_Freeze_Notice.pdf</div>
            <div>[2026-02-12T14:30:04Z] REASON: Detected causal conduit PoliceNotice -&gt; CanaraFreeze -&gt; NPCI_Inactive -&gt; BNS-410</div>
            <div>[2026-02-12T14:30:05Z] CAH: Evaluated 3 candidate interventions with ERU scoring. Recommended: APBS_REMAP_SBI (0.94)</div>
            <div>[2026-02-12T14:30:06Z] GUARDRAIL: Validated policy DPSS.CO.PD.No.1810. State: USER_APPROVAL</div>
            {isResolved && (
              <>
                <div>[2026-03-03T11:00:00Z] ACTION_EXEC: Representation submitted to Bank Gateway</div>
                <div>[2026-03-03T11:00:01Z] GATEWAY_RETRY: PFMS disbursement retry executed. Status: 200 OK</div>
                <div>[2026-03-03T11:00:02Z] SETTLEMENT: UTR #PFMS-UTR-34F5BBFFF2 verified. Benefit credited ₹48,000</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
