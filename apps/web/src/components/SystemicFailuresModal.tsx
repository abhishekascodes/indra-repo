import React, { useState } from 'react';
import { Network, X, ShieldAlert } from 'lucide-react';
import type { Case } from '../types';

interface SystemicFailuresModalProps {
  currentCase?: Case;
  onClose: () => void;
}

export const SystemicFailuresModal: React.FC<SystemicFailuresModalProps> = ({
  onClose,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('cluster-npci');

  const failureClusters = [
    {
      id: "cluster-npci",
      title: "NPCI APBS Inactive Mapping Cluster",
      count: 48,
      percentage: "40%",
      severity: "CRITICAL",
      rootPattern: "Omnibus bank freeze under Sec 102 CrPC inactivates central Aadhaar payment bridge.",
      impactedCitizens: "48 Synthetic Beneficiaries across 6 States",
      avgValueBlocked: "₹42,500 / citizen",
      systemicRemedy: "Bank compliance with RBI APBS Master Directions allowing automated secondary account re-routing."
    },
    {
      id: "cluster-exit",
      title: "EPFO Date of Exit Mismatch Cluster",
      count: 32,
      percentage: "27%",
      severity: "HIGH",
      rootPattern: "Employer monthly ECR return differs by 1-15 days from physical relieving order.",
      impactedCitizens: "32 Synthetic PF Members",
      avgValueBlocked: "₹86,000 / member",
      systemicRemedy: "Digital Joint Declaration API integration under EPFO SOP v3.0."
    },
    {
      id: "cluster-sla",
      title: "Institutional Statutory SLA Timeout Cluster",
      count: 24,
      percentage: "20%",
      severity: "MEDIUM",
      rootPattern: "Public service nodal officers failing to respond within 15-day citizen charter SLA.",
      impactedCitizens: "24 Synthetic Grievances",
      avgValueBlocked: "Delayed Processing",
      systemicRemedy: "Automated hierarchical escalation to CPGRAMS central grievance directorate."
    },
    {
      id: "cluster-identity",
      title: "Demographic Transliteration Entropy Cluster",
      count: 16,
      percentage: "13%",
      severity: "LOW",
      rootPattern: "Vowel and middle initial differences across legacy banking and Aadhaar databases.",
      impactedCitizens: "16 Synthetic Accounts",
      avgValueBlocked: "Payment Abort Risk",
      systemicRemedy: "Phonetic matching tolerance in NPCI direct benefit verification pipeline."
    }
  ];

  const active = failureClusters.find(c => c.id === selectedCluster) || failureClusters[0];

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <Network className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">BUREAUCRATIC FAILURE GRAPH</h2>
                <span className="text-[10px] font-mono font-bold bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded border border-rose-500/50">
                  SYSTEMIC TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Macro failure clusters aggregated across synthetic administrative cases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Macro System Intelligence:</strong> INDRA does not merely resolve isolated citizen grievances; it aggregates cross-departmental telemetry to pinpoint repeated bureaucratic choke points across institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Cluster Selector */}
            <div className="md:col-span-1 space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                Failure Clusters (120 Cases)
              </div>
              {failureClusters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCluster(c.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedCluster === c.id
                      ? 'bg-white border-rose-500 ring-2 ring-rose-400/30 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">{c.title}</span>
                    <span className="font-mono font-bold text-rose-600">{c.percentage}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{c.count} cases</span>
                    <span className="text-[9px] font-black uppercase text-slate-400">{c.severity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Cluster Inspection */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 px-2 py-0.5 rounded uppercase">
                    {active.severity} SEVERITY PATTERN
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1.5">{active.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Cluster Size</div>
                  <div className="font-mono font-black text-base text-rose-600">{active.count} Cases ({active.percentage})</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Systemic Root Cause Pattern</div>
                  <p className="text-slate-900 font-medium leading-relaxed">{active.rootPattern}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Impacted Cohort</div>
                    <div className="text-slate-900 font-semibold mt-0.5">{active.impactedCitizens}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Value Withheld</div>
                    <div className="text-slate-900 font-semibold mt-0.5">{active.avgValueBlocked}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">Recommended Policy / Systemic Remedy</div>
                  <p className="text-indigo-950 font-medium leading-relaxed">{active.systemicRemedy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synthetic Administrative Failure Telemetry • Macro Systemic Pattern</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            Close System View
          </button>
        </div>
      </div>
    </div>
  );
};
