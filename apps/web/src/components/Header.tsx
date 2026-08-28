import React, { useState } from 'react';
import {
  Shield, Clock, RotateCcw,
  Sparkles, Layers, FileText, Volume2, VolumeX, LogOut
} from 'lucide-react';
import type { Case, AgentState } from '../types';

interface HeaderProps {
  currentCase: Case | null;
  activeView: 'story' | 'graph' | 'evidence' | 'timeline';
  onSelectView: (view: 'story' | 'graph' | 'evidence' | 'timeline') => void;
  onAdvanceTime: (days: number) => void;
  onSelectDomain: (domainId: string) => void;
  onSimulateEvent: (eventType: string) => void;
  onExecuteAutopilot: () => void;
  onReset: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

const STATE_CONFIG: Record<AgentState, { label: string; bg: string; text: string; dot: string }> = {
  CASE_CREATED: { label: 'Case Initialized', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
  EVIDENCE_ANALYSIS: { label: 'Evidence Ingested', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
  ACTION_REQUIRED: { label: 'Action Required', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', dot: 'bg-amber-600' },
  USER_APPROVAL: { label: 'Awaiting Citizen Consent', bg: 'bg-amber-50 border-amber-400', text: 'text-amber-900', dot: 'bg-amber-600' },
  SUBMITTED: { label: 'Submitted to Portal', bg: 'bg-cyan-50 border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-600' },
  WAITING: { label: 'Waiting on Bank (15d SLA)', bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-800', dot: 'bg-yellow-600' },
  RESPONSE_RECEIVED: { label: 'Response Received', bg: 'bg-teal-50 border-teal-300', text: 'text-teal-800', dot: 'bg-teal-600' },
  VERIFICATION: { label: 'Verifying Settlement', bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  ESCALATION_REQUIRED: { label: 'SLA Breached - Escalated to CPGRAMS', bg: 'bg-red-50 border-red-300', text: 'text-red-700', dot: 'bg-red-600' },
  RESOLUTION: { label: 'Benefit Recovered & Credited', bg: 'bg-emerald-50 border-emerald-400', text: 'text-emerald-900', dot: 'bg-emerald-600' },
  BLOCKED: { label: 'Action Blocked', bg: 'bg-rose-50 border-rose-300', text: 'text-rose-700', dot: 'bg-rose-600' },
};

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  activeView,
  onSelectView,
  onAdvanceTime,
  onSelectDomain,
  onReset,
  onLogout,
  isLoading,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<'en' | 'hi'>('en');

  const stateCfg = currentCase
    ? STATE_CONFIG[currentCase.current_state] || { label: currentCase.current_state, bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' }
    : { label: 'Loading Case...', bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' };

  // Native Speech Synthesis for Case Briefing (Bilingual: English & Hindi)
  const toggleVoiceBriefing = () => {
    if (!currentCase) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();

      let text = '';
      if (audioLanguage === 'hi') {
        text = currentCase.current_state === 'RESOLUTION'
          ? `इंद्रा केस समाधान। नागरिक ${currentCase.citizen_name} के लिए अडतालीस हज़ार रुपये की छात्रवृत्ति सफलतापूर्वक बैंक खाते में जमा कर दी गई है।`
          : `इंद्रा नागरिक ब्रीफिंग। नागरिक: ${currentCase.citizen_name}। समस्या: ${currentCase.objective}। कारण: ${currentCase.blocker_summary}।`;
      } else {
        text = currentCase.current_state === 'RESOLUTION'
          ? `Case reference ${currentCase.id} for citizen ${currentCase.citizen_name} is successfully resolved. The benefit has been credited with official UTR settlement.`
          : `INDRA Case Briefing for citizen ${currentCase.citizen_name}. Issue: ${currentCase.objective}. Root Cause: ${currentCase.blocker_summary}.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (audioLanguage === 'hi') {
        utterance.lang = 'hi-IN';
      }
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 select-none z-30 shadow-xs flex flex-col">
      {/* Top Main Command Bar */}
      <div className="h-14 px-6 flex items-center justify-between">
        {/* Brand & Domain Toggle */}
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">INDRA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  ADMINISTRATIVE AGENCY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Multimodal Case Intelligence</p>
            </div>
          </div>

          {/* 3-Domain Segmented Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 space-x-1 text-xs font-semibold">
            <button
              onClick={() => onSelectDomain('dbt_failure')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                currentCase?.domain_id === 'dbt_failure'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              [1] DBT Scholarship
            </button>
            <button
              onClick={() => onSelectDomain('epfo_claim')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                currentCase?.domain_id === 'epfo_claim'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              [2] EPFO PF Claim
            </button>
            <button
              onClick={() => onSelectDomain('pmay_housing')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                currentCase?.domain_id === 'pmay_housing'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              [3] PMAY-G Housing
            </button>
          </div>
        </div>

        {/* Center: Live Case Status Badge */}
        <div className="hidden md:flex items-center space-x-3">
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center space-x-2 ${stateCfg.bg} ${stateCfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${stateCfg.dot} animate-pulse`} />
            <span>{stateCfg.label}</span>
          </div>

          {/* Voice Briefing Button */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={toggleVoiceBriefing}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                isPlayingAudio ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-200'
              }`}
              title="Multimodal Voice Briefing"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Voice Briefing'}</span>
            </button>
            <button
              onClick={() => setAudioLanguage(audioLanguage === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase"
              title="Toggle Language (EN/HI)"
            >
              {audioLanguage}
            </button>
          </div>
        </div>

        {/* Right: Fast Forward Clock & Logout */}
        <div className="flex items-center space-x-2">
          {/* Fast-Forward SLA */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => onAdvanceTime(15)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Advance time 15 days to test statutory SLA breach & CPGRAMS escalation"
            >
              +15d SLA
            </button>
          </div>

          {/* Reset Demo */}
          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
            title="Reset Case State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-200 cursor-pointer"
            title="Log Out (Return to Demo Login)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Full-Width View Switcher Tabs */}
      <div className="h-11 px-6 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onSelectView('story')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
              activeView === 'story'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Case Story & Action Hub</span>
          </button>

          <button
            onClick={() => onSelectView('graph')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
              activeView === 'graph'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Case Graph Topology</span>
          </button>

          <button
            onClick={() => onSelectView('evidence')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
              activeView === 'evidence'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Evidence Vault & Provenance</span>
          </button>

          <button
            onClick={() => onSelectView('timeline')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Chronology & Timeline</span>
          </button>
        </div>

        {/* Case Metadata Chip */}
        {currentCase && (
          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500">
            <span>Citizen: <strong className="text-slate-800">{currentCase.citizen_name}</strong></span>
            <span>•</span>
            <span className="font-mono text-slate-600">{currentCase.id}</span>
          </div>
        )}
      </div>
    </header>
  );
};
