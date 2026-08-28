import React, { useState } from 'react';
import {
  Clock, RotateCcw, FastForward, Rewind
} from 'lucide-react';
import type { Case } from '../types';

interface FlightRecorderReplayProps {
  currentCase: Case;
}

export const FlightRecorderReplay: React.FC<FlightRecorderReplayProps> = ({
  currentCase,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';
  const [currentStepIndex, setCurrentStepIndex] = useState(7); // Default to latest step

  const steps = isDbt ? [
    {
      step: 1,
      title: "Scholarship Sanction Order Issued",
      validTime: "2026-01-10T10:00:00Z",
      systemTime: "2026-02-12T14:30:00Z",
      caseState: "CASE_CREATED",
      evidenceKnown: ["Scholarship_Sanction_Order.pdf"],
      activeHypothesis: "Beneficiary eligible for ₹48,000 Post-Matric Scholarship.",
      confidence: 1.0,
      availableAction: "Awaiting central treasury disbursement batch."
    },
    {
      step: 2,
      title: "Ahmedabad Cyber Crime Notice Issued (#CR-4412)",
      validTime: "2026-02-04T09:15:00Z",
      systemTime: "2026-02-12T14:30:00Z",
      caseState: "EVIDENCE_ANALYSIS",
      evidenceKnown: ["Scholarship_Sanction_Order.pdf", "Canara_Bank_Freeze_Notice.pdf"],
      activeHypothesis: "Sec 102 CrPC notice received by Canara Bank.",
      confidence: 0.94,
      availableAction: "Examine scope of police freeze directive."
    },
    {
      step: 3,
      title: "Canara Bank Places Debit Freeze & Inactivates APBS",
      validTime: "2026-02-05T11:00:00Z",
      systemTime: "2026-02-12T14:30:00Z",
      caseState: "EVIDENCE_ANALYSIS",
      evidenceKnown: ["Canara_Bank_Freeze_Notice.pdf", "NPCI_Mapper_Status.pdf"],
      activeHypothesis: "Canara Bank over-applied omnibus freeze and marked NPCI APBS INACTIVE.",
      confidence: 0.96,
      availableAction: "Evaluate secondary active bank accounts."
    },
    {
      step: 4,
      title: "Central PFMS Payment Batch Aborts (Error BNS-410)",
      validTime: "2026-02-12T14:30:00Z",
      systemTime: "2026-02-12T14:30:00Z",
      caseState: "ACTION_REQUIRED",
      evidenceKnown: ["PFMS_Failure_Report.pdf", "SBI_Active_Account_Statement.pdf"],
      activeHypothesis: "PFMS gateway rejected ₹48,000 disbursement under Rule BNS-410.",
      confidence: 0.99,
      availableAction: "Generate remedial APBS remapping petition to SBI."
    },
    {
      step: 5,
      title: "INDRA Reconstructs Root Cause & Synthesizes Petition",
      validTime: "2026-02-14T16:00:00Z",
      systemTime: "2026-02-14T16:00:00Z",
      caseState: "USER_APPROVAL",
      evidenceKnown: ["All 5 Source Records Ingested & Authenticated"],
      activeHypothesis: "Remapping APBS mandate to active SBI *8812 will satisfy Rule BNS-410.",
      confidence: 0.94,
      availableAction: "Request mandatory citizen authorization."
    },
    {
      step: 6,
      title: "Citizen Consent Authorized & Submitted to Gateway",
      validTime: "2026-02-15T10:00:00Z",
      systemTime: "2026-02-15T10:00:00Z",
      caseState: "WAITING",
      evidenceKnown: ["Citizen Digital Consent Capability Token Verified"],
      activeHypothesis: "Bank gateway processing statutory APBS mandate re-routing.",
      confidence: 0.94,
      availableAction: "Monitor 15-day statutory SLA window."
    },
    {
      step: 7,
      title: "+15D Statutory SLA Timeout & CPGRAMS Escalation",
      validTime: "2026-03-02T10:00:00Z",
      systemTime: "2026-03-02T10:00:00Z",
      caseState: "ESCALATION_REQUIRED",
      evidenceKnown: ["Gateway Non-Response Recorded Past 15d"],
      activeHypothesis: "Institutional delay breached statutory charter. CPGRAMS escalated.",
      confidence: 0.98,
      availableAction: "Execute grievance escalation & gateway re-ping."
    },
    {
      step: 8,
      title: "PFMS Disbursal Retry Verified & ₹48,000 Credited",
      validTime: "2026-03-03T11:00:00Z",
      systemTime: "2026-03-03T11:00:00Z",
      caseState: "RESOLUTION",
      evidenceKnown: ["PFMS Settlement Receipt (UTR: PFMS-UTR-34F5BBFFF2)"],
      activeHypothesis: "Benefit recovered. Causal chain fully resolved.",
      confidence: 1.0,
      availableAction: "Case closed with cryptographic resolution audit certificate."
    }
  ] : [
    {
      step: 1,
      title: "Member Relieving Order Issued",
      validTime: "2025-10-31T10:00:00Z",
      systemTime: "2026-01-20T10:00:00Z",
      caseState: "CASE_CREATED",
      evidenceKnown: ["Relieving_and_Experience_Letter.pdf"],
      activeHypothesis: "Service ended 31-Oct-2025.",
      confidence: 1.0,
      availableAction: "Submit Form 19."
    },
    {
      step: 2,
      title: "Employer ECR Return Upload Discrepancy",
      validTime: "2025-11-15T12:00:00Z",
      systemTime: "2026-01-20T10:00:00Z",
      caseState: "EVIDENCE_ANALYSIS",
      evidenceKnown: ["Employer_ECR_Filing_Extract.pdf"],
      activeHypothesis: "Exit date mismatch detected.",
      confidence: 0.98,
      availableAction: "Evaluate Joint Declaration path."
    },
    {
      step: 3,
      title: "Joint Declaration Rectification (EPFO SOP v3.0)",
      validTime: "2026-01-22T14:00:00Z",
      systemTime: "2026-01-22T14:00:00Z",
      caseState: "RESOLUTION",
      evidenceKnown: ["Joint Declaration Application Certified"],
      activeHypothesis: "Date of exit corrected. Claim approved.",
      confidence: 1.0,
      availableAction: "Disburse settlement."
    }
  ];

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 select-none font-sans">
      {/* Top Replay Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Clock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black tracking-tight text-white">
                BITEMPORAL FLIGHT RECORDER
              </h2>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40">
                HISTORICAL CASE REPLAY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scrub backwards through administrative history: Valid Time (real-world event) vs System Time (INDRA observation)
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-slate-300 transition-all cursor-pointer"
            title="Step Back"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all cursor-pointer"
            title="Jump to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-slate-300 transition-all cursor-pointer"
            title="Step Forward"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Time Scrubber Rail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>EVENT 1 of {steps.length}</span>
          <span className="font-bold text-indigo-400">STEP {currentStep.step}: {currentStep.title}</span>
          <span>EVENT {steps.length} of {steps.length}</span>
        </div>

        {/* Step Rail Dots */}
        <div className="grid grid-cols-8 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : idx < currentStepIndex
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[9px] font-mono opacity-70">STEP {s.step}</div>
              <div className="text-[11px] font-bold truncate mt-0.5">{s.title.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Deep Frame Snapshot Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Bitemporal Timestamp & Case State */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Bitemporal Frame Metadata
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-bold">1. Valid Time (World Date)</div>
              <div className="font-bold text-amber-400 text-xs">{currentStep.validTime.split('T')[0]}</div>
              <div className="text-[10px] text-slate-500">When event occurred in real world</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-bold">2. System Time (INDRA Date)</div>
              <div className="font-bold text-indigo-400 text-xs">{currentStep.systemTime.split('T')[0]}</div>
              <div className="text-[10px] text-slate-500">When INDRA ingested/observed fact</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Agent Lifecycle State</div>
            <div className="text-sm font-black font-mono text-emerald-400">{currentStep.caseState}</div>
          </div>
        </div>

        {/* Right: Known Intelligence at this Step */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            What INDRA Knew at This Exact Moment
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Active Working Hypothesis</div>
              <p className="text-slate-200 leading-snug">{currentStep.activeHypothesis}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Available Evidence Artifacts</div>
              <ul className="text-[11px] text-indigo-300 font-mono list-disc list-inside">
                {currentStep.evidenceKnown.map((doc, dIdx) => (
                  <li key={dIdx} className="truncate">{doc}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Permitted Action at this Step</div>
              <p className="text-slate-300 leading-snug">{currentStep.availableAction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
