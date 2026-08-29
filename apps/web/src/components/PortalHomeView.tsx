import React, { useState } from 'react';

interface PortalHomeViewProps {
  onSelectCase: (caseId: string) => void;
  onStartNewCase: () => void;
  onOpenDemoControls: () => void;
}

export const PortalHomeView: React.FC<PortalHomeViewProps> = ({
  onSelectCase,
  onOpenDemoControls,
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const cases = [
    {
      id: 'case-flagship-dbt-8821',
      title: 'DBT Scholarship – ₹48,000 Payment Failure',
      citizen: 'Aakash Verma',
      status: 'USER_APPROVAL'
    },
    {
      id: 'case-epfo-pooja-002',
      title: 'EPFO Claim Date of Exit Conflict',
      citizen: 'Pooja Sharma',
      status: 'WAITING'
    },
    {
      id: 'case-demo-003',
      title: 'Pension Arrears Disbursal Hold',
      citizen: 'Ram Singh',
      status: 'RESOLVED'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-8 sm:px-12 py-16 sm:py-24 animate-in fade-in duration-500">
      
      <header className="mb-24">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
          Active<br />Workspaces
        </h1>
      </header>

      <div className="border-t-2 border-black">
        {cases.map((c, idx) => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c.id)}
            onMouseEnter={() => setHoveredRow(idx)}
            onMouseLeave={() => setHoveredRow(null)}
            className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-black/10 hover:border-black cursor-pointer transition-colors"
          >
            <div className="flex items-start space-x-8">
              <span className="text-xs font-bold font-mono opacity-40 mt-1.5">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{c.title}</h3>
                <div className="text-xs uppercase tracking-widest font-bold opacity-50 mt-2">
                  {c.citizen} • Ref: {c.id}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8 mt-6 sm:mt-0 ml-16 sm:ml-0">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1.5">
                {c.status}
              </span>
              <span className={`text-xl transition-opacity duration-300 font-light ${hoveredRow === idx ? 'opacity-100' : 'opacity-0'}`}>
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24">
        <button
          onClick={onOpenDemoControls}
          className="text-xs font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
        >
          [ Open Sandbox Controls ]
        </button>
      </div>

    </div>
  );
};
