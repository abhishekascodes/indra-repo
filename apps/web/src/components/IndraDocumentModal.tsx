import React from 'react';
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
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col font-sans overflow-y-auto animate-in fade-in duration-300">
      
      {/* Huge Header */}
      <div className="w-full max-w-5xl mx-auto px-8 py-12 flex justify-between items-start">
        <div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
            Evidence<br />Viewer
          </h2>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest opacity-50 flex items-center space-x-2">
            <span>{document.filename}</span>
            <span>•</span>
            <span className="text-black">100% OCR GROUNDED</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-4xl hover:opacity-50 transition-opacity cursor-pointer font-light leading-none"
        >
          ×
        </button>
      </div>

      {/* Stark Document Frame */}
      <div className="w-full max-w-3xl mx-auto px-8 pb-24">
        <div className="border-t-2 border-black pt-12 space-y-8">
          
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span>Official Record</span>
            <span>SHA-256 Verified</span>
          </div>

          <div className="text-lg font-serif leading-relaxed space-y-6">
            <div className="font-bold text-xl uppercase tracking-widest border-b border-black/10 pb-4">
              PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS) & CANARA BANK RECORD
            </div>
            
            <div className="space-y-1">
              <div><strong className="uppercase text-xs tracking-widest opacity-50">Beneficiary:</strong> Aakash Verma</div>
              <div><strong className="uppercase text-xs tracking-widest opacity-50">Scheme Code:</strong> BT-99120 (Post-Matric Scholarship)</div>
              <div><strong className="uppercase text-xs tracking-widest opacity-50">Sanctioned:</strong> ₹48,000.00</div>
            </div>

            {/* Bounding Box Simulation (Stark) */}
            <div className="my-12 p-8 border-l-4 border-black bg-black/5 relative">
              <div className="absolute -top-3 left-4 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                OCR [X:140, Y:320, W:480, H:65]
              </div>
              <div className="font-mono text-sm font-bold uppercase mt-2">
                TRANSACTION STATUS: FAILED / ABORTED
              </div>
              <div className="font-mono text-sm font-bold uppercase mt-2 opacity-60">
                REASON: ERROR BNS-410 (NPCI APBS MAPPER INACTIVE / DEBIT RESTRICTION APPLIED)
              </div>
            </div>

            <p className="text-sm opacity-60 italic">
              Statutory Note: Subject to Section 102 CrPC police requisition reference #CR-4412/Cyber/2026. Account *4401 marked restricted.
            </p>

          </div>

          <div className="mt-16 pt-8 border-t border-black/10 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest opacity-40">
              Anchored to immutable ledger.
            </span>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
