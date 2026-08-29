import React from 'react';
import {
  Landmark, Users, AlertTriangle, Clock,
  Shield, CheckCircle2, FileText,
  Sparkles, Award, Scale, Eye
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
  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING';
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  const handleAuthorizeAndSubmit = () => {
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
    <div className="max-w-[1440px] mx-auto w-full p-4 sm:p-8 lg:p-10 space-y-8 font-sans select-none">
      {/* ============================================================ */}
      {/* 1. CASE HEADER BANNER                                         */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isDbt ? 'bg-blue-50 border border-blue-100 text-blue-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
          }`}>
            {isDbt ? <Landmark className="w-7 h-7" /> : <Users className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isDbt ? 'DBT / PFMS SCHOLARSHIP WORKSPACE' : 'EPFO MEMBER CLAIM WORKSPACE'}
              </span>
              <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {currentCase.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1">
              {isDbt ? 'DBT Scholarship – ₹48,000 Payment Failure' : 'EPFO Claim – Date of Exit Mismatch'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Beneficiary: <strong className="text-slate-900 font-bold">{currentCase.citizen_name}</strong> • Entitlement: <strong className="text-slate-900 font-mono font-bold">{isDbt ? '₹48,000.00' : '₹3,12,000.00'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPetition}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Inspect Prepared Petition</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN 2-COLUMN WORKSPACE (8 cols left, 4 cols right)        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* ========================================================== */}
        {/* LEFT COLUMN: DIAGNOSIS, CAUSAL CHAIN & ACTION CONSOLE      */}
        {/* ========================================================== */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Action Ready / Diagnostic Card */}
          {!isWaiting && !isEscalated && !isResolved && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Badge & Target */}
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wide flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Action Required • 1 Step to Resolve</span>
                </span>

                <span className="text-xs font-mono font-bold text-slate-400">
                  Target: <strong className="text-slate-800">{isDbt ? 'Canara Bank & NPCI Mapper' : 'EPFO Field Office'}</strong>
                </span>
              </div>

              {/* Main Headline */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {isDbt
                    ? 'Your ₹48,000 Scholarship is Blocked in the Banking Gateway'
                    : 'Your PF Claim was Blocked Due to an Exit Date Conflict'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  INDRA ingested all bank records and government notices, discovering the exact systemic root cause.
                </p>

                {/* The Two Diagnostic Comparison Pillars */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {/* Pillar 1: Factual Matrix (Institutional Amber) */}
                  <div className="p-5 bg-white border border-amber-200/80 rounded-2xl space-y-2.5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      <span>1. Factual Matrix</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed font-serif">
                      {isDbt
                        ? 'Canara Bank placed a temporary lien on account *4401 under Section 102 CrPC, which caused the central PFMS portal to fail with Error BNS-410.'
                        : 'Your employer entered an exit date (15/11/2025) that contradicts your official relieving letter (31/10/2025), triggering Rule EPF-R09.'}
                    </p>
                    <div className="text-[10px] font-mono text-amber-900/80 bg-amber-50/60 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center justify-between">
                      <span>Source: {isDbt ? 'PFMS_Failure_Report.pdf' : 'Relieving_Letter.pdf'}</span>
                      <span className="font-bold">100% OCR</span>
                    </div>
                  </div>

                  {/* Pillar 2: Statutory Remedy (Institutional Blue) */}
                  <div className="p-5 bg-white border border-blue-200/80 rounded-2xl space-y-2.5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                    <div className="text-[11px] font-black uppercase tracking-wider text-blue-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>2. Statutory Remedy</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed font-serif">
                      {isDbt
                        ? 'INDRA automatically re-links your Aadhaar APBS payment bridge to your active State Bank of India account (*8812) using binding RBI rules.'
                        : 'INDRA will automatically transmit a Joint Declaration Form (JDF) under Para 3.2 of the EPS Scheme to correct the exit date anomaly.'}
                    </p>
                    <div className="text-[10px] font-mono text-blue-900/80 bg-blue-50/60 px-2.5 py-1 rounded-md border border-blue-200/60 flex items-center justify-between">
                      <span>Basis: {isDbt ? 'Gujarat HC Precedent R/SCR.A/1908/2023' : 'EPS Scheme Para 3.2'}</span>
                      <span className="font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Interactive Causal Chain */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Administrative Causal Chain (Click to Inspect Source Document)
                </div>
                <div className="grid sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => onOpenDocument(currentCase.documents?.[2] || currentCase.documents?.[0] as any)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Step 1</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Police Sec 102 Notice</div>
                    <div className="text-[10px] text-slate-500">Canara Bank lien</div>
                  </button>

                  <button
                    onClick={() => onOpenDocument(currentCase.documents?.[1] || currentCase.documents?.[0] as any)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Step 2</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">NPCI Mapper Inactive</div>
                    <div className="text-[10px] text-slate-500">Aadhaar link severed</div>
                  </button>

                  <button
                    onClick={() => onOpenDocument(currentCase.documents?.[1] || currentCase.documents?.[0] as any)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Step 3</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">PFMS Error BNS-410</div>
                    <div className="text-[10px] text-slate-500">Gateway rejected</div>
                  </button>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
                    <div className="text-[9px] font-bold text-emerald-700 uppercase">Step 4</div>
                    <div className="text-xs font-bold text-emerald-950 mt-0.5">Re-Seed to SBI *8812</div>
                    <div className="text-[10px] text-emerald-700">Remedy ready</div>
                  </div>
                </div>
              </div>

              {/* Action Authorization Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                  Authorize INDRA to Transmit Rectification:
                </div>

                {/* Tactile Drag-to-Authorize Slider */}
                {currentAction && (
                  <ConsentSlider
                    actionTitle={currentAction.purpose}
                    targetAuthority={currentAction.target_institution}
                    legalBasis={currentAction.legal_basis || 'Procedural Directive'}
                    isAuthorized={currentAction.citizen_consent}
                    disabled={isLoading}
                    onAuthorize={handleAuthorizeAndSubmit}
                  />
                )}

                {/* Fast 1-Click Fix Button */}
                <button
                  onClick={handleInstantFix}
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>1-Click: Fix Problem & Receive {isDbt ? '₹48,000.00' : 'PF Settlement'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Waiting / Sentinel Radar State */}
          {(isWaiting || isEscalated) && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs space-y-6 text-center">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full ${
                  isEscalated ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {isEscalated ? 'STATUTORY SLA EXPIRED • AUTO-ESCALATED TO CPGRAMS' : 'SENTINEL MODE ACTIVE • MONITORING BANK PORTAL'}
                </span>

                <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2.5">
                  {isEscalated
                    ? 'Statutory Deadline Breached • Case Escalated to Oversight'
                    : 'Your Fix Has Been Transmitted to the Bank'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                  {isEscalated
                    ? 'Because Canara Bank did not clear the APBS restriction within the 15-day statutory window, INDRA filed an automated escalation to CPGRAMS.'
                    : 'INDRA is actively monitoring institutional compliance. Under RBI Master Directions, the bank is bound to clear the update within 15 days.'}
                </p>
              </div>

              {/* SLA Timeline Bar */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 max-w-md mx-auto text-left">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Statutory SLA Timeline</span>
                  <span className="font-mono font-black">{currentCase.simulated_day || 1} of 15 Days</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
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

          {/* Resolution Restored State */}
          {isResolved && (
            <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 shadow-sm space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  ADMINISTRATIVE CERTAINTY RESTORED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2.5">
                  {isDbt ? '₹48,000.00 Successfully Credited!' : 'PF Claim Approved & Settled!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                  The central government treasury has completed disbursal to your active State Bank of India account.
                </p>
              </div>

              {/* Official Treasury Receipt */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 max-w-md mx-auto text-left font-mono text-xs text-slate-800">
                <div className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  Official Treasury Confirmation
                </div>
                <div>UTR Ref: <strong className="text-slate-900">PFMS-UTR-34F5BBFFF2</strong></div>
                <div>Account: <strong>State Bank of India (*8812)</strong></div>
                <div>Disbursal Status: <strong className="text-emerald-700 font-bold">COMPLETED & VERIFIED</strong></div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={onOpenCertificate}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate</span>
                </button>

                <button
                  onClick={onReset}
                  className="py-3 px-5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs border border-slate-200 transition-all cursor-pointer"
                >
                  Reset Demo (Day 0)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* RIGHT SIDEBAR: INSTITUTIONS, DOCUMENTS & PRECEDENTS        */}
        {/* ========================================================== */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Target Authorities */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Target Authorities</h3>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {isDbt ? '2 NODAL PORTALS' : 'EPFO PORTAL'}
              </span>
            </div>

            <div className="space-y-3">
              {isDbt ? (
                <>
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Landmark className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Canara Bank Lead Branch</div>
                      <div className="text-[11px] text-slate-500">APBS Aadhaar Seeding Nodal Desk</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Shield className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">PFMS Treasury Gateway</div>
                      <div className="text-[11px] text-slate-500">Disbursal Scheme BT-99120</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Users className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">EPFO Field Office</div>
                    <div className="text-[11px] text-slate-500">Member Master Settlement Desk</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grounded Evidence Vault */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Grounded Evidence Vault</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% OCR
              </span>
            </div>

            <div className="space-y-2.5">
              {(currentCase.documents || []).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 text-xs flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{doc.filename}</div>
                      <div className="text-[10px] text-slate-400">{doc.extractions_count} grounded facts extracted</div>
                    </div>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Statutory Precedent */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Binding Legal Authority</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Gujarat HC (R/SCR.A/1908/2023) & RBI Master Direction DPSS.CO.PD.No.1810 hold that omnibus account freezes cannot obstruct central welfare disbursals.
            </p>
          </div>

          {/* Privacy Guarantee */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="text-[11px] text-slate-500">
                Citizen consent verified under DPDPA 2023.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
