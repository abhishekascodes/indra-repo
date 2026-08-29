import React, { useState, useRef, useEffect } from 'react';
import { Shield, Lock, Check, ArrowRight } from 'lucide-react';

interface ConsentSliderProps {
  onAuthorize: () => void;
  isAuthorized: boolean;
  disabled?: boolean;
  actionTitle: string;
  targetAuthority: string;
  legalBasis: string;
}

export const ConsentSlider: React.FC<ConsentSliderProps> = ({
  onAuthorize,
  isAuthorized,
  disabled = false,
  actionTitle,
  targetAuthority,
  legalBasis,
}) => {
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // If already authorized, lock at 100%
  useEffect(() => {
    if (isAuthorized) {
      setDragProgress(100);
    }
  }, [isAuthorized]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isAuthorized) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled || isAuthorized || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const handleWidth = 56;
    const maxTrack = rect.width - handleWidth;
    const currentX = Math.max(0, Math.min(e.clientX - rect.left - handleWidth / 2, maxTrack));
    const progress = (currentX / maxTrack) * 100;
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || disabled || isAuthorized) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // 95% Threshold rule from the Bible
    if (dragProgress >= 95) {
      setDragProgress(100);
      onAuthorize();
    } else {
      // Snap back to 0%
      setDragProgress(0);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-4 select-none font-sans">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              CITIZEN AUTHORIZATION REQUIRED
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              THRESHOLD: 95%
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1.5">{actionTitle}</h4>
          <div className="text-xs text-slate-500 mt-0.5">
            Target: <strong className="text-slate-800">{targetAuthority}</strong> | Legal Basis: <span className="text-slate-700">{legalBasis}</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
          <Shield className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Legal Scope Disclaimer */}
      <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 border border-slate-200 rounded-xl p-3">
        <div>
          <div className="font-bold text-slate-800">WHAT INDRA WILL DO:</div>
          <p className="text-slate-600 mt-0.5">
            Submit statutory directive to re-link APBS mandate to active State Bank of India account.
          </p>
        </div>
        <div>
          <div className="font-bold text-slate-800">WHAT INDRA WILL NOT DO:</div>
          <p className="text-slate-600 mt-0.5">
            Will not modify bank balance, withdraw funds, or access confidential login credentials.
          </p>
        </div>
      </div>

      {/* Slide to Authorize Track (600px width target) */}
      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative h-14 rounded-xl border flex items-center overflow-hidden cursor-pointer transition-colors ${
            isAuthorized
              ? 'bg-emerald-600 border-emerald-700 text-white'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={dragProgress}
          aria-label="Slide to Authorize"
        >
          {/* Progress Fill */}
          <div
            className={`absolute left-0 top-0 bottom-0 transition-all ${
              isAuthorized ? 'bg-emerald-600' : 'bg-blue-500/20'
            }`}
            style={{ width: `${dragProgress}%` }}
          />

          {/* Central Instruction Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold tracking-wider uppercase">
            {isAuthorized ? (
              <span className="flex items-center space-x-2 text-white">
                <Check className="w-4 h-4" />
                <span>CITIZEN AGENCY GRANTED • ACTION SUBMITTED</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2 text-slate-700">
                <span>SLIDE TO AUTHORIZE MANDATE</span>
                <ArrowRight className="w-3.5 h-3.5 animate-pulse text-slate-400" />
              </span>
            )}
          </div>

          {/* Draggable Handle */}
          <div
            className={`absolute top-1 bottom-1 w-12 rounded-lg flex items-center justify-center shadow-md transition-transform touch-none ${
              isAuthorized
                ? 'bg-white text-emerald-700 right-1'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
            style={{
              left: isAuthorized ? 'auto' : `calc(${dragProgress}% * (100% - 56px) / 100 + 4px)`,
              transition: isDragging ? 'none' : 'left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            {isAuthorized ? (
              <Check className="w-5 h-5 font-black" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
