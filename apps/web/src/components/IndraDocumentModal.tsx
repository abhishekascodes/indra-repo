import React from 'react';
import { FileText, X, Shield, Download, Printer } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col font-sans text-slate-900">
      
      {/* Viewer Toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 sm:px-6 shadow-md flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-medium tracking-wide">{document.filename}</h2>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-900/50 border border-blue-700 text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded">
            Official Record
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors hidden sm:block">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors hidden sm:block">
            <Printer className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block" />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-rose-500/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-start justify-center">
        
        {/* The "Paper" */}
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm min-h-[800px] relative">
          
          {/* Official Letterhead Strip */}
          <div className="h-3 w-full bg-blue-800 rounded-t-sm" />
          
          <div className="p-10 sm:p-16 space-y-8">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 uppercase tracking-tight">
                  Public Financial Management System
                </h1>
                <p className="text-sm text-slate-600 font-serif mt-1">Joint Record with Canara Bank</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-[10px] text-slate-500 font-mono">Doc ID: {document.id.toUpperCase()}</div>
                <div className="text-[10px] text-slate-500 font-mono">Date: {new Date(document.uploaded_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6 text-sm font-serif text-slate-800 leading-relaxed">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beneficiary Name</div>
                  <div className="font-semibold">Aakash Verma</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheme Code</div>
                  <div className="font-semibold">BT-99120 (Post-Matric Scholarship)</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sanctioned Amount</div>
                  <div className="font-semibold">₹48,000.00</div>
                </div>
              </div>

              {/* Bounding Box Highlight */}
              <div className="mt-8 relative">
                {/* The Box */}
                <div className="absolute -inset-4 border-2 border-amber-500 bg-amber-50/30 rounded-lg pointer-events-none" />
                <div className="absolute -top-7 -left-4 bg-amber-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-t">
                  OCR EXTRACTION: [X:140, Y:320, W:480, H:65]
                </div>
                
                <div className="relative p-2 space-y-2">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    TRANSACTION STATUS: FAILED / ABORTED
                  </div>
                  <div className="font-mono text-sm font-bold text-rose-700">
                    REASON: ERROR BNS-410 (NPCI APBS MAPPER INACTIVE / DEBIT RESTRICTION APPLIED)
                  </div>
                </div>
              </div>

              <div className="pt-8 text-xs text-slate-500 italic border-t border-slate-200 mt-12">
                Statutory Note: Subject to Section 102 CrPC police requisition reference #CR-4412/Cyber/2026. Account *4401 marked restricted.
              </div>
            </div>
          </div>

          {/* Verification Badge Footer */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-50 border-t border-slate-200 rounded-b-sm flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
              <Shield className="w-4 h-4" />
              <span>Cryptographically verified against central ledger.</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              SHA-256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
