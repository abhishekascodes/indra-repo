import React from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';
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
  isPlayingAudio,
  onToggleAudio,
}) => {
  return (
    <nav className="w-full bg-slate-900 text-white px-6 sm:px-8 h-16 flex items-center justify-between border-b border-slate-800 select-none shadow-sm z-50 relative">
      
      {/* Left: Official Gov Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-sm tracking-wide leading-tight">
            INDRA
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase leading-tight">
            Administrative Intelligence
          </div>
        </div>
      </div>

      {/* Right: Institutional Controls */}
      <div className="flex items-center space-x-6">
        
        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure Session Active</span>
        </div>

        {currentCase?.id && (
          <button
            onClick={onToggleAudio}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              isPlayingAudio 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isPlayingAudio ? 'Stop Briefing' : 'Voice Brief'}
          </button>
        )}

      </div>
    </nav>
  );
};
