import React from 'react';
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
    <nav className="w-full bg-white text-black px-6 sm:px-12 h-20 flex items-center justify-between border-b-2 border-black/5 select-none">
      
      {/* Left: Stark Brand */}
      <div className="flex items-center space-x-2">
        <div className="font-black text-2xl tracking-tighter uppercase">INDRA</div>
      </div>

      {/* Right: Ultra Minimal Controls */}
      <div className="flex items-center space-x-6 sm:space-x-10 text-xs font-bold uppercase tracking-widest">
        
        <div className="flex items-center space-x-2 opacity-50">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>Engine Online</span>
        </div>

        {currentCase?.id && (
          <button
            onClick={onToggleAudio}
            className={`transition-opacity cursor-pointer ${isPlayingAudio ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            {isPlayingAudio ? 'Stop Audio' : 'Play Brief'}
          </button>
        )}

      </div>
    </nav>
  );
};
