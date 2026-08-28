import React from 'react';
import { Clock, CheckCircle, Send, Zap, ArrowRight } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface TimelineRailProps {
  timeline: TimelineEvent[];
  simulatedDay: number;
}

export const TimelineRail: React.FC<TimelineRailProps> = ({
  timeline,
  simulatedDay,
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CASE_CREATION':
        return <CheckCircle className="w-3.5 h-3.5 text-blue-400" />;
      case 'EVIDENCE_EXTRACTION':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'CITIZEN_CONSENT':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'STATE_TRANSITION':
        return <Send className="w-3.5 h-3.5 text-cyan-400" />;
      case 'TEMPORAL_ADVANCE':
        return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="h-32 bg-[#0A0D15] border-t border-slate-800/80 px-6 py-2 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs pb-1">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Case Progression Timeline Rail
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Simulated Timeline: <span className="font-bold text-amber-300">Day {simulatedDay}</span>
        </div>
      </div>

      {/* Horizontal Rail Scroller */}
      <div className="flex-1 flex items-center space-x-4 overflow-x-auto py-1 scrollbar-none">
        {timeline.map((evt, idx) => {
          const isLast = idx === timeline.length - 1;

          return (
            <div key={evt.id || idx} className="flex items-center space-x-3 flex-shrink-0 group">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all max-w-[220px] space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {getEventIcon(evt.event_type)}
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      Day {evt.day_offset}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {evt.event_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-200 truncate">
                  {evt.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  {evt.description}
                </div>
              </div>

              {!isLast && (
                <div className="flex items-center text-slate-700">
                  <div className="w-4 h-0.5 bg-slate-800"></div>
                  <ArrowRight className="w-3 h-3 -ml-1 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
