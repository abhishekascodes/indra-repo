import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Building2, CheckCircle2 } from 'lucide-react';

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
    <div className="h-screen w-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-6 select-none font-sans">
      {/* Top Emblem Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-slate-800 tracking-wide text-xs">
            National Administrative Intelligence Sandbox
          </span>
        </div>
        <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">
          EVALUATOR TESTBED
        </span>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900">INDRA</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                  ENTERPRISE CORE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Multimodal Citizen Case Intelligence & Administrative Agency
              </p>
            </div>
          </div>
        </div>

        {/* Profile Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Select Evaluation Profile
          </label>

          {/* Profile 1: Flagship DBT */}
          <div
            onClick={() => setSelectedProfile('dbt')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              selectedProfile === 'dbt'
                ? 'bg-slate-50/80 border-slate-900 ring-1 ring-slate-900 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">Aakash Verma</span>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  FLAGSHIP CASE
                </span>
              </div>
              <div className="text-xs text-slate-700 font-medium">
                Post-Matric Scholarship DBT Blockade (₹48,000)
              </div>
              <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                <span>PFMS Central Treasury</span>
                <span>•</span>
                <span>NPCI APBS Gateway</span>
                <span>•</span>
                <span>Cyber Police Lien</span>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
              selectedProfile === 'dbt' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
            }`}>
              {selectedProfile === 'dbt' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>

          {/* Profile 2: EPFO */}
          <div
            onClick={() => setSelectedProfile('epfo')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              selectedProfile === 'epfo'
                ? 'bg-slate-50/80 border-slate-900 ring-1 ring-slate-900 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">Pooja Sharma</span>
                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                  SECOND DOMAIN
                </span>
              </div>
              <div className="text-xs text-slate-700 font-medium">
                EPFO Form 19 Claim Settlement Blockade
              </div>
              <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                <span>Date of Exit Conflict</span>
                <span>•</span>
                <span>Joint Declaration Policy (SOP 2024)</span>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
              selectedProfile === 'epfo' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
            }`}>
              {selectedProfile === 'epfo' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>
        </div>

        {/* 1-Click Entry CTA */}
        <button
          onClick={() => handleEnter(selectedProfile === 'dbt' ? 'dbt_failure' : 'epfo_claim')}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer"
        >
          <span>Enter Workspace ({selectedProfile === 'dbt' ? 'Aakash Verma' : 'Pooja Sharma'})</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Footer Audit Stamp */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Deterministic Administrative Core</span>
          </span>
          <span>Zero Real PII Required</span>
        </div>
      </div>
    </div>
  );
};
