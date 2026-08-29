import React, { useState } from 'react';
import {
  CheckCircle2, FileText,
  Volume2, VolumeX, Scale, Sliders,
  FileCheck, HelpCircle, RotateCcw,
  Award, History, Bug,
  ShieldCheck, ShieldAlert, GitCompare
} from 'lucide-react';
import type { Case, UIGraphData, Provenance, Node as GraphNode } from '../types';
import { CausalMasonryCanvas } from './CausalMasonryCanvas';
import { EvidenceVault } from './EvidenceVault';
import { ConsentSlider } from './ConsentSlider';
import { SentinelOverlay } from './SentinelOverlay';

interface SovereignStudioViewProps {
  currentCase: Case;
  graphData: UIGraphData | null;
  onGrantConsent: (actionId: string, consent: boolean) => void;
  onSubmitAction: (actionId: string) => void;
  onResolveChain: () => void;
  onAdvanceTime: (days: number) => void;
  onSelectProvenance: (prov: Provenance | null) => void;
  onOpenWhy: (node: GraphNode) => void;
  onOpenEpistemicLedger: () => void;
  onOpenDebugger: () => void;
  onOpenReplay: () => void;
  onOpenCounterfactual: () => void;
  onOpenIdentityEntropy: () => void;
  onOpenPolicyGuardrails: () => void;
  onOpenRedTeam: () => void;
  onOpenPresenter: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const SovereignStudioView: React.FC<SovereignStudioViewProps> = ({
  currentCase,
  graphData,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onAdvanceTime,
  onSelectProvenance,
  onOpenWhy,
  onOpenEpistemicLedger,
  onOpenDebugger,
  onOpenReplay,
  onOpenCounterfactual,
  onOpenPolicyGuardrails,
  onOpenRedTeam,
  onOpenPresenter,
  onReset,
  isLoading,
}) => {
  const [centerTab, setCenterTab] = useState<'causal' | 'evidence'>('causal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showLegalLibrary, setShowLegalLibrary] = useState(false);

  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING' || currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  // Voice briefing using Web Speech API
  const toggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = isResolved
        ? `Case successfully resolved! The ${isDbt ? '48,000 rupee scholarship' : 'provident fund claim'} has been verified and disbursed.`
        : `INDRA has diagnosed the root cause for ${currentCase.citizen_name}. ${
            isDbt
              ? 'An omnibus police debit restriction on Canara Bank triggered NPCI mapper inactivation. Slide to authorize to remap to your active SBI account.'
              : 'A date of exit mismatch was detected between your relieving letter and employer returns. Slide to authorize the joint declaration.'
          }`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSlideAuthorize = () => {
    if (currentAction) {
      onGrantConsent(currentAction.id, true);
      onSubmitAction(currentAction.id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* 1. TRI-PANE FORENSIC HYPERVISOR WORKSPACE                    */}
      {/* ============================================================ */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">
        {/* ========================================================== */}
        {/* LEFT PANEL (Col 1-3): Case Chronicle & Forensic Diagnosis  */}
        {/* ========================================================== */}
        <div className="col-span-3 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col space-y-4 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                1. Forensic Case Chronicle
              </h3>
            </div>
            <button
              onClick={toggleVoice}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border flex items-center space-x-1 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Voice Briefing"
            >
              {isPlayingAudio ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-blue-600" />}
              <span>{isPlayingAudio ? 'Stop' : 'Voice'}</span>
            </button>
          </div>

          {/* Citizen Target Card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Beneficiary Citizen</span>
              <span className="font-mono text-blue-700 font-black">CONFIDENCE: 99%</span>
            </div>
            <h4 className="text-sm font-black text-slate-900">{currentCase.citizen_name}</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              {isDbt
                ? 'Student • Post-Matric Welfare Scholarship • Beneficiary ID #PFMS-99210'
                : 'Member • EPFO Universal Account Number #1009288192'}
            </p>
          </div>

          {/* Root Cause Diagnosis Block */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="p-4 bg-amber-50/90 border border-amber-300/90 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-serif font-black uppercase text-amber-900">
                  DIAGNOSED ROOT CAUSE
                </span>
                <span className="text-[10px] font-mono font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                  {Math.round((currentCase.overall_confidence || 0.96) * 100)}% CERTAIN
                </span>
              </div>
              <h5 className="text-xs font-serif font-bold text-slate-900 leading-snug">
                {isDbt
                  ? 'Police Debit Freeze on Canara Bank Inactivated NPCI Mapper'
                  : 'Date of Exit Discrepancy (15/04/2023 vs 31/03/2023)'}
              </h5>
              <p className="text-[11px] text-slate-700 leading-relaxed font-serif">
                {currentCase.blocker_summary ||
                  'Automated state transition blocked due to upstream administrative lien impeding public welfare disbursal.'}
              </p>

              {/* WHY? Trigger Button */}
              <button
                onClick={() => {
                  const infNode = graphData?.nodes?.find(n => n.epistemic_category === 'INFERENCE') || {
                    id: 'node-root-cause',
                    label: 'Upstream Police Restriction Cascade',
                    type: 'DEPENDENCY',
                    attributes: {},
                    epistemic_category: 'INFERENCE',
                    status: 'VERIFIED',
                    confidence: 0.98,
                  };
                  onOpenWhy(infNode as GraphNode);
                }}
                className="w-full mt-2 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>WHY? Trace Provenance to Document</span>
              </button>
            </div>

            {/* Statutory Law Citation */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-slate-500">
                <Scale className="w-3 h-3 text-slate-700" />
                <span>Statutory Authority & Precedent</span>
              </div>
              <p className="text-[11px] text-slate-800 font-medium leading-tight">
                {isDbt
                  ? 'Gujarat HC (R/SCR.A/1908/2023): Omnibus freezes under Sec 102 CrPC cannot obstruct statutory welfare payments.'
                  : 'EPFO Joint Declaration SOP v3.0: Employee relieving certificate supersedes unverified employer ECR entries.'}
              </p>
              <button
                onClick={() => setShowLegalLibrary(true)}
                className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer block pt-0.5"
              >
                View Full Legal Library & Sections →
              </button>
            </div>

            {/* Extracted Facts List */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Confirmed Empirical Facts ({currentCase.facts_summary?.length || 0})
              </div>
              {(currentCase.facts_summary || []).slice(0, 4).map((f, i) => (
                <div key={i} className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px]">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="font-bold">Fact #{i + 1}</span>
                    <span className="font-mono text-emerald-700 font-bold">100% OCR</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5">{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CENTER PANEL (Col 4-8): Causal Blueprint & Evidence Studio */}
        {/* ========================================================== */}
        <div className="col-span-5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col space-y-4 shadow-sm overflow-hidden">
          {/* Header Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                2. Causal Masonry & Evidence Studio
              </h3>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setCenterTab('causal')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  centerTab === 'causal'
                    ? 'bg-white text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Causal Masonry
              </button>
              <button
                onClick={() => setCenterTab('evidence')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  centerTab === 'evidence'
                    ? 'bg-white text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Evidence Vault
              </button>
            </div>
          </div>

          {/* Interactive Canvas Body */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 bg-[#FAFAFA]">
            {centerTab === 'causal' ? (
              <CausalMasonryCanvas
                graphData={graphData}
                documents={currentCase.documents || []}
                onSelectProvenance={onSelectProvenance}
                onOpenWhy={onOpenWhy}
              />
            ) : (
              <EvidenceVault
                documents={currentCase.documents || []}
                activeProvenance={null}
                onSelectProvenance={onSelectProvenance}
              />
            )}
          </div>
        </div>

        {/* ========================================================== */}
        {/* RIGHT PANEL (Col 9-12): Action Console & Sentinel Radar    */}
        {/* ========================================================== */}
        <div className="col-span-4 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col space-y-4 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                3. Autonomous Execution Deck
              </h3>
            </div>
            <span className="text-[10px] font-mono font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {currentCase.current_state}
            </span>
          </div>

          {/* Body Content depending on State */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* STATE 1: WAITING / SENTINEL MODE */}
            {isWaiting ? (
              <div className="flex-1 flex flex-col justify-center">
                <SentinelOverlay
                  currentCase={currentCase}
                  onAdvanceTime={onAdvanceTime}
                  onSimulateResponse={onResolveChain}
                />
              </div>
            ) : isResolved ? (
              /* STATE 2: RESOLVED / CERTAINTY RESTORED */
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-3xl text-center space-y-3 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-200 text-emerald-950 px-3 py-1 rounded-full">
                  ADMINISTRATIVE CERTAINTY RESTORED
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  {isDbt ? '₹48,000.00 Credited Successfully' : 'EPFO Claim Approved & Settled'}
                </h4>
                <p className="text-xs text-slate-600 max-w-sm">
                  Treasury transaction settled via RBI Core Gateway. UTR Ref: <strong className="font-mono text-slate-800">PFMS-UTR-34F5BBFFF2</strong>.
                </p>

                <div className="pt-2 flex flex-col w-full space-y-2">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Download Official Resolution Certificate</span>
                  </button>
                  <button
                    onClick={onReset}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl border border-slate-300 transition-all cursor-pointer"
                  >
                    Reset Demonstration (Day 0)
                  </button>
                </div>
              </div>
            ) : (
              /* STATE 3: ACTION REQUIRED / SLIDE TO AUTHORIZE */
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Prepared Administrative Representation
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{currentAction?.purpose}</h4>
                    <div className="text-[11px] text-slate-500">
                      Target Authority: <strong className="text-slate-800">{currentAction?.target_institution}</strong>
                    </div>

                    <button
                      onClick={() => setShowDossierModal(true)}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1 pt-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Full Prepared Legal Petition</span>
                    </button>
                  </div>
                </div>

                {/* Consent Slider Module */}
                {currentAction && (
                  <div className="pt-2">
                    <ConsentSlider
                      actionTitle={currentAction.purpose}
                      targetAuthority={currentAction.target_institution}
                      legalBasis={currentAction.legal_basis || 'Procedural Directive'}
                      isAuthorized={currentAction.citizen_consent}
                      disabled={isLoading}
                      onAuthorize={handleSlideAuthorize}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM FORENSIC COMMAND DOCK                              */}
      {/* ============================================================ */}
      <div className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-black text-[10px] uppercase tracking-wider text-slate-400 mr-2">
            FORENSIC AUDIT SUITE:
          </span>

          <button
            onClick={onOpenEpistemicLedger}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Epistemic Ledger</span>
          </button>

          <button
            onClick={onOpenCounterfactual}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-600" />
            <span>What-If Studio</span>
          </button>

          <button
            onClick={onOpenDebugger}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-amber-600" />
            <span>DevTools Debugger</span>
          </button>

          <button
            onClick={onOpenReplay}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-teal-600" />
            <span>Flight Recorder</span>
          </button>

          <button
            onClick={onOpenPolicyGuardrails}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guardrails</span>
          </button>

          <button
            onClick={onOpenRedTeam}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Red Team Lab</span>
          </button>
        </div>

        {/* Presenter Mode (Shift+D) & Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenPresenter}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Presenter Deck (Shift+D)</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Reset to Day 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MODALS (Prepared Petition, Certificate, Legal Library)    */}
      {/* ============================================================ */}
      {showDossierModal && currentAction && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900">
                Prepared Administrative Petition Dossier
              </h3>
              <button
                onClick={() => setShowDossierModal(false)}
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

      {showLegalLibrary && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900">
                Statutory Precedents & Legal Framework Library
              </h3>
              <button
                onClick={() => setShowLegalLibrary(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">1. Gujarat High Court Precedent (R/SCR.A/1908/2023)</div>
                <p className="text-slate-600 leading-relaxed">
                  Section 102 CrPC debit freezes must be restricted only to disputed amounts and cannot unlawfully freeze unrelated citizen bank accounts or impede welfare disbursements.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">2. RBI Master Direction DPSS.CO.PD.No.1810/02.14.006/2015-16</div>
                <p className="text-slate-600 leading-relaxed">
                  Aadhaar Payment Bridge System (APBS) routing directives mandate customer-driven remapping of welfare benefits to active, unencumbered bank accounts.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">3. EPFO Joint Declaration Circular (SOP v3.0)</div>
                <p className="text-slate-600 leading-relaxed">
                  Joint Declaration process between employer and employee allows rapid administrative correction of Date of Exit discrepancies without claim rejection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
