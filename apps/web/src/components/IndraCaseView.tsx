import React, { useState } from 'react';
import {
  FileText, CheckCircle2,
  Clock, ArrowRight, Sparkles,
  Award, ChevronDown
} from 'lucide-react';
import type { Case, CaseDocument } from '../types';
import { ConsentSlider } from './ConsentSlider';

interface IndraCaseViewProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onAdvanceTime: (days: number) => void;
  onReset: () => void;
  onOpenDocument: (doc: CaseDocument) => void;
  onOpenPetition: () => void;
  onOpenCertificate: () => void;
  isLoading: boolean;
}

export const IndraCaseView: React.FC<IndraCaseViewProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onAdvanceTime,
  onReset,
  onOpenDocument,
  onOpenPetition,
  onOpenCertificate,
  isLoading,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);

  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING';
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  const handleAuthorize = () => {
    if (currentAction) {
      onGrantConsent(currentAction.id, true);
      onSubmitAction(currentAction.id);
    }
  };

  const handleInstantFix = () => {
    if (currentAction && !currentAction.citizen_consent) {
      onGrantConsent(currentAction.id, true);
      onSubmitAction(currentAction.id);
    }
    setTimeout(() => {
      onResolveChain();
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8 font-sans select-none text-slate-900">
      {/* ============================================================ */}
      {/* 1. CASE HEADER (Spacious & Clean)                            */}
      {/* ============================================================ */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>{isDbt ? 'DBT Scholarship Recovery' : 'EPFO Claim Resolution'}</span>
          <span className="text-slate-300">•</span>
          <span>Beneficiary: {currentCase.citizen_name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          {isDbt ? '₹48,000.00 Payment Blocked' : '₹3,12,000.00 Claim Blocked'}
        </h1>

        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          {isDbt
            ? 'Your scholarship disbursal was halted by an upstream bank restriction. INDRA has diagnosed the root cause and prepared the statutory fix.'
            : 'Your PF claim was rejected due to an exit date discrepancy between your employer and portal records.'}
        </p>
      </div>

      {/* ============================================================ */}
      {/* 2. THE DIAGNOSIS & REMEDY CARD (Low Density, High Impact)    */}
      {/* ============================================================ */}
      {!isWaiting && !isEscalated && !isResolved && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Two Clean Explanation Blocks */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* What Happened */}
            <div className="p-6 bg-rose-50/50 border border-rose-200/60 rounded-2xl space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>What Happened</span>
              </div>
              <p className="text-sm text-rose-950 font-medium leading-relaxed">
                {isDbt
                  ? 'Canara Bank placed a temporary cyber freeze on account *4401 under Section 102 CrPC, deactivating your central payment link (PFMS Error BNS-410).'
                  : 'Employer entered an exit date (15/11/2025) conflicting with your relieving letter (31/10/2025).'}
              </p>
            </div>

            {/* How INDRA Fixes It */}
            <div className="p-6 bg-emerald-50/50 border border-emerald-200/60 rounded-2xl space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>How INDRA Fixes It</span>
              </div>
              <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                {isDbt
                  ? 'INDRA automatically re-seeds your Aadhaar payment bridge to your active State Bank of India account (*8812) using binding RBI rules.'
                  : 'INDRA generates a statutory Joint Declaration to correct the exit date without delay.'}
              </p>
            </div>
          </div>

          {/* Collapsible Evidence Row */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              <span>Inspect Grounded Evidence & Legal Precedents ({currentCase.documents?.length || 4} Files)</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showEvidence ? 'rotate-180' : ''}`} />
            </button>

            {showEvidence && (
              <div className="grid sm:grid-cols-2 gap-2.5 pt-3 animate-in fade-in-50 duration-150">
                {(currentCase.documents || []).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => onOpenDocument(doc)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-bold text-slate-800 truncate">{doc.filename}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">100% OCR</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Console */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
              Authorize INDRA to Transmit Statutory Directive:
            </div>

            {/* Tactile Drag Slider */}
            {currentAction && (
              <ConsentSlider
                actionTitle={currentAction.purpose}
                targetAuthority={currentAction.target_institution}
                legalBasis={currentAction.legal_basis || 'Procedural Directive'}
                isAuthorized={currentAction.citizen_consent}
                disabled={isLoading}
                onAuthorize={handleAuthorize}
              />
            )}

            {/* Instant 1-Click Fix Button */}
            <button
              onClick={handleInstantFix}
              disabled={isLoading}
              className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1-Click: Fix Problem & Receive {isDbt ? '₹48,000.00' : 'PF Settlement'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                onClick={onOpenPetition}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer inline-flex items-center space-x-1"
              >
                <span>Inspect Drafted Legal Memorandum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SENTINEL MONITORING (Spacious & Clean)                     */}
      {/* ============================================================ */}
      {(isWaiting || isEscalated) && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8 text-center">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <div className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full ${
              isEscalated ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {isEscalated ? 'STATUTORY SLA EXPIRED • ESCALATED TO CPGRAMS' : 'SENTINEL ACTIVE • MONITORING BANK PORTAL'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {isEscalated
                ? 'Statutory Deadline Breached • Case Escalated'
                : 'Representation Dispatched to Bank'}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {isEscalated
                ? 'Canara Bank did not process the APBS update within 15 days. INDRA filed an automated escalation to CPGRAMS.'
                : 'INDRA is monitoring institutional compliance under the 15-day statutory SLA window.'}
            </p>
          </div>

          {/* SLA Timeline Bar */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 max-w-md mx-auto text-left">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Statutory Compliance Timeline</span>
              <span className="font-mono font-black">{currentCase.simulated_day || 1} of 15 Days</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isEscalated ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(100, ((currentCase.simulated_day || 1) / 15) * 100)}%` }}
              />
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={() => onAdvanceTime(15)}
              className="py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              Fast-Forward +15 Days (Test SLA)
            </button>

            <button
              onClick={onResolveChain}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-xs transition-all cursor-pointer"
            >
              Simulate Bank Approving Fix
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. RESOLUTION RESTORED (Joyful & Pristine)                    */}
      {/* ============================================================ */}
      {isResolved && (
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3.5 py-1 rounded-full border border-emerald-200">
              ADMINISTRATIVE CERTAINTY RESTORED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
              {isDbt ? '₹48,000.00 Successfully Credited!' : 'PF Claim Approved & Settled!'}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              The central government treasury has completed disbursal to your active State Bank of India account.
            </p>
          </div>

          {/* Official Treasury Receipt */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 max-w-md mx-auto text-left font-mono text-xs text-slate-800">
            <div className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
              Official Treasury Confirmation
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500 font-sans">UTR Reference:</span>
              <strong className="text-slate-950 font-bold">PFMS-UTR-34F5BBFFF2</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500 font-sans">Credited Account:</span>
              <strong>State Bank of India (*8812)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Disbursal Status:</span>
              <strong className="text-emerald-700 font-bold">COMPLETED & VERIFIED</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={onOpenCertificate}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Official Certificate</span>
            </button>

            <button
              onClick={onReset}
              className="py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs border border-slate-200 transition-all cursor-pointer"
            >
              Reset Demo (Day 0)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
