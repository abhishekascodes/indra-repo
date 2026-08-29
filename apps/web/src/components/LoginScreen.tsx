import React, { useState } from 'react';
import { Landmark, Users, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

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
    <div className="min-h-screen w-screen bg-[#FAFAFA] flex flex-col justify-between p-6 sm:p-10 select-none font-sans text-slate-900 relative overflow-x-hidden">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-400">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-slate-950 leading-none">
              INDRA
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              Administrative Intelligence for Citizens
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">National Sandbox Gateway</span>
          <span className="flex items-center space-x-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </span>
        </div>
      </div>

      {/* Main Center Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-8">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          {/* Welcome Header */}
          <div className="border-b border-slate-100 pb-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                SOVEREIGN HYPERVISOR V1.0
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Deterministic Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              National Administrative Sandbox
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select an authentic evaluation case study to reconstruct causal proof and restore administrative certainty.
            </p>
          </div>

          {/* Case Study Selection Tiles */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Select Case Workspace
            </label>

            {/* Profile 1: DBT Flagship */}
            <div
              onClick={() => setSelectedProfile('dbt')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                selectedProfile === 'dbt'
                  ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-100 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">Aakash Verma</span>
                    <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      FLAGSHIP DBT (₹48,000)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Post-Matric Scholarship Blockade & Cyber Account Freeze
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 pt-0.5">
                    <span>Canara Freeze</span>
                    <span>•</span>
                    <span>NPCI APBS Mapper</span>
                    <span>•</span>
                    <span>PFMS BNS-410</span>
                  </div>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                selectedProfile === 'dbt' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
              }`}>
                {selectedProfile === 'dbt' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Profile 2: EPFO Claim */}
            <div
              onClick={() => setSelectedProfile('epfo')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                selectedProfile === 'epfo'
                  ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-100 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">Pooja Sharma</span>
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      EPFO CLAIM (₹3.12L)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Provident Fund Claim Rejection & Exit Date Conflict
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 pt-0.5">
                    <span>UAN 1009288192</span>
                    <span>•</span>
                    <span>Relieving Letter vs Master</span>
                    <span>•</span>
                    <span>Joint Declaration</span>
                  </div>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                selectedProfile === 'epfo' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
              }`}>
                {selectedProfile === 'epfo' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <div className="pt-2">
            <button
              onClick={() => handleEnter(selectedProfile === 'dbt' ? 'dbt_failure' : 'epfo_claim')}
              className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <span>Enter National Administrative Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 justify-center pt-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Simulated sandbox with real statutory rules and deterministic state machines.</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-slate-400">
        <div>INDRA v1.0.0 &nbsp;|&nbsp; Persistent Administrative Intelligence</div>
        <div>Built for citizens. By citizens.</div>
      </div>
    </div>
  );
};
