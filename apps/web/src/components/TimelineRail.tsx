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
        return <CheckCircle className="w-3.5 h-3.5 text-blue-700" />;
      case 'EVIDENCE_EXTRACTION':
        return <Zap className="w-3.5 h-3.5 text-amber-700" />;
      case 'CITIZEN_CONSENT':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />;
      case 'STATE_TRANSITION':
        return <Send className="w-3.5 h-3.5 text-cyan-700" />;
      case 'TEMPORAL_ADVANCE':
        return <Clock className="w-3.5 h-3.5 text-amber-700" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <div className="h-28 bg-white border-t border-slate-300 px-5 py-2 flex flex-col justify-between select-none font-mono shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs pb-1">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-700" />
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
            CASE CHRONOLOGY RAIL
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-bold">
          SIMULATED CLOCK: <span className="text-amber-700 font-bold">DAY {simulatedDay}</span>
        </div>
      </div>

      {/* Horizontal Rail Scroller */}
      <div className="flex-1 flex items-center space-x-3 overflow-x-auto py-1 scrollbar-none">
        {timeline.map((evt, idx) => {
          const isLast = idx === timeline.length - 1;

          return (
            <div key={evt.id || idx} className="flex items-center space-x-2.5 flex-shrink-0 group">
              <div className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all max-w-[210px] space-y-0.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {getEventIcon(evt.event_type)}
                    <span className="text-[9px] font-bold text-amber-700">
                      DAY {evt.day_offset}
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-400 uppercase">
                    {evt.event_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[10px] font-bold text-slate-900 truncate">
                  {evt.title}
                </div>
                <div className="text-[9px] text-slate-500 line-clamp-1 font-sans">
                  {evt.description}
                </div>
              </div>

              {!isLast && (
                <div className="flex items-center text-slate-300">
                  <div className="w-3 h-px bg-slate-300"></div>
                  <ArrowRight className="w-3 h-3 -ml-1 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
