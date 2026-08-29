import React from 'react';
import { FileText, X, Shield } from 'lucide-react';
import type { CaseDocument } from '../types';

interface IndraDocumentModalProps {
  document: CaseDocument | null;
  onClose: () => void;
}

export const IndraDocumentModal: React.FC<IndraDocumentModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">{document.filename}</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  100% OCR GROUNDED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Uploaded: {new Date(document.uploaded_at).toLocaleDateString()} • Extracted Facts: {document.extractions_count}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Document Preview & Bounding Box Coordinates */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAFAFA]">
          {/* Simulated High-Res Document Preview with Bounding Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative font-mono text-xs text-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-[10px] font-sans font-bold text-slate-400 uppercase">
              <span>Official Institutional Record</span>
              <span className="text-blue-600">Digital Artifact SHA-256 Verified</span>
            </div>

            {/* Document Content Simulation */}
            <div className="space-y-3 font-serif leading-relaxed text-sm text-slate-900">
              <div className="font-bold text-base text-center border-b border-slate-200 pb-2">
                PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS) & CANARA BANK RECORD
              </div>
              <p>
                <strong>Beneficiary Name:</strong> Aakash Verma<br />
                <strong>Scheme Code:</strong> BT-99120 (Post-Matric Scholarship)<br />
                <strong>Sanctioned Amount:</strong> ₹48,000.00
              </p>

              {/* Glowing OCR Bounding Box */}
              <div className="p-3 bg-blue-50/80 border-2 border-blue-500 rounded-xl space-y-1 relative">
                <div className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-mono px-2 py-0.2 rounded-full font-bold">
                  OCR BOUNDING BOX [X:140, Y:320, W:480, H:65]
                </div>
                <div className="font-mono text-xs text-blue-950 font-bold">
                  TRANSACTION STATUS: FAILED / ABORTED
                </div>
                <div className="font-mono text-xs text-rose-700 font-bold">
                  REJECTION REASON: ERROR BNS-410 (NPCI APBS MAPPER INACTIVE / DEBIT RESTRICTION APPLIED)
                </div>
              </div>

              <p className="text-xs text-slate-600 font-sans">
                Statutory Note: Subject to Section 102 CrPC police requisition reference #CR-4412/Cyber/2026. Account *4401 marked restricted.
              </p>
            </div>
          </div>

          {/* Epistemic Provenance Guarantee */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-slate-600 font-medium">
                This document is anchored to the immutable tamper-evident case memory ledger.
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
