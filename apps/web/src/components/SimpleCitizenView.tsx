import React, { useState } from 'react';
import {
  FileText, Landmark, AlertTriangle, Clock,
  Shield, CheckCircle2, Users, Sliders,
  Volume2, VolumeX, Sparkles, Award
} from 'lucide-react';
import type { Case, Node as GraphNode } from '../types';
import { ConsentSlider } from './ConsentSlider';

interface SimpleCitizenViewProps {
  currentCase: Case;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onAdvanceTime: (days: number) => void;
  onOpenWhy?: (node: GraphNode) => void;
  onOpenAdvancedStudio: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const SimpleCitizenView: React.FC<SimpleCitizenViewProps> = ({
  currentCase,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onAdvanceTime,
  onOpenWhy,
  onOpenAdvancedStudio,
  onReset,
  isLoading,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPetitionModal, setShowPetitionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING';
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  // Web Speech API voice readout
  const toggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = isResolved
        ? `Great news! Your case is completely resolved. The ${isDbt ? '48,000 rupee scholarship' : 'provident fund claim'} has been successfully credited to your account.`
        : isWaiting
        ? `INDRA is now monitoring the bank for compliance. The official statutory deadline is 15 business days.`
        : `Hello ${currentCase.citizen_name}. Your ${isDbt ? '48,000 rupee scholarship' : 'PF claim'} was delayed because of an upstream bank restriction. INDRA can fix this in one step by re-linking your active account. Please slide or click the button below to authorize.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

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
    <div className="w-full h-full bg-[#FAFAFA] overflow-y-auto font-sans select-none flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* ============================================================ */}
        {/* CASE HEADER BANNER                                           */}
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
                  Case ID: {isDbt ? 'DBT-2025-0487' : 'EPFO-2025-0123'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {isDbt ? 'DBT Scholarship – ₹48,000 Payment Failure' : 'EPFO Claim – Date of Exit Mismatch'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Beneficiary: <strong className="text-slate-800 font-bold">{currentCase.citizen_name}</strong> • Entitlement: <strong className="text-slate-900 font-mono">{isDbt ? '₹48,000.00' : '₹3,12,000.00'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Audio Voice Briefing Button */}
            <button
              onClick={toggleVoice}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs ${
                isPlayingAudio
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Listen to Voice Briefing'}</span>
            </button>

            {/* Switch to Technical Hypervisor Studio */}
            <button
              onClick={onOpenAdvancedStudio}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Hypervisor Studio</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2-COLUMN MAIN WORKSPACE GRID (8 cols left, 4 cols right)     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* ========================================================== */}
          {/* LEFT MAIN COLUMN: DIAGNOSTIC CARD & ACTION CONSOLE         */}
          {/* ========================================================== */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* 1. Before Submission / Action Ready State */}
            {!isWaiting && !isEscalated && !isResolved && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                {/* Badge Row */}
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
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {isDbt
                      ? 'Your ₹48,000 Scholarship is Blocked in the Banking Gateway'
                      : 'Your PF Claim was Blocked Due to an Exit Date Conflict'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    INDRA ingested all bank statements and government notices, identifying the precise systemic root cause.
                  </p>
                </div>

                {/* The 2 Diagnostic Comparison Pillars */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Pillar 1: What Happened */}
                  <div className="p-5 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-2.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      <span>1. What Happened</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                      {isDbt
                        ? 'Canara Bank placed a temporary lien on account *4401 under Section 102 CrPC, which caused the central PFMS portal to fail with Error BNS-410.'
                        : 'Your employer entered an exit date (15/11/2025) that contradicts your official relieving letter (31/10/2025), triggering Rule EPF-R09.'}
                    </p>
                    <div className="text-[10px] font-mono text-rose-800/80 bg-rose-100/60 px-2.5 py-1 rounded-md border border-rose-200/60 flex items-center justify-between">
                      <span>Source: {isDbt ? 'PFMS_Failure_Report.pdf' : 'Relieving_Letter.pdf'}</span>
                      <span className="font-bold">100% OCR</span>
                    </div>
                  </div>

                  {/* Pillar 2: How INDRA Fixes It */}
                  <div className="p-5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>2. How INDRA Fixes It</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                      {isDbt
                        ? 'INDRA automatically re-links your Aadhaar APBS payment bridge to your active State Bank of India account (*8812) using binding RBI rules.'
                        : 'INDRA generates a statutory Joint Declaration SOP v3.0 to rectify the exit date conflict with zero penalty.'}
                    </p>
                    <div className="text-[10px] font-mono text-emerald-800/80 bg-emerald-100/60 px-2.5 py-1 rounded-md border border-emerald-200/60 flex items-center justify-between">
                      <span>Basis: {isDbt ? 'Gujarat HC Precedent R/SCR.A/1908/2023' : 'EPFO SOP v3.0'}</span>
                      <span className="font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Authorization & Action Section */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                    Authorize INDRA to Transmit Rectification:
                  </div>

                  {/* Drag-to-Authorize Slider */}
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

                {/* Inspect Legal Petition link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setShowPetitionModal(true)}
                    className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inspect Prepared Legal Petition Dossier</span>
                  </button>

                  {onOpenWhy && (
                    <button
                      onClick={() => {
                        onOpenWhy({
                          id: 'node-root-cause',
                          label: isDbt ? 'Upstream Police Restriction Cascade' : 'Exit Date Discrepancy Conflict',
                          type: 'DEPENDENCY',
                          attributes: {},
                          epistemic_category: 'INFERENCE',
                          status: 'VERIFIED',
                          confidence: 0.98,
                        });
                      }}
                      className="text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                    >
                      Inspect OCR Bounding Boxes (Why?) →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2. Waiting / Sentinel Radar State */}
            {(isWaiting || isEscalated) && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs space-y-6 text-center">
                {/* Concentric Radar Ring */}
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

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
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

            {/* 3. Resolution / Certainty Restored State */}
            {isResolved && (
              <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 shadow-sm space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                    ADMINISTRATIVE CERTAINTY RESTORED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5">
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
                    onClick={() => setShowCertificateModal(true)}
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
          {/* RIGHT SIDEBAR: CASE METADATA, FACTS & INSTITUTIONS         */}
          {/* ========================================================== */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* 1. Target Authority Card */}
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

            {/* 2. Confirmed Facts List */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Extracted Facts</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  100% OCR
                </span>
              </div>

              <div className="space-y-2.5">
                {(currentCase.facts_summary || []).slice(0, 4).map((f, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>Fact #{i + 1}</span>
                      <span className="text-emerald-700">OCR VERIFIED</span>
                    </div>
                    <div className="text-slate-800 font-semibold mt-0.5">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Privacy Assurance Banner */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="text-[11px] text-slate-500">
                  Citizen consent token verified under DPDPA 2023.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULL-WIDTH FOOTER                                            */}
      {/* ============================================================ */}
      <footer className="w-full h-12 bg-white border-t border-slate-200/90 px-6 sm:px-10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div>INDRA v1.0.0 &nbsp;|&nbsp; Persistent Administrative Intelligence</div>
        <div>Built for citizens. By citizens.</div>
      </footer>

      {/* ============================================================ */}
      {/* MODALS: Legal Petition & Resolution Certificate              */}
      {/* ============================================================ */}
      {showPetitionModal && currentAction && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900">
                Prepared Administrative Petition Dossier
              </h3>
              <button
                onClick={() => setShowPetitionModal(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {(currentAction as any).generated_letter || `MEMORANDUM OF ADMINISTRATIVE REQUISITION

TO: Nodal Officer, Canara Bank Lead Branch & NPCI APBS Division
SUBJECT: Urgent Rectification of APBS Aadhaar Seeding & Release of Unlawful Welfare Blockade

RESPECTED SIR/MADAM,

This statutory representation is submitted on behalf of the beneficiary ${currentCase.citizen_name}, who is entitled to Post-Matric Scholarship funds amounting to Rs. 48,000/- sanctioned under Central Welfare Scheme BT-99120.

It is evidenced that an omnibus debit freeze was placed on Canara Bank Account *4401 under Section 102 CrPC. In accordance with the binding ruling of the Hon'ble High Court of Gujarat (R/SCR.A/1908/2023) and RBI Master Direction DPSS.CO.PD.No.1810/02.14.006/2015-16, an account freeze cannot impede lawful statutory welfare credits.

WE DEMAND:
1. Immediate severance of the inactive NPCI APBS mapping to restricted Account *4401.
2. Re-seeding of the Aadhaar APBS bridge to the citizen's active, operational State Bank of India Account (*8812).
3. Transmission of clearance confirmation to the PFMS Central Treasury Gateway within the statutory 15-day SLA window.

DATED: ${new Date().toLocaleDateString()}
AUTHORIZED BY CITIZEN: YES (Sovereign Consent Token Verified)`}
            </div>
          </div>
        </div>
      )}

      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <Award className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              OFFICIAL ADMINISTRATIVE RESOLUTION CERTIFICATE
            </h3>
            <p className="text-xs text-slate-600">
              Issued under the National Sovereign Administrative Hypervisor Protocol. All systemic impediments have been formally resolved with 100% legal certainty.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left font-mono text-xs space-y-1.5 text-slate-800">
              <div>Case ID: <span className="font-bold">{currentCase.id}</span></div>
              <div>Citizen: <span className="font-bold">{currentCase.citizen_name}</span></div>
              <div>Entitlement Recovered: <span className="font-bold text-emerald-700">₹48,000.00</span></div>
              <div>Treasury UTR: <span className="font-bold text-blue-700">PFMS-UTR-34F5BBFFF2</span></div>
              <div>Settlement Date: <span className="font-bold">{new Date().toISOString()}</span></div>
            </div>
            <button
              onClick={() => setShowCertificateModal(false)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
