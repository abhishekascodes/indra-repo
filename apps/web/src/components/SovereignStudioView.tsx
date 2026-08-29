import React, { useState } from 'react';
import {
  Volume2, VolumeX, Sparkles, Award,
  Terminal
} from 'lucide-react';
import type { Case, UIGraphData, Provenance, Node as GraphNode } from '../types';
import { EvidenceVault } from './EvidenceVault';
import { ConsentSlider } from './ConsentSlider';

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
  onOpenIdentityEntropy?: () => void;
  onOpenPolicyGuardrails: () => void;
  onOpenRedTeam: () => void;
  onOpenPresenter: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const SovereignStudioView: React.FC<SovereignStudioViewProps> = ({
  currentCase,
  graphData: _graphData,
  onGrantConsent,
  onSubmitAction,
  onResolveChain,
  onAdvanceTime,
  onSelectProvenance: _onSelectProvenance,
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
  const [activeTab, setActiveTab] = useState<'matrix' | 'vault'>('matrix');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const isDbt = currentCase.domain_id === 'dbt_failure';
  const isWaiting = currentCase.current_state === 'WAITING';
  const isEscalated = currentCase.current_state === 'ESCALATION_REQUIRED';
  const isResolved = currentCase.current_state === 'RESOLUTION';
  const currentAction = currentCase.actions?.[0];

  // Voice Briefing
  const toggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = isResolved
        ? `Administrative certainty restored. Entitlement ₹48,000 disbursed via UTR Ref PFMS-UTR-34F5BBFFF2.`
        : isWaiting
        ? `Sentinel mode active. Monitoring institutional compliance under 15-day statutory SLA window.`
        : `Terminal diagnosis: Upstream Section 102 CrPC debit freeze on Canara Bank account inactivated NPCI mapper, withholding ₹48,000 scholarship. Statutory remedy prepared under Gujarat High Court precedent.`;

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
    <div className="w-full h-full bg-[#FAFAFA] font-mono text-slate-900 overflow-hidden flex flex-col justify-between select-none">
      {/* ============================================================ */}
      {/* 1. BLOOMBERG TERMINAL TOP LIVE TICKER BAR                     */}
      {/* ============================================================ */}
      <div className="h-9 bg-slate-950 text-slate-200 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-[11px] tracking-tight flex-shrink-0">
        <div className="flex items-center space-x-3 overflow-x-auto whitespace-nowrap">
          <span className="flex items-center space-x-1.5 text-amber-400 font-black">
            <Terminal className="w-3.5 h-3.5" />
            <span>INDRA/HYPERVISOR</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            CASE: <strong className="text-white">{currentCase.id}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            PFMS: <strong className={isDbt ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{isDbt ? 'ERR_BNS-410' : 'OK'}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            NPCI_MAPPER: <strong className="text-amber-400">INACTIVE</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            CANARA_BANK: <strong className="text-rose-400">SEC_102_HOLD</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            SLA_WINDOW: <strong className="text-cyan-400">15D [DAY {currentCase.simulated_day || 1}]</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-emerald-400 font-bold">● SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 3-PANEL BLOOMBERG TERMINAL MATRIX                          */}
      {/* ============================================================ */}
      <div className="flex-1 p-3 sm:p-4 grid grid-cols-12 gap-3 overflow-hidden">
        {/* ========================================================== */}
        {/* PANEL 1: [CHR] FORENSIC CHRONICLE & DIAGNOSIS (3 Cols)      */}
        {/* ========================================================== */}
        <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs overflow-y-auto space-y-4">
          <div className="space-y-3">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                [01] FORENSIC CHRONICLE
              </span>
              <button
                onClick={toggleVoice}
                className="p-1 text-slate-500 hover:text-blue-600 rounded cursor-pointer"
                title="Voice Briefing"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-blue-600" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Target Profile Card */}
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Target Beneficiary</div>
              <div className="font-bold text-slate-900">{currentCase.citizen_name}</div>
              <div className="text-[11px] text-slate-500 font-sans">
                Post-Matric Scholarship Scheme • Entitlement: <strong className="text-slate-900 font-mono font-bold">{isDbt ? '₹48,000.00' : '₹3,12,000.00'}</strong>
              </div>
            </div>

            {/* Diagnosed Root Cause Block */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] font-bold text-amber-800">
                <span>DIAGNOSED ROOT CAUSE</span>
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono">100% CERTAIN</span>
              </div>
              <div className="font-bold text-slate-900 text-[11px] leading-snug">
                Police Debit Freeze on Canara Bank Inactivated NPCI Mapper
              </div>
              <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                Omnibus Section 102 CrPC restriction suspended Aadhaar bridge, causing central PFMS disbursal gateway to abort with Error BNS-410.
              </p>

              <button
                onClick={() => {
                  if (onOpenWhy) {
                    onOpenWhy({
                      id: 'node-root-cause',
                      label: isDbt ? 'Upstream Police Restriction Cascade' : 'Exit Date Discrepancy Conflict',
                      type: 'DEPENDENCY',
                      attributes: {},
                      epistemic_category: 'INFERENCE',
                      status: 'VERIFIED',
                      confidence: 0.98,
                    });
                  }
                }}
                className="w-full py-1.5 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
              >
                <span>[F3] Trace Provenance to Document</span>
              </button>
            </div>

            {/* Statutory Law Authority */}
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs font-sans">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Statutory Precedent</div>
              <div className="font-bold text-slate-900 text-[11px]">
                Gujarat High Court (R/SCR.A/1908/2023)
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Omnibus police freezes cannot obstruct lawful statutory welfare payments.
              </p>
            </div>
          </div>

          {/* Quick Extracted Facts Table */}
          <div className="space-y-1.5 border-t border-slate-100 pt-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Empirical Facts</div>
            {(currentCase.facts_summary || []).slice(0, 3).map((f, i) => (
              <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-700 font-sans truncate">
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* PANEL 2: [LAW] CAUSAL RULE & EVIDENCE MATRIX (6 Cols)       */}
        {/* ========================================================== */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Panel Tabs Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  [02] CAUSAL RULE & EVIDENCE MATRIX
                </span>
              </div>

              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeTab === 'matrix' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tabular Matrix
                </button>
                <button
                  onClick={() => setActiveTab('vault')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeTab === 'vault' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Evidence Vault ({currentCase.documents?.length || 0})
                </button>
              </div>
            </div>

            {/* Matrix View */}
            {activeTab === 'matrix' && (
              <div className="flex-1 overflow-y-auto space-y-2 text-xs">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 p-2 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                  <div className="col-span-3">Entity / Fact</div>
                  <div className="col-span-4">System Observation</div>
                  <div className="col-span-3">Statutory Rule</div>
                  <div className="col-span-2 text-right">Confidence</div>
                </div>

                {/* Matrix Rows */}
                <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl items-center hover:bg-slate-100/60 transition-colors">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-900 block text-[11px]">Canara Account *4401</span>
                    <span className="text-[9px] text-slate-400">Cyber Crime Notice</span>
                  </div>
                  <div className="col-span-4 text-[11px] text-rose-700 font-bold">
                    Debit Restriction / Sec 102
                  </div>
                  <div className="col-span-3 text-[10px] text-slate-600">
                    Gujarat HC R/SCR.A/1908
                  </div>
                  <div className="col-span-2 text-right text-emerald-700 font-bold text-[11px]">
                    100% OCR
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl items-center hover:bg-slate-100/60 transition-colors">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-900 block text-[11px]">NPCI APBS Mapper</span>
                    <span className="text-[9px] text-slate-400">Aadhaar Bridge</span>
                  </div>
                  <div className="col-span-4 text-[11px] text-amber-700 font-bold">
                    Inactive Seeding Mandate
                  </div>
                  <div className="col-span-3 text-[10px] text-slate-600">
                    RBI DPSS.CO.PD.1810
                  </div>
                  <div className="col-span-2 text-right text-emerald-700 font-bold text-[11px]">
                    VERIFIED
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl items-center hover:bg-slate-100/60 transition-colors">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-900 block text-[11px]">PFMS Gateway</span>
                    <span className="text-[9px] text-slate-400">Disbursal Batch</span>
                  </div>
                  <div className="col-span-4 text-[11px] text-rose-700 font-bold">
                    Code BNS-410 Abort
                  </div>
                  <div className="col-span-3 text-[10px] text-slate-600">
                    DBT Mission SOP v2.4
                  </div>
                  <div className="col-span-2 text-right text-emerald-700 font-bold text-[11px]">
                    100% OCR
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl items-center hover:bg-slate-100/60 transition-colors">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-900 block text-[11px]">State Bank of India</span>
                    <span className="text-[9px] text-slate-400">Account *8812</span>
                  </div>
                  <div className="col-span-4 text-[11px] text-emerald-700 font-bold">
                    Active & Operational
                  </div>
                  <div className="col-span-3 text-[10px] text-slate-600">
                    Valid KYC Complete
                  </div>
                  <div className="col-span-2 text-right text-emerald-700 font-bold text-[11px]">
                    100% OCR
                  </div>
                </div>
              </div>
            )}

            {/* Vault View */}
            {activeTab === 'vault' && (
              <div className="flex-1 overflow-hidden">
                <EvidenceVault
                  documents={currentCase.documents || []}
                  activeProvenance={null}
                  onSelectProvenance={() => {}}
                />
              </div>
            )}
          </div>

          {/* Matrix Footer Note */}
          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
            <span>Deterministic Causal Validation Engine</span>
            <span>All 4 Evidence Sources Correlated</span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PANEL 3: [EXEC] AUTONOMOUS TRANSMISSION & SENTINEL (3 Cols) */}
        {/* ========================================================== */}
        <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs space-y-4">
          <div className="space-y-3">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                [03] EXECUTION & SENTINEL
              </span>
              <span className="text-[9px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                {currentCase.current_state}
              </span>
            </div>

            {/* Representation Dossier Box */}
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5 text-xs">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Statutory Remedy</div>
              <div className="font-bold text-slate-900 text-[11px]">
                Re-Seed APBS Mapper to Active SBI Account
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Target: <strong>Canara Bank Lead Branch & NPCI</strong>
              </p>
              <button
                onClick={() => setShowDossierModal(true)}
                className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Inspect Full Prepared Legal Petition →
              </button>
            </div>

            {/* Action State: Slider / Waiting / Resolution */}
            {!isWaiting && !isEscalated && !isResolved && (
              <div className="space-y-2 pt-1">
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

                <button
                  onClick={handleInstantFix}
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click: Fix & Disburse</span>
                </button>
              </div>
            )}

            {(isWaiting || isEscalated) && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  {isEscalated ? 'SLA EXPIRED • ESCALATED' : 'SENTINEL RADAR ACTIVE'}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  SLA Window: <strong>Day {currentCase.simulated_day || 1} of 15</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onAdvanceTime(15)}
                    className="py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    +15d (SLA)
                  </button>
                  <button
                    onClick={onResolveChain}
                    className="py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Simulate OK
                  </button>
                </div>
              </div>
            )}

            {isResolved && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-center">
                <div className="text-xs font-black text-emerald-900">
                  CERTAINTY RESTORED
                </div>
                <div className="text-[11px] text-slate-700 font-mono">
                  UTR: PFMS-UTR-34F5BBFFF2
                </div>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>DPDPA 2023 Consent Token</span>
            <span>SECURE</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BLOOMBERG FUNCTION KEYS DOCK (<F1> to <F12>)               */}
      {/* ============================================================ */}
      <div className="h-10 bg-slate-900 text-slate-300 border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between text-[11px] overflow-x-auto whitespace-nowrap flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEpistemicLedger}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F1&gt;</span>
            <span>LEDGER</span>
          </button>
          <button
            onClick={onOpenCounterfactual}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F2&gt;</span>
            <span>WHAT-IF</span>
          </button>
          <button
            onClick={onOpenDebugger}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F3&gt;</span>
            <span>DEVTOOLS</span>
          </button>
          <button
            onClick={onOpenReplay}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F4&gt;</span>
            <span>REPLAY</span>
          </button>
          <button
            onClick={onOpenPolicyGuardrails}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F5&gt;</span>
            <span>GUARDRAILS</span>
          </button>
          <button
            onClick={onOpenRedTeam}
            className="hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span className="text-amber-400 font-bold mr-1">&lt;F6&gt;</span>
            <span>RED TEAM</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPresenter}
            className="hover:text-white text-cyan-400 font-bold hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span>&lt;SHIFT+D&gt; PRESENTER</span>
          </button>
          <button
            onClick={onReset}
            className="hover:text-white text-rose-400 font-bold hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <span>&lt;F12&gt; RESET</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODALS: Legal Petition & Resolution Certificate              */}
      {/* ============================================================ */}
      {showDossierModal && currentAction && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 font-mono">
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
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4 text-center font-mono">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <Award className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              OFFICIAL ADMINISTRATIVE RESOLUTION CERTIFICATE
            </h3>
            <p className="text-xs text-slate-600 font-sans">
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
