import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (domainId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [hoveredProfile, setHoveredProfile] = useState<'dbt' | 'epfo' | null>(null);

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans flex flex-col justify-between selection:bg-black selection:text-white select-none">
      
      {/* Header */}
      <header className="p-8 sm:p-12">
        <h1 className="text-xl font-bold tracking-tighter uppercase">INDRA.</h1>
        <p className="text-xs uppercase tracking-widest mt-2 opacity-50 font-bold">Administrative Intelligence</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 sm:px-12 flex flex-col justify-center max-w-5xl">
        <h2 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
          Sandbox<br />Environment
        </h2>
        
        <div className="mt-20 border-t-2 border-black pt-8 grid sm:grid-cols-2 gap-12 sm:gap-24">
          
          {/* Profile 1 */}
          <div 
            onClick={() => onLogin('dbt_failure')}
            onMouseEnter={() => setHoveredProfile('dbt')}
            onMouseLeave={() => setHoveredProfile(null)}
            className="group cursor-pointer"
          >
            <div className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center justify-between">
              <span>01. DBT Flagship</span>
              <span className={`transition-opacity duration-300 ${hoveredProfile === 'dbt' ? 'opacity-100' : 'opacity-0'}`}>ENTER →</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-2">Aakash Verma</h3>
            <p className="text-sm opacity-60 font-medium max-w-xs">
              Post-Matric Scholarship Blockade & Cyber Account Freeze (₹48,000)
            </p>
          </div>

          {/* Profile 2 */}
          <div 
            onClick={() => onLogin('epfo_claim')}
            onMouseEnter={() => setHoveredProfile('epfo')}
            onMouseLeave={() => setHoveredProfile(null)}
            className="group cursor-pointer"
          >
            <div className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center justify-between">
              <span>02. EPFO Claim</span>
              <span className={`transition-opacity duration-300 ${hoveredProfile === 'epfo' ? 'opacity-100' : 'opacity-0'}`}>ENTER →</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-2">Pooja Sharma</h3>
            <p className="text-sm opacity-60 font-medium max-w-xs">
              Provident Fund Claim Rejection & Exit Date Conflict (₹3.12L)
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 sm:p-12 flex justify-between text-xs font-bold uppercase tracking-widest opacity-30">
        <div>v1.0.0</div>
        <div>System Online</div>
      </footer>
    </div>
  );
};
