import React, { useState } from 'react';
import {
  Shield, Clock, RotateCcw,
  Sparkles, Layers, FileText, Volume2, VolumeX, LogOut,
  Cpu, Sliders, Play, AlertTriangle, Bug, History, Database,
  ShieldCheck, ShieldAlert, User, FileCheck, GitCompare, Fingerprint, Zap, Network
} from 'lucide-react';
import type { Case, AgentState } from '../types';
import { ArchitectureView } from './ArchitectureView';
import { PolicyGuardrailsModal } from './PolicyGuardrailsModal';
import { RedTeamLabModal } from './RedTeamLabModal';

export type PersonaType = 'citizen' | 'auditor' | 'engineer';

export type ActiveViewType =
  | 'story'
  | 'debugger'
  | 'replay'
  | 'graph'
  | 'evidence'
  | 'memory'
  | 'timeline'
  | 'epistemic_ledger'
  | 'eru'
  | 'identity'
  | 'counterfactual'
  | 'systemic';

interface HeaderProps {
  currentCase: Case | null;
  persona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  activeView: ActiveViewType;
  onSelectView: (view: ActiveViewType) => void;
  onAdvanceTime: (days: number) => void;
  onSelectDomain: (domainId: string) => void;
  onSimulateEvent?: (eventType: string) => void;
  onExecuteAutopilot?: () => void;
  onReset: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

const STATE_CONFIG: Record<AgentState, { label: string; bg: string; text: string; dot: string }> = {
  CASE_CREATED: { label: 'Case Initialized', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
  EVIDENCE_ANALYSIS: { label: 'Evidence Analyzed', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
  ACTION_REQUIRED: { label: 'Action Required', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', dot: 'bg-amber-600' },
  USER_APPROVAL: { label: 'Awaiting Citizen Consent', bg: 'bg-amber-50 border-amber-400', text: 'text-amber-900', dot: 'bg-amber-600' },
  SUBMITTED: { label: 'Submitted to Portal', bg: 'bg-cyan-50 border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-600' },
  WAITING: { label: 'Waiting for Institution (15d SLA)', bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-900 font-extrabold', dot: 'bg-yellow-600' },
  RESPONSE_RECEIVED: { label: 'Response Received', bg: 'bg-teal-50 border-teal-300', text: 'text-teal-800', dot: 'bg-teal-600' },
  VERIFICATION: { label: 'Verifying Settlement', bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  ESCALATION_REQUIRED: { label: 'SLA Breached - Escalated to CPGRAMS', bg: 'bg-red-50 border-red-300', text: 'text-red-700 font-extrabold', dot: 'bg-red-600' },
  RESOLUTION: { label: 'Benefit Recovered & Credited', bg: 'bg-emerald-50 border-emerald-400', text: 'text-emerald-900 font-black', dot: 'bg-emerald-600' },
  BLOCKED: { label: 'Action Blocked', bg: 'bg-rose-50 border-rose-300', text: 'text-rose-700', dot: 'bg-rose-600' },
};

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  persona,
  onSelectPersona,
  activeView,
  onSelectView,
  onAdvanceTime,
  onSelectDomain,
  onSimulateEvent,
  onReset,
  onLogout,
  isLoading,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false);
  const [showRedTeamModal, setShowRedTeamModal] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const stateCfg = currentCase
    ? STATE_CONFIG[currentCase.current_state] || { label: currentCase.current_state, bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' }
    : { label: 'Loading Case...', bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' };

  const isWaiting = currentCase?.current_state === 'WAITING';

  // Voice briefing
  const toggleVoiceBriefing = () => {
    if (!currentCase) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = currentCase.current_state === 'RESOLUTION'
        ? `Great news, ${currentCase.citizen_name}! Your case is successfully resolved. The 48,000 rupee benefit has been credited to your active State Bank of India account.`
        : `Hello ${currentCase.citizen_name}. INDRA has identified why your payment was delayed. Your Canara Bank account was restricted, but we can safely redirect your payment to your active State Bank of India account. Please click authorize below to proceed.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 select-none z-30 shadow-xs flex flex-col font-sans">
        {/* Top Main Command Bar */}
        <div className="h-14 px-6 flex items-center justify-between">
          {/* Brand & Domain Toggle */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900">INDRA</span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    HYPERVISOR
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Sovereign Citizen Agency</p>
              </div>
            </div>

            {/* Persona Switcher (Citizen vs Auditor vs Engineer) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 space-x-1 text-xs">
              <button
                onClick={() => {
                  onSelectPersona('citizen');
                  onSelectView('story');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  persona === 'citizen'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Citizen Mode (Ultra-simple, human-friendly)"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Citizen View</span>
              </button>

              <button
                onClick={() => {
                  onSelectPersona('auditor');
                  onSelectView('epistemic_ledger');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  persona === 'auditor'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Auditor Mode (Evidence, provenance, and legal verification)"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auditor View</span>
              </button>

              <button
                onClick={() => {
                  onSelectPersona('engineer');
                  onSelectView('graph');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  persona === 'engineer'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Engineer Mode (Causal graph, DevTools debugger, flight recorder, and red team lab)"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                <span>Engineer View</span>
              </button>
            </div>

            {/* Exact 2 Domains Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 space-x-1 text-xs font-semibold">
              <button
                onClick={() => onSelectDomain('dbt_failure')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentCase?.domain_id === 'dbt_failure'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [1] DBT / PFMS (Aakash Verma)
              </button>
              <button
                onClick={() => onSelectDomain('epfo_claim')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentCase?.domain_id === 'epfo_claim'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [2] EPFO (Pooja Sharma)
              </button>
            </div>
          </div>

          {/* Center: Live Case Status Badge */}
          <div className="hidden md:flex items-center space-x-3">
            <div className={`px-4 py-1.5 rounded-full border text-xs flex items-center space-x-2 shadow-2xs ${stateCfg.bg} ${stateCfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${stateCfg.dot} animate-pulse`} />
              <span>{isWaiting ? 'INDRA IS WAITING FOR THE INSTITUTION (SLA: 15 DAYS)' : stateCfg.label}</span>
            </div>

            {/* Voice Briefing Button */}
            <button
              onClick={toggleVoiceBriefing}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all border border-slate-200 cursor-pointer ${
                isPlayingAudio ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Voice Briefing for Citizen"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Voice'}</span>
            </button>

            {/* Guardrails Button */}
            <button
              onClick={() => setShowGuardrailsModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              title="Inspect Formal Policy-as-Code Guardrails"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guardrails</span>
            </button>

            {/* Red Team Simulator Button */}
            <button
              onClick={() => setShowRedTeamModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              title="Open Red Team Adversarial Simulator"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Red Team</span>
            </button>

            {/* Architecture Blueprint Button */}
            <button
              onClick={() => setShowArchModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              title="Inspect INDRA Architecture Blueprint"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span>Architecture</span>
            </button>
          </div>

          {/* Right: Demo Control Center & Logout */}
          <div className="flex items-center space-x-2">
            {/* Demo Control Center Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Demo Control Center"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Controls</span>
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    Temporal & Institutional Controls
                  </div>
                  <button
                    onClick={() => { onAdvanceTime(5); setShowDemoMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Advance +5 Days</span>
                  </button>
                  <button
                    onClick={() => { onAdvanceTime(15); setShowDemoMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-xl font-bold text-red-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <span>Fast-Forward +15d (SLA Expiry)</span>
                  </button>
                  <button
                    onClick={() => { onSimulateEvent?.('RESPONSE_RECEIVED'); setShowDemoMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-xl font-bold text-teal-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-500" />
                    <span>Simulate Institutional Response</span>
                  </button>
                  <button
                    onClick={() => { onSimulateEvent?.('NO_RESPONSE'); setShowDemoMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-xl font-bold text-amber-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Simulate No Response</span>
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => { onReset(); setShowDemoMenu(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-red-50 rounded-xl font-bold text-slate-700 flex items-center space-x-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Reset Case State</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fast-Forward SLA Shortcut */}
            <button
              onClick={() => onAdvanceTime(15)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
              title="Fast-forward 15 days to test statutory SLA breach"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>+15d SLA</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
              title="Reset Case to Initial State"
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

        {/* Bottom Adaptive View Switcher Tabs based on Active Persona */}
        <div className="h-11 px-6 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1">
            {/* 1. CITIZEN PERSONA TABS */}
            {persona === 'citizen' && (
              <>
                <button
                  onClick={() => onSelectView('story')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'story'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>My Case & Solution</span>
                </button>

                <button
                  onClick={() => onSelectView('evidence')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'evidence'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>My Documents ({currentCase?.documents?.length || 0})</span>
                </button>

                <button
                  onClick={() => onSelectView('timeline')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'timeline'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Status Timeline</span>
                </button>
              </>
            )}

            {/* 2. AUDITOR PERSONA TABS */}
            {persona === 'auditor' && (
              <>
                <button
                  onClick={() => onSelectView('epistemic_ledger')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'epistemic_ledger'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Epistemic Fact Ledger</span>
                </button>

                <button
                  onClick={() => onSelectView('evidence')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'evidence'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Evidence Vault & Provenance</span>
                </button>

                <button
                  onClick={() => onSelectView('timeline')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'timeline'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bitemporal Timeline & SLAs</span>
                </button>

                <button
                  onClick={() => onSelectView('memory')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'memory'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Persistent Case Memory</span>
                </button>
              </>
            )}

            {/* 3. ENGINEER PERSONA TABS */}
            {persona === 'engineer' && (
              <>
                <button
                  onClick={() => onSelectView('graph')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'graph'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Causal Case Graph</span>
                </button>

                <button
                  onClick={() => onSelectView('debugger')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'debugger'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Debugger</span>
                </button>

                <button
                  onClick={() => onSelectView('replay')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'replay'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Flight Recorder (Replay)</span>
                </button>

                <button
                  onClick={() => onSelectView('eru')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'eru'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Action Graph (ERU)</span>
                </button>

                <button
                  onClick={() => onSelectView('identity')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'identity'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 text-teal-500" />
                  <span>Identity Entropy</span>
                </button>

                <button
                  onClick={() => onSelectView('counterfactual')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'counterfactual'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-purple-500" />
                  <span>What-If Twin</span>
                </button>

                <button
                  onClick={() => onSelectView('systemic')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                    activeView === 'systemic'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Network className="w-3.5 h-3.5 text-rose-500" />
                  <span>Systemic Failure Graph</span>
                </button>
              </>
            )}
          </div>

          {/* Case Metadata Chip */}
          {currentCase && (
            <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500 flex-shrink-0">
              <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">
                SYNTHETIC ENVIRONMENT
              </span>
              <span>Beneficiary: <strong className="text-slate-900">{currentCase.citizen_name}</strong></span>
              <span>•</span>
              <span className="font-mono text-slate-600">{currentCase.id}</span>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showArchModal && (
        <ArchitectureView
          activeDomainId={currentCase?.domain_id || 'dbt_failure'}
          onClose={() => setShowArchModal(false)}
        />
      )}

      {showGuardrailsModal && (
        <PolicyGuardrailsModal
          currentCase={currentCase!}
          onClose={() => setShowGuardrailsModal(false)}
        />
      )}

      {showRedTeamModal && (
        <RedTeamLabModal
          currentCase={currentCase!}
          onClose={() => setShowRedTeamModal(false)}
        />
      )}
    </>
  );
};
