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
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200 select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Evidence Vault
          </h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
          {documents.length} Source Records
        </span>
      </div>

      {/* Clean Document Pill Selector */}
      <div className="p-2 border-b border-slate-200 bg-white flex space-x-1.5 overflow-x-auto scrollbar-none">
        {documents.map(doc => {
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                hasActiveProv
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : isSelected
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {getDocIcon(doc.file_type)}
              <span className="truncate max-w-[130px]">{doc.filename}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Document Sheet Canvas */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium truncate">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{activeDoc?.filename || 'Document Preview'}</span>
          </div>

          {activeProvenance && (
            <div className="flex items-center space-x-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
              <Crosshair className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>PAGE {activeProvenance.page_number} PROVENANCE</span>
            </div>
          )}
        </div>

        {/* Paper Sheet Preview */}
        <div className="flex-1 bg-white border border-slate-300 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between shadow-xs text-xs text-slate-800 leading-relaxed font-sans">
          <div className="space-y-2.5 overflow-y-auto pr-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 pb-1.5 flex justify-between">
              <span>{activeDoc?.file_type?.toUpperCase()} EVIDENCE ARTEFACT</span>
              <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                <Check className="w-3 h-3" />
                <span>AUTHENTIC</span>
              </span>
            </div>

            {/* Document Specific High-Contrast Renderings */}
            {activeDoc?.filename.includes('sanction') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-indigo-900 font-bold text-xs">GOVERNMENT OF INDIA - MINISTRY OF SOCIAL JUSTICE</div>
                <div className="text-slate-600 font-semibold">SANCTION ORDER & BENEFICIARY ENTITLEMENT ADVICE</div>
                <div className="text-slate-400 text-[11px]">Sanction Ref: DBT/2026/SCH-884920 | Date: 10 July 2026</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div>Beneficiary Name: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>Date of Birth: <span className="text-slate-900 font-mono">14/05/2001</span> | Aadhaar: <span className="text-slate-900 font-mono">XXXX-XXXX-8821</span></div>
                  <div>Sanctioned Benefit: <span className="text-emerald-700 font-bold">₹48,000.00 (Post-Matric Scholarship)</span></div>
                  <div>Portal Status: <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">APPROVED / SANCTIONED</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('pfms') && activeDoc?.file_type === 'pdf' && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-red-700 font-bold text-xs">PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)</div>
                <div className="text-slate-600 font-semibold">CENTRAL DISBURSAL TRANSACTION EXCEPTION ADVICE</div>
                <div className="text-slate-400 text-[11px]">Txn Ref: PFMS-TXN-2026-99214 | Date: 14 August 2026</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div>Beneficiary: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>Routing Bank: <span className="text-slate-800 font-medium">Canara Bank (CNRB0002145)</span></div>
                  <div>Destination Account: <span className="text-slate-900 font-mono">*******4401</span></div>
                  <div className="text-red-700 font-bold pt-1">Disbursal Status: REJECTED / ABORTED</div>
                  <div className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-300 inline-block font-mono">
                    Error Code: BNS-410
                  </div>
                  <div className="text-slate-600 text-[11px] pt-1">
                    Description: Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank.
                  </div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('canara') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-slate-900 font-bold text-xs">CANARA BANK - ACCOUNT STATEMENT & STATUS</div>
                <div className="text-slate-400 text-[11px]">Account No: 2145101004401 | Lead Branch</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div>Account Holder: <span className="text-slate-900 font-bold">AAKASH VERMA</span></div>
                  <div>Operational Status: <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-300">DEBIT RESTRICTED / LIEN MARKED</span></div>
                  <div>NPCI APBS Status: <span className="text-amber-800 font-bold">INACTIVE (Mandate Suspended)</span></div>
                  <div>Lien Authority: <span className="text-slate-700 font-mono">Cyber Police Station Notice #CR-4412</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sbi') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-indigo-900 font-bold text-xs">STATE BANK OF INDIA - ACCOUNT CONFIRMATION</div>
                <div className="text-slate-400 text-[11px]">Account No: 38492018812 | Main Branch</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div>Account Holder: <span className="text-slate-900 font-bold">Aakash Verma</span></div>
                  <div>Account Status: <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">ACTIVE / FULL KYC COMPLIANT</span></div>
                  <div>Aadhaar Seeding: <span className="text-emerald-700 font-bold">SEEDED / READY FOR NPCI APBS MANDATE</span></div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('sms') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-emerald-800 font-bold text-xs">SMS GATEWAY LOG (VM-PFMSGV)</div>
                <div className="text-slate-400 text-[11px]">14-AUG-2026 14:32</div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 mt-2 font-mono text-xs shadow-2xs">
                  "Dear Aakash Verma, your DBT payment of Rs 48000 for Post-Matric Scholarship failed due to destination bank rejection BNS-410. Kindly contact your bank or update NPCI mandate."
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('epfo') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-red-700 font-bold text-xs">EPFO - CLAIM REJECTION ADVICE (FORM 19/10C)</div>
                <div className="text-slate-400 text-[11px]">Member: Pooja Sharma | UAN: 100982341120</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-300 inline-block font-mono">
                    Rejection Code: EPFO-REJ-DATE-MISMATCH
                  </div>
                  <div>Portal Exit Date: <span className="text-amber-800 font-bold">31/03/2023</span></div>
                  <div className="text-slate-600">Directive: Submit Joint Declaration under Revised SOP 2024.</div>
                </div>
              </div>
            )}

            {activeDoc?.filename.includes('relieving') && (
              <div className="space-y-2 text-slate-800 pt-1">
                <div className="text-indigo-900 font-bold text-xs">TECHVENTURES INDIA - RELIEVING CERTIFICATE</div>
                <div className="text-slate-400 text-[11px]">Employee: Pooja Sharma (TV-4412)</div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div>Date of Joining: <span className="text-slate-900 font-bold">01/08/2020</span></div>
                  <div>Date of Relieving / Exit: <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">15/04/2023</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Spatial Bounding Box */}
          {activeProvenance && activeProvenance.document_id === activeDoc?.id && activeProvenance.bounding_box && (
            <div
              className="absolute border-2 border-amber-500 bg-amber-500/15 rounded-md transition-all duration-200 pointer-events-none shadow-sm"
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

          {/* Provenance Snippet Footer */}
          {activeProvenance && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <div className="text-[10px] text-amber-800 uppercase font-bold flex items-center justify-between">
                <span>Verified Source Provenance</span>
                <span>Page {activeProvenance.page_number}</span>
              </div>
              <div className="text-slate-900 mt-1 font-mono text-[11px]">
                "{activeProvenance.extracted_text}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
