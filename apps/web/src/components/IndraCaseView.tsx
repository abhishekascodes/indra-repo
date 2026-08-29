import React, { useState } from 'react';
import {
  FileText, Shield, CheckCircle2,
  Clock, Sparkles, Award, Scale, Eye,
  Send
} from 'lucide-react';
import type { Case, CaseDocument } from '../types';

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
  const [selectedChip, setSelectedChip] = useState<'bns410' | 'canara' | 'sec102' | 'sbi' | null>(null);

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
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8 font-sans select-none text-slate-900">
      {/* ============================================================ */}
      {/* 1. EDITORIAL HEADER & CASE PASSPORT                          */}
      {/* ============================================================ */}
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              CASE REF: {currentCase.id}
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              {isDbt ? 'DBT / PFMS WELFARE SCHOLARSHIP' : 'EPFO MEMBER CLAIM'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">RECOVERABLE ENTITLEMENT</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-950">
              {isDbt ? '₹48,000.00' : '₹3,12,000.00'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          {isDbt
            ? 'Administrative Reconstruction: Post-Matric Scholarship Payment Failure'
            : 'Administrative Reconstruction: EPFO Claim Date of Exit Conflict'}
        </h1>
        <p className="text-sm text-slate-500">
          Beneficiary: <strong className="text-slate-900 font-bold">{currentCase.citizen_name}</strong> • Scheme Code: <span className="font-mono font-bold text-slate-700">BT-99120</span> • Status: <strong className="text-amber-700 font-bold">{currentCase.current_state}</strong>
        </p>
      </div>

      {/* ============================================================ */}
      {/* 2. THE INVESTIGATION DOSSIER (Interactive Narrative Report)  */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Forensic Investigation Findings
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            4 Verified Records Correlated
          </span>
        </div>

        {/* Narrative Prose with Interactive Evidence Chips */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-serif">
          <p>
            On 15-Jan-2025, the central PFMS payment batch failed with rejection code{' '}
            <button
              onClick={() => setSelectedChip('bns410')}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Error BNS-410</span>
              <Eye className="w-3 h-3" />
            </button>
            . Investigation reveals that the Ahmedabad Cyber Crime Cell issued an omnibus notice under{' '}
            <button
              onClick={() => setSelectedChip('sec102')}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Section 102 CrPC</span>
              <Eye className="w-3 h-3" />
            </button>{' '}
            against Canara Bank account{' '}
            <button
              onClick={() => setSelectedChip('canara')}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>*4401</span>
              <Eye className="w-3 h-3" />
            </button>
            .
          </p>

          <p>
            In response, Canara Bank marked the citizen's Aadhaar bridge as <em>INACTIVE</em> on the central NPCI APBS mapper. This severed the payment link, withholding the approved ₹48,000 scholarship even though the citizen maintains an active, operational account with{' '}
            <button
              onClick={() => setSelectedChip('sbi')}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>State Bank of India (*8812)</span>
              <Eye className="w-3 h-3" />
            </button>
            .
          </p>
        </div>

        {/* Selected Chip Inline Inspector */}
        {selectedChip && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in-50 duration-150 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 uppercase">
                {selectedChip === 'bns410' && 'PFMS Rejection Code BNS-410'}
                {selectedChip === 'sec102' && 'Section 102 CrPC Police Requisition'}
                {selectedChip === 'canara' && 'Canara Bank Restricted Account *4401'}
                {selectedChip === 'sbi' && 'State Bank of India Active Account *8812'}
              </span>
              <button
                onClick={() => setSelectedChip(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Close Inspector [x]
              </button>
            </div>
            <p className="text-xs text-slate-700 font-sans">
              {selectedChip === 'bns410' && 'Central Treasury payment gateway aborted because destination bank mapper was marked inactive.'}
              {selectedChip === 'sec102' && 'Omnibus police freeze applied to entire account in violation of Gujarat High Court proportionality precedent.'}
              {selectedChip === 'canara' && 'Canara Bank account placed under debit restriction following cybercrime requisition.'}
              {selectedChip === 'sbi' && 'Active savings account with complete KYC, ready to receive direct benefit transfer disbursal.'}
            </p>
            <button
              onClick={() => onOpenDocument(currentCase.documents?.[0] as any)}
              className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center space-x-1 cursor-pointer pt-1"
            >
              <span>View Source PDF in Evidence Vault →</span>
            </button>
          </div>
        )}

        {/* Institutional Failure Flow Track */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Institutional Failure Cascade
          </div>
          <div className="grid sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="text-[9px] text-slate-400 font-bold uppercase">1. Origin</div>
              <div className="font-bold text-slate-900 mt-0.5">Police Sec 102 Notice</div>
              <div className="text-[10px] text-slate-500">Ahmedabad Cyber Cell</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="text-[9px] text-slate-400 font-bold uppercase">2. Bank Action</div>
              <div className="font-bold text-slate-900 mt-0.5">Canara Lien Placed</div>
              <div className="text-[10px] text-slate-500">NPCI APBS Inactivated</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="text-[9px] text-slate-400 font-bold uppercase">3. Gateway Abort</div>
              <div className="font-bold text-rose-700 mt-0.5">PFMS Error BNS-410</div>
              <div className="text-[10px] text-slate-500">Disbursal rejected</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-[9px] text-emerald-700 font-bold uppercase">4. Statutory Remedy</div>
              <div className="font-bold text-emerald-950 mt-0.5">Re-Seed to SBI *8812</div>
              <div className="text-[10px] text-emerald-700">Ready for citizen sign-off</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. THE RESOLUTION & MANDATE CARD                             */}
      {/* ============================================================ */}
      {!isWaiting && !isEscalated && !isResolved && (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-slate-950" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Prepared Statutory Remedy
              </h2>
            </div>
            <button
              onClick={onOpenPetition}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Legal Petition Draft</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-lg sm:text-xl font-bold text-slate-950">
              Transmit Directive: Re-Map Aadhaar APBS Bridge to State Bank of India
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif">
              Citing binding precedent from the <strong>Gujarat High Court (R/SCR.A/1908/2023)</strong> and <strong>RBI Master Direction DPSS.CO.PD.No.1810</strong>, INDRA will instruct Canara Bank and NPCI to re-seed your welfare disbursal channel to your operational State Bank of India account (*8812).
            </p>
          </div>

          {/* Action Guarantee Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-slate-700">
                <strong>What INDRA will do:</strong> Transmit statutory rectification representation to Nodal Desk and monitor the 15-day compliance window.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-slate-700">
                <strong>What INDRA will NOT do:</strong> INDRA cannot alter account balances, make withdrawals, or access private bank login credentials.
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAuthorize}
              disabled={isLoading}
              className="py-4 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-blue-600" />
              <span>Authorize & Transmit Mandate</span>
            </button>

            <button
              onClick={handleInstantFix}
              disabled={isLoading}
              className="py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1-Click: Fix Problem & Receive Entitlement</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SENTINEL MONITORING STATE (Light Theme)                   */}
      {/* ============================================================ */}
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
              {isEscalated ? 'STATUTORY SLA EXPIRED • AUTO-ESCALATED TO CPGRAMS' : 'SENTINEL ACTIVE • MONITORING INSTITUTIONAL COMPLIANCE'}
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2.5">
              {isEscalated
                ? 'Statutory Deadline Breached • Escalation Dispatched'
                : 'Representation Dispatched to Canara Bank & NPCI'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              {isEscalated
                ? 'Canara Bank did not clear the APBS restriction within the statutory 15-day deadline. INDRA filed an automated escalation to CPGRAMS.'
                : 'INDRA is actively monitoring the bank gateway. Under RBI Master Directions, the institution is bound to process re-mapping within 15 business days.'}
            </p>
          </div>

          {/* SLA Timeline Bar */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 max-w-md mx-auto text-left">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Statutory SLA Compliance Window</span>
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

      {/* ============================================================ */}
      {/* 5. RESOLUTION & CERTAINTY RESTORED                           */}
      {/* ============================================================ */}
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
            <div>UTR Ref: <strong className="text-slate-950 font-bold">PFMS-UTR-34F5BBFFF2</strong></div>
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
  );
};
