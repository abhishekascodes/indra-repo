import React, { useState } from 'react';
import { FileText, Image, MessageSquare, Crosshair, Eye, ShieldCheck, FileCheck } from 'lucide-react';
import type { CaseDocument, Provenance } from '../types';

interface EvidenceVaultProps {
  documents: CaseDocument[];
  activeProvenance: Provenance | null;
  onSelectProvenance: (prov: Provenance | null) => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  documents,
  activeProvenance,
  onSelectProvenance,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    documents.length > 0 ? documents[0].id : null
  );

  const activeDoc = documents.find(d => d.id === (activeProvenance?.document_id || selectedDocId)) || documents[0];

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-blue-400" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileCheck className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0D111A] border-r border-slate-800/80 select-none">
      {/* Vault Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Evidence Vault</h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
          {documents.length} Records
        </span>
      </div>

      {/* Document Records List */}
      <div className="p-2 border-b border-slate-800/60 max-h-48 overflow-y-auto space-y-1">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 italic">No evidence uploaded yet.</div>
        ) : (
          documents.map(doc => {
            const isSelected = activeDoc?.id === doc.id;
            const hasActiveProv = activeProvenance?.document_id === doc.id;

            return (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDocId(doc.id);
                  if (activeProvenance && activeProvenance.document_id !== doc.id) {
                    onSelectProvenance(null);
                  }
                }}
                className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                  hasActiveProv
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-200'
                    : isSelected
                    ? 'bg-slate-800/80 border border-slate-700 text-slate-200'
                    : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getDocIcon(doc.file_type)}
                  <span className="truncate font-medium">{doc.filename}</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {doc.extractions_count} facts
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Document Sheet & Interactive Bounding Box Inspector */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden bg-[#0A0D14]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate font-medium">{activeDoc?.filename || 'Document Preview'}</span>
          </div>
          {activeProvenance && (
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/40">
              <Crosshair className="w-3 h-3 animate-pulse" />
              <span>Provenance Lock (Page {activeProvenance.page_number})</span>
            </div>
          )}
        </div>

        {/* Visual Simulated Document Canvas */}
        <div className="flex-1 bg-white/[0.02] border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between font-mono text-[11px] leading-relaxed text-slate-300 shadow-inner">
          {/* Document Content Rendering */}
          <div className="space-y-2 opacity-90 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-1 flex justify-between">
              <span>{activeDoc?.file_type?.toUpperCase()} MASTER ARCHIVE</span>
              <span>100% VERIFIED</span>
            </div>

            {activeDoc?.filename.includes('sanction') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-blue-400 font-bold">GOVERNMENT OF INDIA - MINISTRY OF SOCIAL JUSTICE</div>
                <div className="text-slate-400">SANCTION ORDER & BENEFICIARY ENTITLEMENT ADVICE</div>
                <div className="text-slate-500 text-[10px]">Sanction ID: DBT/2026/SCH-884920 | Date: 10 July 2026</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div>Beneficiary: <span className="text-white font-bold">Aakash Verma</span></div>
                  <div>DOB: <span className="text-white">14/05/2001</span> | Aadhaar: <span className="text-white">XXXX-XXXX-8821</span></div>
                  <div>Sanctioned Amount: <span className="text-emerald-400 font-bold">Rs. 48,000.00</span></div>
                  <div>Sanction Status: <span className="text-emerald-400 font-bold">APPROVED / SANCTIONED</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('pfms') && activeDoc?.file_type === 'pdf' && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-red-400 font-bold">PFMS - TRANSACTION EXCEPTION ADVICE</div>
                <div className="text-slate-500 text-[10px]">Ref: PFMS-TXN-2026-99214 | Date: 14 August 2026</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div>Beneficiary: <span className="text-white">Aakash Verma</span></div>
                  <div>Target Bank: <span className="text-amber-300">Canara Bank (CNRB0002145)</span></div>
                  <div>Target Account: <span className="text-white">*******4401</span></div>
                  <div className="text-red-400 font-bold pt-1">Status: REJECTED / DISBURSAL FAILED</div>
                  <div className="text-red-400 font-bold">Error Code: BNS-410</div>
                  <div className="text-slate-400 text-[10px]">Reason: Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank</div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('canara') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-amber-400 font-bold">CANARA BANK - ACCOUNT STATEMENT</div>
                <div className="text-slate-500 text-[10px]">Account No: 2145101004401 | IFSC: CNRB0002145</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div>Holder: <span className="text-white font-bold">AAKASH VERMA</span></div>
                  <div>Debit Status: <span className="text-red-400 font-bold">RESTRICTED / LIEN MARKED</span></div>
                  <div>NPCI Status: <span className="text-amber-400 font-bold">INACTIVE (APBS Mandate Suspended)</span></div>
                  <div>Lien Reference: <span className="text-slate-400">Cyber Police Requisition #CR-4412</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sbi') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-blue-400 font-bold">STATE BANK OF INDIA - ACCOUNT CONFIRMATION</div>
                <div className="text-slate-500 text-[10px]">Account No: 38492018812 | IFSC: SBIN0001067</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div>Holder: <span className="text-white font-bold">Aakash Verma</span></div>
                  <div>Account Status: <span className="text-emerald-400 font-bold">ACTIVE / FULL KYC COMPLIANT</span></div>
                  <div>Aadhaar Seeding: <span className="text-emerald-400 font-bold">SEEDED / READY FOR NPCI APBS MANDATE</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sms') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-emerald-400 font-bold">SMS GATEWAY LOG (VM-PFMSGV)</div>
                <div className="text-slate-400 text-[10px]">14-AUG-2026 14:32</div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 mt-2 font-sans text-xs">
                  "Dear Aakash Verma, your DBT payment of Rs 48000 for Post-Matric Scholarship failed due to destination bank rejection BNS-410. Kindly contact your bank or update NPCI mandate."
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('epfo') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-red-400 font-bold">EPFO - CLAIM REJECTION ADVICE (FORM 19/10C)</div>
                <div className="text-slate-500 text-[10px]">Member: Pooja Sharma | UAN: 100982341120</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div className="text-red-400 font-bold">Rejection Code: EPFO-REJ-DATE-MISMATCH</div>
                  <div>Portal Exit Date: <span className="text-amber-300 font-bold">31/03/2023</span></div>
                  <div>Remedy: Submit Joint Declaration under Revised SOP 2024.</div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('relieving') && (
              <div className="space-y-1.5 py-1 text-slate-300">
                <div className="text-blue-400 font-bold">TECHVENTURES INDIA - RELIEVING CERTIFICATE</div>
                <div className="text-slate-500 text-[10px]">Employee: Pooja Sharma (TV-4412)</div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div>Date of Joining: <span className="text-white">01/08/2020</span></div>
                  <div>Date of Relieving / Exit: <span className="text-emerald-400 font-bold">15/04/2023</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Glowing Bounding Box Highlight Overlay */}
          {activeProvenance && activeProvenance.document_id === activeDoc?.id && activeProvenance.bounding_box && (
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/10 rounded-md transition-all duration-300 pointer-events-none glow-green"
              style={{
                top: `${activeProvenance.bounding_box[0] * 100}%`,
                left: `${activeProvenance.bounding_box[1] * 100}%`,
                height: `${(activeProvenance.bounding_box[2] - activeProvenance.bounding_box[0]) * 100}%`,
                width: `${(activeProvenance.bounding_box[3] - activeProvenance.bounding_box[1]) * 100}%`,
              }}
            >
              <div className="absolute -top-4 right-0 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                {Math.round(activeProvenance.confidence * 100)}% CONFIDENCE
              </div>
            </div>
          )}

          {/* Active Snippet Readout Footer */}
          {activeProvenance && (
            <div className="mt-3 p-2 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-[11px]">
              <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-between">
                <span>Verified Source Fact</span>
                <span className="font-mono">Page {activeProvenance.page_number}</span>
              </div>
              <div className="text-slate-200 mt-0.5 truncate font-sans">
                "{activeProvenance.extracted_text}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
