import React from 'react';
import { Clock, CheckCircle2, Send, Zap, ArrowRight } from 'lucide-react';
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
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'EVIDENCE_EXTRACTION':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'CITIZEN_CONSENT':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'STATE_TRANSITION':
        return <Send className="w-3.5 h-3.5 text-cyan-600" />;
      case 'TEMPORAL_ADVANCE':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="h-24 bg-white border-t border-slate-200 px-6 py-2 flex flex-col justify-between select-none shadow-2xs">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs pb-1">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Case Progression Timeline
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Simulated Clock: <span className="text-amber-700 font-bold font-mono">Day {simulatedDay}</span>
        </div>
      </div>

      {/* Horizontal Rail Scroller */}
      <div className="flex-1 flex items-center space-x-3 overflow-x-auto py-0.5 scrollbar-none">
        {timeline.map((evt, idx) => {
          const isLast = idx === timeline.length - 1;

          return (
            <div key={evt.id || idx} className="flex items-center space-x-2.5 flex-shrink-0 group">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all max-w-[220px] space-y-0.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {getEventIcon(evt.event_type)}
                    <span className="text-[10px] font-bold text-amber-800 font-mono">
                      Day {evt.day_offset}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">
                    {evt.event_type.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 truncate">
                  {evt.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {evt.description}
                </div>
              </div>

              {!isLast && (
                <div className="flex items-center text-slate-300">
                  <div className="w-3 h-px bg-slate-200"></div>
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
