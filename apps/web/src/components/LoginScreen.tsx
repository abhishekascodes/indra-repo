import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Building2 } from 'lucide-react';

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
    <div className="h-screen w-screen bg-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans">
      {/* Top Emblem Bar */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            National Administrative Sandbox
          </span>
        </div>
        <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">
          SYNTHETIC TESTBED
        </span>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-xl shadow-xs p-7 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-sm tracking-tight text-slate-900 font-mono">INDRA</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-300">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Citizen Case Intelligence & Administrative Agency</p>
            </div>
          </div>
        </div>

        {/* Profile Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Select Evaluation Profile
          </label>

          {/* Profile 1: Flagship DBT */}
          <div
            onClick={() => setSelectedProfile('dbt')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
              selectedProfile === 'dbt'
                ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs text-slate-900">Aakash Verma</span>
                <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                  FLAGSHIP
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                Post-Matric Scholarship DBT Failure (₹48,000)
              </div>
              <div className="text-[10px] text-slate-400">
                Cross-Domain: PFMS + NPCI APBS + Cyber Freeze
              </div>
            </div>
            <input
              type="radio"
              name="profile"
              checked={selectedProfile === 'dbt'}
              onChange={() => setSelectedProfile('dbt')}
              className="mt-1 accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Profile 2: EPFO */}
          <div
            onClick={() => setSelectedProfile('epfo')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
              selectedProfile === 'epfo'
                ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs text-slate-900">Pooja Sharma</span>
                <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-300">
                  SECOND DOMAIN
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                EPFO Form 19 Claim Settlement Blockade
              </div>
              <div className="text-[10px] text-slate-400">
                Date of Exit Conflict • Joint Declaration SOP 2024
              </div>
            </div>
            <input
              type="radio"
              name="profile"
              checked={selectedProfile === 'epfo'}
              onChange={() => setSelectedProfile('epfo')}
              className="mt-1 accent-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* 1-Click Entry Button */}
        <button
          onClick={() => handleEnter(selectedProfile === 'dbt' ? 'dbt_failure' : 'epfo_claim')}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold font-mono tracking-wide flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <span>ENTER WORKSPACE ({selectedProfile === 'dbt' ? 'AAKASH VERMA' : 'POOJA SHARMA'})</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {/* Audit Stamp */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Deterministic Sandbox</span>
          </span>
          <span>Zero Real PII Required</span>
        </div>
      </div>
    </div>
  );
};
