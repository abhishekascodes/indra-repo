import React from 'react';
import { Search, Filter, ChevronRight, FileText } from 'lucide-react';

interface PortalHomeViewProps {
  onSelectCase: (caseId: string) => void;
  onStartNewCase: () => void;
  onOpenDemoControls: () => void;
}

export const PortalHomeView: React.FC<PortalHomeViewProps> = ({
  onSelectCase,
  onOpenDemoControls,
}) => {
  const cases = [
    {
      id: 'case-flagship-dbt-8821',
      title: 'Post-Matric Scholarship Payment Failure',
      citizen: 'Aakash Verma',
      domain: 'DBT Flagship',
      status: 'Action Required',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      date: '2026-08-29'
    },
    {
      id: 'case-epfo-pooja-002',
      title: 'Claim Date of Exit Conflict',
      citizen: 'Pooja Sharma',
      domain: 'EPFO Claims',
      status: 'Pending Escalation',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      date: '2026-08-28'
    },
    {
      id: 'case-demo-003',
      title: 'Pension Arrears Disbursal Hold',
      citizen: 'Ram Singh',
      domain: 'Pension System',
      status: 'Resolved',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      date: '2026-08-25'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Workspaces</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and resolve administrative bottlenecks.</p>
        </div>
        <button
          onClick={onOpenDemoControls}
          className="text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded shadow-sm transition-colors cursor-pointer"
        >
          Open Simulator Controls
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-t-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by Case ID or Beneficiary..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="px-6 py-4">Case Reference</th>
              <th className="px-6 py-4">Citizen & Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr 
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-sm font-mono font-bold text-slate-700 group-hover:text-blue-700">{c.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{c.citizen}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.title} • {c.domain}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${c.statusColor}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <span className="text-blue-600 group-hover:text-blue-800 flex items-center justify-end space-x-1">
                    <span>Open Dossier</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
