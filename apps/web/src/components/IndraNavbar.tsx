import React from 'react';
import {
  Sliders, RotateCcw, Volume2, VolumeX,
  ChevronDown, CheckCircle2, FileText
} from 'lucide-react';
import type { Case } from '../types';

interface IndraNavbarProps {
  currentCase: Case;
  onSelectCase: (caseId: string) => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onOpenPresenter: () => void;
  onReset: () => void;
  onOpenPetition: () => void;
}

export const IndraNavbar: React.FC<IndraNavbarProps> = ({
  currentCase,
  onSelectCase,
  isPlayingAudio,
  onToggleAudio,
  onOpenPresenter,
  onReset,
  onOpenPetition,
}) => {
  const isDbt = currentCase.domain_id === 'dbt_failure';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs font-sans select-none">
      {/* Left: Brand Emblem */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-xs">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-black tracking-tight text-slate-950">INDRA</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
              Sovereign AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
            Administrative Intelligence for Citizens
          </p>
        </div>
      </div>

      {/* Center: Active Case Switcher */}
      <div className="relative group">
        <button
          className="flex items-center space-x-2.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          aria-haspopup="true"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="max-w-[200px] sm:max-w-[280px] truncate">
            {isDbt ? 'Aakash Verma • DBT Scholarship (₹48,000)' : 'Pooja Sharma • EPFO Claim (₹3.12L)'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
        </button>

        {/* Dropdown Menu */}
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block transition-all z-50 animate-in fade-in-50 zoom-in-95">
          <div className="text-[10px] font-black uppercase text-slate-400 px-3 py-1.5">
            Select Evaluation Domain
          </div>
          <button
            onClick={() => onSelectCase('case-flagship-dbt-8821')}
            className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between cursor-pointer ${
              isDbt ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div>
              <div className="font-bold">Aakash Verma (Flagship DBT)</div>
              <div className="text-[10px] text-slate-500 font-normal">₹48,000 Post-Matric Scholarship Blockade</div>
            </div>
            {isDbt && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
          </button>

          <button
            onClick={() => onSelectCase('case-epfo-pooja-002')}
            className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between cursor-pointer mt-1 ${
              !isDbt ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div>
              <div className="font-bold">Pooja Sharma (EPFO Domain)</div>
              <div className="text-[10px] text-slate-500 font-normal">₹3,12,000 PF Claim Date of Exit Conflict</div>
            </div>
            {!isDbt && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Core Engine Status */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Core Engine Online</span>
        </div>

        {/* Voice Readout */}
        <button
          onClick={onToggleAudio}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
          title="Listen to Voice Briefing"
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
          <span className="hidden sm:inline">{isPlayingAudio ? 'Stop' : 'Voice Brief'}</span>
        </button>

        {/* Legal Petition Modal */}
        <button
          onClick={onOpenPetition}
          className="p-2 sm:px-3 sm:py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hidden md:flex items-center space-x-1.5 transition-all cursor-pointer"
          title="Inspect Drafted Legal Petition"
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Legal Petition</span>
        </button>

        {/* Presenter Mode (Shift+D) */}
        <button
          onClick={onOpenPresenter}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
          title="Evaluator Deck (Shift+D)"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
          title="Reset Simulation (Day 0)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
