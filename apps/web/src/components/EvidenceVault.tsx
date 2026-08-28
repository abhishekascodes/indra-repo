import React, { useState } from 'react';
import { FileText, Image, MessageSquare, Crosshair, Eye, ShieldCheck, FileCheck, Check } from 'lucide-react';
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
        return <FileText className="w-3.5 h-3.5 text-red-600" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <FileCheck className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] border-r border-slate-300 select-none">
      {/* Vault Terminal Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-300 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">EVIDENCE VAULT</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-300">
          {documents.length} RECORDS
        </span>
      </div>

      {/* Document Records List */}
      <div className="p-2 border-b border-slate-200 max-h-48 overflow-y-auto space-y-1 bg-slate-50">
        {documents.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-500 font-mono">NO EVIDENCE INGESTED</div>
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
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between font-mono ${
                  hasActiveProv
                    ? 'bg-amber-50 border border-amber-500 text-amber-900 font-bold shadow-xs'
                    : isSelected
                    ? 'bg-white border border-slate-400 text-slate-900 font-bold shadow-xs'
                    : 'hover:bg-slate-200/70 text-slate-600 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getDocIcon(doc.file_type)}
                  <span className="truncate">{doc.filename}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono flex-shrink-0">
                  {doc.extractions_count} FACTS
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Document Sheet & Interactive Bounding Box Inspector */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden bg-[#F1F5F9]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-mono font-semibold">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{activeDoc?.filename || 'Document Preview'}</span>
          </div>
          {activeProvenance && (
            <div className="flex items-center space-x-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-mono font-bold">
              <Crosshair className="w-3 h-3 animate-pulse text-amber-600" />
              <span>LOCK: P.{activeProvenance.page_number}</span>
            </div>
          )}
        </div>

        {/* Visual Bloomberg Light Document Canvas */}
        <div className="flex-1 bg-white border border-slate-300 rounded-lg p-4 relative overflow-hidden flex flex-col justify-between font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm">
          {/* Document Content Rendering */}
          <div className="space-y-2 overflow-y-auto pr-1">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 flex justify-between font-bold">
              <span>{activeDoc?.file_type?.toUpperCase()} MASTER RECORD</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>AUTHENTIC</span>
              </span>
            </div>

            {activeDoc?.filename.includes('sanction') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-blue-700 font-bold text-xs">GOVERNMENT OF INDIA - MINISTRY OF SOCIAL JUSTICE</div>
                <div className="text-slate-600 font-semibold">SANCTION ORDER & BENEFICIARY ENTITLEMENT ADVICE</div>
                <div className="text-slate-400 text-[10px]">Sanction ID: DBT/2026/SCH-884920 | Date: 10 July 2026</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div>Beneficiary: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>DOB: <span className="text-slate-900">14/05/2001</span> | Aadhaar: <span className="text-slate-900 font-mono">XXXX-XXXX-8821</span></div>
                  <div>Sanctioned Amount: <span className="text-emerald-700 font-bold">Rs. 48,000.00</span></div>
                  <div>Sanction Status: <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-300">APPROVED / SANCTIONED</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('pfms') && activeDoc?.file_type === 'pdf' && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-red-700 font-bold text-xs">PFMS - TRANSACTION EXCEPTION ADVICE</div>
                <div className="text-slate-400 text-[10px]">Ref: PFMS-TXN-2026-99214 | Date: 14 August 2026</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div>Beneficiary: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>Target Bank: <span className="text-slate-700 font-bold">Canara Bank (CNRB0002145)</span></div>
                  <div>Target Account: <span className="text-slate-900 font-mono">*******4401</span></div>
                  <div className="text-red-700 font-bold pt-1">Status: REJECTED / DISBURSAL FAILED</div>
                  <div className="text-red-700 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-300 inline-block">Error Code: BNS-410</div>
                  <div className="text-slate-500 text-[10px] pt-1">Reason: Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank</div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('canara') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-slate-900 font-bold text-xs">CANARA BANK - ACCOUNT STATEMENT</div>
                <div className="text-slate-400 text-[10px]">Account No: 2145101004401 | IFSC: CNRB0002145</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div>Holder: <span className="text-slate-900 font-bold">AAKASH VERMA</span></div>
                  <div>Debit Status: <span className="text-red-700 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-300">RESTRICTED / LIEN MARKED</span></div>
                  <div>NPCI Status: <span className="text-amber-700 font-bold">INACTIVE (APBS Mandate Suspended)</span></div>
                  <div>Lien Reference: <span className="text-slate-600 font-mono">Cyber Police Requisition #CR-4412</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sbi') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-blue-700 font-bold text-xs">STATE BANK OF INDIA - ACCOUNT CONFIRMATION</div>
                <div className="text-slate-400 text-[10px]">Account No: 38492018812 | IFSC: SBIN0001067</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div>Holder: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>Account Status: <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-300">ACTIVE / FULL KYC COMPLIANT</span></div>
                  <div>Aadhaar Seeding: <span className="text-emerald-700 font-bold">SEEDED / READY FOR NPCI APBS MANDATE</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sms') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-emerald-700 font-bold text-xs">SMS GATEWAY LOG (VM-PFMSGV)</div>
                <div className="text-slate-400 text-[10px]">14-AUG-2026 14:32</div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-300 text-slate-800 mt-2 font-sans text-xs shadow-2xs">
                  "Dear Aakash Verma, your DBT payment of Rs 48000 for Post-Matric Scholarship failed due to destination bank rejection BNS-410. Kindly contact your bank or update NPCI mandate."
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('epfo') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-red-700 font-bold text-xs">EPFO - CLAIM REJECTION ADVICE (FORM 19/10C)</div>
                <div className="text-slate-400 text-[10px]">Member: Pooja Sharma | UAN: 100982341120</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div className="text-red-700 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-300 inline-block">Rejection Code: EPFO-REJ-DATE-MISMATCH</div>
                  <div>Portal Exit Date: <span className="text-amber-800 font-bold">31/03/2023</span></div>
                  <div className="text-slate-600">Directive: Submit Joint Declaration under Revised SOP 2024.</div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('relieving') && (
              <div className="space-y-1.5 py-1 text-slate-800">
                <div className="text-blue-700 font-bold text-xs">TECHVENTURES INDIA - RELIEVING CERTIFICATE</div>
                <div className="text-slate-400 text-[10px]">Employee: Pooja Sharma (TV-4412)</div>
                <div className="pt-2 border-t border-slate-200 space-y-0.5">
                  <div>Date of Joining: <span className="text-slate-900 font-bold">01/08/2020</span></div>
                  <div>Date of Relieving / Exit: <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-300">15/04/2023</span></div>
                </div>
              </div>
            )}
          </div>

          {/* High-Contrast Spatial Bounding Box Overlay */}
          {activeProvenance && activeProvenance.document_id === activeDoc?.id && activeProvenance.bounding_box && (
            <div
              className="absolute border-2 border-amber-600 bg-amber-500/15 rounded transition-all duration-200 pointer-events-none shadow-xs"
              style={{
                top: `${activeProvenance.bounding_box[0] * 100}%`,
                left: `${activeProvenance.bounding_box[1] * 100}%`,
                height: `${(activeProvenance.bounding_box[2] - activeProvenance.bounding_box[0]) * 100}%`,
                width: `${(activeProvenance.bounding_box[3] - activeProvenance.bounding_box[1]) * 100}%`,
              }}
            >
              <div className="absolute -top-4 right-0 bg-amber-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shadow-xs">
                {Math.round(activeProvenance.confidence * 100)}% MATCH
              </div>
            </div>
          )}

          {/* Active Snippet Readout Footer */}
          {activeProvenance && (
            <div className="mt-3 p-2 rounded bg-amber-50 border border-amber-300 text-[11px]">
              <div className="text-[10px] text-amber-800 uppercase font-bold flex items-center justify-between font-mono">
                <span>VERIFIED EVIDENCE PROVENANCE</span>
                <span>PAGE {activeProvenance.page_number}</span>
              </div>
              <div className="text-slate-900 mt-0.5 truncate font-mono text-[10px]">
                "{activeProvenance.extracted_text}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
