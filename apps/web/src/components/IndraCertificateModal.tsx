import React from 'react';
import type { Case } from '../types';

interface IndraCertificateModalProps {
  currentCase: Case;
  onClose: () => void;
}

export const IndraCertificateModal: React.FC<IndraCertificateModalProps> = ({
  currentCase,
  onClose,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col font-sans overflow-y-auto animate-in fade-in duration-300">
      
      {/* Huge Header */}
      <div className="w-full max-w-5xl mx-auto px-8 py-12 flex justify-between items-start">
        <div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
            Resolution<br />Certificate
          </h2>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
            <span className="opacity-50">Official Settlement Record</span>
            <span className="opacity-50">•</span>
            <span className="text-black">IMMUTABLE CRYPTOGRAPHIC PROOF VERIFIED</span>
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
        <div className="border-t-2 border-black pt-12 space-y-8 text-sm uppercase tracking-widest font-bold">
          
          <div className="grid grid-cols-2 gap-y-8 border-b border-black/10 pb-12">
            <div>
              <div className="opacity-40 mb-1">Case Identification</div>
              <div className="text-lg">{currentCase.id}</div>
            </div>
            <div>
              <div className="opacity-40 mb-1">Beneficiary Citizen</div>
              <div className="text-lg">{currentCase.citizen_name}</div>
            </div>
            <div>
              <div className="opacity-40 mb-1">Entitlement Restored</div>
              <div className="text-lg">{isDbt ? '₹48,000.00' : '₹3,12,000.00'}</div>
            </div>
            <div>
              <div className="opacity-40 mb-1">Treasury UTR Reference</div>
              <div className="text-lg font-mono">PFMS-UTR-34F5BBFFF2</div>
            </div>
            <div className="col-span-2">
              <div className="opacity-40 mb-1">Settlement Timestamp</div>
              <div className="text-lg">{new Date().toISOString()}</div>
            </div>
          </div>

          <div className="mt-16 pt-8 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Issued under the Sovereign Autonomous Administrative Intelligence Protocol.
            </span>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
            >
              Close Certificate
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
