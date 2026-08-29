import React from 'react';
import { Award, Shield } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white border-2 border-emerald-500 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-center">
        {/* Certificate Banner */}
        <div className="p-8 bg-emerald-50/50 border-b border-emerald-100 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              OFFICIAL SETTLEMENT RECORD
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
              ADMINISTRATIVE RESOLUTION CERTIFICATE
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Issued under the Sovereign Autonomous Administrative Intelligence Protocol.
            </p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="p-6 bg-[#FAFAFA] space-y-4 text-left font-mono text-xs text-slate-800">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400 font-sans">Case Identification:</span>
              <span className="font-bold text-slate-950">{currentCase.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400 font-sans">Beneficiary Citizen:</span>
              <span className="font-bold text-slate-950">{currentCase.citizen_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400 font-sans">Entitlement Restored:</span>
              <span className="font-bold text-emerald-700">{isDbt ? '₹48,000.00' : '₹3,12,000.00'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400 font-sans">Treasury UTR Reference:</span>
              <span className="font-bold text-blue-700 font-mono">PFMS-UTR-34F5BBFFF2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Settlement Timestamp:</span>
              <span className="font-bold text-slate-700">{new Date().toISOString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-sans">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Immutable cryptographic proof verified.</span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
