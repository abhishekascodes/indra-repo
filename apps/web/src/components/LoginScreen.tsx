import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Building2, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="h-screen w-screen bg-radial from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-6 select-none font-sans text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top National Infrastructure Badge */}
      <div className="w-full max-w-xl mb-5 flex items-center justify-between text-xs text-slate-400 font-medium px-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-semibold text-slate-200 tracking-wide text-xs">
            National Administrative Intelligence Sandbox
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono text-[10px] bg-slate-800/90 border border-slate-700 px-2.5 py-0.5 rounded-full text-emerald-400 font-bold">
            GATEWAY ONLINE
          </span>
        </div>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-xl tracking-tight text-white">INDRA</h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-400/10 text-amber-300 rounded-md border border-amber-400/30">
                    CORE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Autonomous Causal Execution Engine for Fragmented Public Services
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
              <span>DETERMINISTIC V1.0</span>
            </div>
          </div>
        </div>

        {/* Profile Selector - 2 Exact Authentic Domains */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Evaluation Profile
            </label>
            <span className="text-[10px] text-slate-500">1-Click Direct Entry</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Profile 1: Flagship DBT */}
            <div
              onClick={() => setSelectedProfile('dbt')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedProfile === 'dbt'
                  ? 'bg-slate-800/90 border-amber-500/80 ring-1 ring-amber-500/60 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-sm text-white">Aakash Verma</span>
                  <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                    FLAGSHIP DBT CASE (₹48,000)
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Post-Matric Scholarship Disbursal Blockade & Cyber Police Freeze
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span>Cyber Crime Notice</span>
                  <span>•</span>
                  <span>Canara Bank Freeze</span>
                  <span>•</span>
                  <span>NPCI APBS Error BNS-410</span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                selectedProfile === 'dbt' ? 'border-amber-400 bg-amber-500' : 'border-slate-700'
              }`}>
                {selectedProfile === 'dbt' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
              </div>
            </div>

            {/* Profile 2: EPFO */}
            <div
              onClick={() => setSelectedProfile('epfo')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedProfile === 'epfo'
                  ? 'bg-slate-800/90 border-indigo-500/80 ring-1 ring-indigo-500/60 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-sm text-white">Pooja Sharma</span>
                  <span className="text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40">
                    EPFO DOMAIN GENERALIZATION
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Form 19 Final PF Settlement Rejection
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span>Date of Exit Discrepancy</span>
                  <span>•</span>
                  <span>Employer ECR Contradiction</span>
                  <span>•</span>
                  <span>Joint Declaration SOP v3.0</span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                selectedProfile === 'epfo' ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
              }`}>
                {selectedProfile === 'epfo' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Entry CTA */}
        <button
          onClick={() => handleEnter(selectedProfile === 'dbt' ? 'dbt_failure' : 'epfo_claim')}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-2xl text-xs font-black tracking-widest uppercase flex items-center justify-center space-x-2.5 transition-all shadow-xl shadow-amber-500/20 active:scale-98 cursor-pointer"
        >
          <span>Enter Workspace ({selectedProfile === 'dbt' ? 'Aakash Verma' : 'Pooja Sharma'})</span>
          <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
        </button>

        {/* Footer Safety Notice */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Synthetic Case • Mock Government Institutions</span>
          </span>
          <span className="font-mono text-slate-400">ZERO REAL PII</span>
        </div>
      </div>
    </div>
  );
};
