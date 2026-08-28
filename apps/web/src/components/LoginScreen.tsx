import React, { useState } from 'react';
import { Shield, Sparkles, Phone, KeyRound, ArrowRight, Lock, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (citizenName: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [useOtpFlow, setUseOtpFlow] = useState(false);
  const [phone, setPhone] = useState('+91 90000 00000');
  const [otp, setOtp] = useState('123456');

  const handle1ClickLogin = () => {
    localStorage.setItem('indra_auth', 'true');
    localStorage.setItem('indra_citizen', 'Aakash Verma');
    onLogin('Aakash Verma');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('indra_auth', 'true');
    localStorage.setItem('indra_citizen', 'Aakash Verma');
    onLogin('Aakash Verma');
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex items-center justify-center space-x-1.5 pt-1">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">INDRA</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              CITIZEN AGENCY
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Persistent Multimodal Citizen Case Intelligence
          </p>
        </div>

        {/* Synthetic Environment Notice */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
            DEMO / SYNTHETIC ENVIRONMENT
          </div>
          <p className="text-[11px] text-amber-900 leading-snug">
            Zero real personal data required. Evaluator quick-access mode active.
          </p>
        </div>

        {/* 1-CLICK INSTANT ENTRY (Primary CTA for Evaluators/Judges) */}
        {!useOtpFlow ? (
          <div className="space-y-4">
            <button
              onClick={handle1ClickLogin}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center space-x-2.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Enter Demo Citizen (Aakash Verma)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">or mock phone OTP</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={() => setUseOtpFlow(true)}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-200 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Use Mock Mobile OTP Gate</span>
            </button>
          </div>
        ) : (
          /* OPTIONAL MOCK OTP FLOW */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-3 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Mock Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Mock OTP (Default: 123456)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Verify & Enter Flagship Case</span>
            </button>

            <button
              type="button"
              onClick={() => setUseOtpFlow(false)}
              className="w-full text-center text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              Back to 1-Click Instant Login
            </button>
          </form>
        )}

        {/* Security & Synthetic Guarantee Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Local synthetic session • No real credentials stored</span>
        </div>
      </div>
    </div>
  );
};
