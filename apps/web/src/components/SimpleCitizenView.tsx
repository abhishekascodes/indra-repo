import React, { useState } from 'react';
import {
  CheckCircle2, AlertTriangle,
  Volume2, VolumeX, Clock,
  Sparkles, Award, ChevronDown, ChevronUp,
  FileCheck, Sliders, ArrowRight
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
  const [showProofDetails, setShowProofDetails] = useState(false);
  const [showPetitionModal, setShowPetitionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING';
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  // Voice readout using Web Speech API
  const toggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = isResolved
        ? `Great news! Your case is completely resolved. The ${isDbt ? '48,000 rupee scholarship' : 'provident fund claim'} has been successfully credited to your account.`
        : isWaiting
        ? `INDRA is now monitoring the bank for response. The official statutory deadline is 15 business days.`
        : `Hello ${currentCase.citizen_name}. Your ${isDbt ? '48,000 rupee scholarship' : 'PF claim'} was delayed because of an upstream account restriction. INDRA can fix this in one step by re-linking your active bank account. Please slide or click the button below to authorize.`;

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
    <div className="w-full h-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start font-sans select-none">
      {/* Maximum Width Centered Card for Supreme Readability */}
      <div className="w-full max-w-3xl space-y-5 my-auto py-2">
        {/* ============================================================ */}
        {/* TOP CLARITY BANNER: CITIZEN ID & AUDIO VOICE BUTTON          */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
              {currentCase.citizen_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
                  CASE FOR {currentCase.citizen_name.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">
                  VERIFIED BENEFICIARY
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {isDbt ? 'Post-Matric Welfare Scholarship Blockade' : 'EPFO PF Final Claim Settlement Dispute'}
              </h2>
            </div>
          </div>

          <button
            onClick={toggleVoice}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs ${
              isPlayingAudio
                ? 'bg-blue-600 text-white border-blue-700 shadow-blue-600/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Voice' : 'Listen to Voice Briefing'}</span>
            <span className="sm:hidden">{isPlayingAudio ? 'Stop' : 'Voice'}</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* MAIN STAGE 1: THE BIG CLARITY CARD (BEFORE SUBMISSION)       */}
        {/* ============================================================ */}
        {!isWaiting && !isEscalated && !isResolved && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(15,23,42,0.04)] space-y-6">
            {/* Header Badge & Entitlement Value */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wide flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Action Needed • 1 Step to Fix</span>
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blocked Entitlement</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {isDbt ? '₹48,000.00' : '₹3,12,000.00'}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {isDbt
                  ? 'Your ₹48,000 Scholarship is Stuck in the Banking Gateway'
                  : 'Your PF Claim was Blocked Due to an Exit Date Conflict'}
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                INDRA analyzed your documents and identified the exact legal and technical root cause.
              </p>
            </div>

            {/* The 2-Pillar Visual Comparison */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Pillar 1: What Happened (The Root Cause) */}
              <div className="p-5 bg-rose-50/60 border border-rose-200/90 rounded-2xl space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>1. What Happened</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                  {isDbt
                    ? 'Canara Bank placed a temporary lien on account *4401 under Section 102 CrPC, which caused the central PFMS portal to fail with Error BNS-410.'
                    : 'Your employer entered an exit date (15/11/2025) that contradicts your official relieving letter (31/10/2025), triggering Rule EPF-R09.'}
                </p>
                <div className="text-[10px] font-mono text-rose-800/80 bg-rose-100/60 px-2 py-1 rounded border border-rose-200/60">
                  Evidence: {isDbt ? 'PFMS_Failure_Report.pdf (Page 1)' : 'Relieving_Letter.pdf'}
                </div>
              </div>

              {/* Pillar 2: How INDRA Fixes It (The Automated Solution) */}
              <div className="p-5 bg-emerald-50/60 border border-emerald-200/90 rounded-2xl space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>2. How INDRA Fixes It</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                  {isDbt
                    ? 'INDRA automatically re-links your Aadhaar APBS payment bridge to your active State Bank of India account (*8812) using binding RBI rules.'
                    : 'INDRA generates a statutory Joint Declaration SOP v3.0 to rectify the exit date conflict with zero penalty.'}
                </p>
                <div className="text-[10px] font-mono text-emerald-800/80 bg-emerald-100/60 px-2 py-1 rounded border border-emerald-200/60">
                  Legal Basis: {isDbt ? 'Gujarat HC Precedent R/SCR.A/1908/2023' : 'EPFO Joint Declaration Circular'}
                </div>
              </div>
            </div>

            {/* The Giant Action: Slide or 1-Click to Fix */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black text-slate-700 text-center uppercase tracking-wider">
                Authorize INDRA to Fix Your Payment:
              </div>

              {/* Slider Option */}
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

              {/* Instant 1-Click Fast Fix Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleInstantFix}
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>1-Click: Fix Problem & Receive {isDbt ? '₹48,000.00' : 'PF Settlement'}</span>
                </button>
              </div>
            </div>

            {/* Inspect Legal Petition link */}
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPetitionModal(true)}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer inline-flex items-center space-x-1"
              >
                <span>Inspect the formal legal petition prepared by INDRA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN STAGE 2: SENTINEL WAITING / SLA COUNTDOWN STATE         */}
        {/* ============================================================ */}
        {(isWaiting || isEscalated) && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(15,23,42,0.04)] space-y-6 text-center">
            {/* Radar Animation */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full ${
                isEscalated ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {isEscalated ? 'SLA EXPIRED • ESCALATED TO CPGRAMS' : 'SENTINEL ACTIVE • MONITORING BANK PORTAL'}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
                {isEscalated
                  ? 'Bank Inaction Detected • Case Escalated to Government Oversight'
                  : 'Your Fix Has Been Transmitted to the Bank'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                {isEscalated
                  ? 'Because the bank did not clear the restriction within the 15-day statutory window, INDRA filed an automated escalation to CPGRAMS.'
                  : 'INDRA is actively monitoring institutional compliance. Under RBI Master Directions, the bank is bound to clear the update within 15 days.'}
              </p>
            </div>

            {/* SLA Timeline Bar */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Statutory SLA Compliance Window</span>
                <span className="font-mono font-black">{currentCase.simulated_day || 1} of 15 Days</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isEscalated ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, ((currentCase.simulated_day || 1) / 15) * 100)}%` }}
                />
              </div>
            </div>

            {/* Testing / Fast Forward Controls */}
            <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => onAdvanceTime(15)}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs border border-slate-300 transition-all cursor-pointer"
              >
                Fast-Forward +15 Days (Test SLA)
              </button>

              <button
                onClick={onResolveChain}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Simulate Bank Approving Fix
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN STAGE 3: CERTAINTY RESTORED / RESOLUTION SUCCESS        */}
        {/* ============================================================ */}
        {isResolved && (
          <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-50 border-2 border-emerald-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(5,150,105,0.08)] space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest bg-emerald-200 text-emerald-950 px-4 py-1.5 rounded-full border border-emerald-300">
                ADMINISTRATIVE CERTAINTY RESTORED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                {isDbt ? '₹48,000.00 Successfully Credited!' : 'PF Claim Approved & Settled!'}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                The central government treasury has completed disbursal to your active State Bank of India account.
              </p>
            </div>

            {/* Official Treasury Receipt */}
            <div className="p-4 bg-white border border-emerald-200 rounded-2xl space-y-1.5 max-w-md mx-auto text-left shadow-2xs font-mono text-xs text-slate-800">
              <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                Official Treasury Confirmation
              </div>
              <div className="pt-1 space-y-1">
                <div>UTR Ref: <strong className="text-slate-900">PFMS-UTR-34F5BBFFF2</strong></div>
                <div>Account: <strong>State Bank of India (*8812)</strong></div>
                <div>Disbursal Status: <strong className="text-emerald-700 font-bold">COMPLETED & VERIFIED</strong></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Official Certificate</span>
              </button>

              <button
                onClick={onReset}
                className="py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs border border-slate-300 transition-all cursor-pointer"
              >
                Reset Demo (Day 0)
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PROGRESSIVE DISCLOSURE: INSPECT PROOF (FOR AUDITORS)         */}
        {/* ============================================================ */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <button
            onClick={() => setShowProofDetails(!showProofDetails)}
            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Inspect Legal Proof & Documents (Progressive Disclosure)</span>
            </div>
            {showProofDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showProofDetails && (
            <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
              <p className="text-xs text-slate-600 leading-relaxed">
                INDRA extracts and verifies facts from real government and banking documents with 100% OCR confidence:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">Legal Precedent</div>
                  <div className="text-slate-600 leading-relaxed">
                    Gujarat High Court (R/SCR.A/1908/2023) prohibits omnibus bank account freezes from blocking citizen welfare entitlements.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">RBI Master Direction</div>
                  <div className="text-slate-600 leading-relaxed">
                    RBI Circular DPSS.CO.PD.No.1810 mandates customer-driven re-linking of welfare benefits to active bank accounts.
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
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
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 shadow-xs cursor-pointer"
                  >
                    View Exact Document Bounding Box (Why?)
                  </button>
                )}
                <button
                  onClick={onOpenAdvancedStudio}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Deep Technical Hypervisor Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
