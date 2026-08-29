import React, { useState } from 'react';
import { Shield, ArrowRight, Building2, CheckCircle2, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (domainId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedProfile, setSelectedProfile] = useState<'dbt' | 'epfo'>('dbt');

  const handleEnter = (domain: 'dbt_failure' | 'epfo_claim') => {
    localStorage.setItem('indra_auth', 'true');
    localStorage.setItem('indra_domain', domain);
    onLogin(domain);
  };

  return (
    <div className="h-screen w-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 select-none font-sans text-slate-900 relative overflow-hidden">
      {/* Background Subtle Dot Matrix Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top National Infrastructure Badge */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between text-xs text-slate-600 font-medium px-2 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <span className="font-bold text-slate-800 tracking-wide text-xs">
            National Administrative Intelligence Sandbox
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[10px] bg-white border border-slate-300 px-2.5 py-0.5 rounded-full text-emerald-700 font-bold shadow-2xs">
            GATEWAY ONLINE
          </span>
        </div>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-amber-400 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-xl tracking-tight text-slate-900">INDRA</h1>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    CORE
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Autonomous Causal Execution Engine for Fragmented Public Services
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-[11px] font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
              <span>DETERMINISTIC V1.0</span>
            </div>
          </div>
        </div>

        {/* Profile Selector - 2 Exact Authentic Domains */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Select Evaluation Profile
            </label>
            <span className="text-[10px] text-slate-400">1-Click Direct Entry</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Profile 1: Flagship DBT */}
            <div
              onClick={() => setSelectedProfile('dbt')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedProfile === 'dbt'
                  ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-sm text-slate-900">Aakash Verma</span>
                  <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    FLAGSHIP DBT CASE (₹48,000)
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  Post-Matric Scholarship Disbursal Blockade & Cyber Police Freeze
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span>Cyber Crime Notice</span>
                  <span>•</span>
                  <span>Canara Freeze</span>
                  <span>•</span>
                  <span>NPCI Mapper</span>
                  <span>•</span>
                  <span>PFMS BNS-410</span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                selectedProfile === 'dbt' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
              }`}>
                {selectedProfile === 'dbt' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Profile 2: Generalization EPFO */}
            <div
              onClick={() => setSelectedProfile('epfo')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedProfile === 'epfo'
                  ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-sm text-slate-900">Pooja Sharma</span>
                  <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                    EPFO PF SETTLEMENT
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  Form 19 Claim Settlement Blockade (Exit Date Discrepancy)
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span>Relieving Letter (31 Oct)</span>
                  <span>•</span>
                  <span>ECR Return (15 Nov)</span>
                  <span>•</span>
                  <span>Joint Declaration SOP v3.0</span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                selectedProfile === 'epfo' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
              }`}>
                {selectedProfile === 'epfo' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Enter Action Button */}
        <div className="pt-2">
          <button
            onClick={() => handleEnter(selectedProfile === 'dbt' ? 'dbt_failure' : 'epfo_claim')}
            className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-slate-950/10 transition-all active:scale-98 cursor-pointer"
          >
            <span>Enter National Administrative Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Synthetic Disclaimer */}
        <div className="pt-2 border-t border-slate-200 text-center">
          <p className="text-[10px] font-mono text-slate-400">
            DEMO ENVIRONMENT • SYNTHETIC ADMINISTRATIVE DATA • ZERO REAL GOVERNMENT ACCESS
          </p>
        </div>
      </div>
    </div>
  );
};
