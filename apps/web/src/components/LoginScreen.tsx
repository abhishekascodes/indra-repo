import React from 'react';
import { Landmark, Shield, FileText, ChevronRight, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (domainId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col select-none">
      
      {/* Official Header */}
      <header className="w-full bg-slate-900 text-white px-6 sm:px-8 py-4 flex items-center space-x-3 shadow-md">
        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
          <Landmark className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">National Administrative Sandbox</h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">
            Sovereign Identity & Entitlement Engine (INDRA)
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 grid sm:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Official Notice */}
        <div className="sm:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
            <Shield className="w-4 h-4" />
            <span>AUTHORISED ACCESS ONLY</span>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">
            Secure Digital Infrastructure
          </h2>
          
          <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-blue-600 pl-4">
            Welcome to the INDRA Administrative Sandbox. This gateway provides secure evaluation access to simulated case files for restoring citizen entitlements. All interactions are deterministically mapped against binding statutory directives.
          </p>
          
          <div className="pt-4 flex items-center space-x-2 text-[11px] text-slate-500 font-medium uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>

        {/* Right Column: Case Selection Cards */}
        <div className="sm:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Select Test Dossier</h3>
            <p className="text-xs text-slate-500 mt-1">Authenticate into a simulated resolution environment.</p>
          </div>

          <div className="space-y-4">
            {/* Case 1 */}
            <div 
              onClick={() => onLogin('dbt_failure')}
              className="group flex items-start justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900">Aakash Verma</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">DBT SCHOLARSHIP</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Post-Matric Scholarship Blockade & Cyber Account Freeze</p>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1.5">Entitlement: ₹48,000.00</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-2" />
            </div>

            {/* Case 2 */}
            <div 
              onClick={() => onLogin('epfo_claim')}
              className="group flex items-start justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-900">Pooja Sharma</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">EPFO CLAIM</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Provident Fund Claim Rejection & Exit Date Conflict</p>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1.5">Entitlement: ₹3,12,000.00</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mt-2" />
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="w-full bg-slate-200/50 border-t border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div>Version 1.0.0 (Build 2026.08)</div>
        <div>Department of Administrative Reforms</div>
      </footer>
    </div>
  );
};
