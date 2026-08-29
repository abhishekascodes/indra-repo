import React, { useState } from 'react';
import {
  FileText, Landmark, AlertTriangle, Clock,
  Shield, Plus, FolderOpen, Search, Filter,
  Lock, Users, ExternalLink,
  ChevronRight, MoreVertical, Sliders
} from 'lucide-react';

interface PortalHomeViewProps {
  onSelectCase: (domainId: string) => void;
  onOpenDemoControls: () => void;
  onStartNewCase: () => void;
}

export const PortalHomeView: React.FC<PortalHomeViewProps> = ({
  onSelectCase,
  onOpenDemoControls,
  onStartNewCase,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dbt' | 'epfo' | 'cyber' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full h-full bg-[#FAFAFA] overflow-y-auto font-sans select-none flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* ============================================================ */}
        {/* TOP HERO & SYSTEM BANNER (Grid: 8 cols left, 4 cols right)   */}
        {/* ============================================================ */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* ========================================================== */}
          {/* LEFT MAIN COLUMN (Col 1 to 8)                              */}
          {/* ========================================================== */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* 1. Hero Banner with Neoclassical Dome Graphic */}
            <div className="relative bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-lg space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Welcome to INDRA
                </h1>
                <h2 className="text-lg font-bold text-slate-600">
                  Reconstruct. Resolve. Restore.
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed pt-1">
                  INDRA ingests messy evidence, reconstructs the truth, and resolves administrative failures across institutions.
                </p>
              </div>

              {/* Neoclassical Institutional Dome SVG Illustration */}
              <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-40 lg:opacity-85 flex items-center justify-end pr-4">
                <svg
                  viewBox="0 0 320 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-slate-300"
                >
                  {/* Constellation Network Nodes */}
                  <g stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3 3">
                    <line x1="60" y1="40" x2="160" y2="25" />
                    <line x1="160" y1="25" x2="260" y2="50" />
                    <line x1="160" y1="25" x2="160" y2="70" />
                    <line x1="60" y1="40" x2="100" y2="90" />
                    <line x1="260" y1="50" x2="220" y2="90" />
                  </g>
                  <circle cx="60" cy="40" r="3" fill="#3B82F6" />
                  <circle cx="160" cy="25" r="3.5" fill="#3B82F6" />
                  <circle cx="260" cy="50" r="3" fill="#3B82F6" />
                  <circle cx="100" cy="90" r="2.5" fill="#94A3B8" />
                  <circle cx="220" cy="90" r="2.5" fill="#94A3B8" />

                  {/* Institutional Dome / Capitol Building */}
                  <g fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2">
                    {/* Pediment & Dome */}
                    <path d="M160 35 L160 50" strokeWidth="1.5" stroke="#475569" />
                    <circle cx="160" cy="35" r="3" fill="#475569" />
                    <path d="M135 70 C135 50, 185 50, 185 70 Z" fill="#F1F5F9" />
                    <rect x="130" y="70" width="60" height="15" fill="#E2E8F0" rx="1" />
                    <polygon points="120,95 200,95 160,82" fill="#E2E8F0" />

                    {/* Columns & Base */}
                    <rect x="125" y="95" width="70" height="40" fill="#F8FAFC" />
                    <line x1="135" y1="95" x2="135" y2="135" strokeWidth="1.5" />
                    <line x1="145" y1="95" x2="145" y2="135" strokeWidth="1.5" />
                    <line x1="155" y1="95" x2="155" y2="135" strokeWidth="1.5" />
                    <line x1="165" y1="95" x2="165" y2="135" strokeWidth="1.5" />
                    <line x1="175" y1="95" x2="175" y2="135" strokeWidth="1.5" />
                    <line x1="185" y1="95" x2="185" y2="135" strokeWidth="1.5" />

                    {/* Plinth & Steps */}
                    <rect x="110" y="135" width="100" height="8" fill="#CBD5E1" rx="1" />
                    <rect x="95" y="143" width="130" height="8" fill="#E2E8F0" rx="1" />
                    <rect x="80" y="151" width="160" height="10" fill="#F1F5F9" rx="1" />

                    {/* Side Wings */}
                    <rect x="60" y="115" width="40" height="30" fill="#F8FAFC" />
                    <line x1="70" y1="115" x2="70" y2="145" strokeWidth="1.2" />
                    <line x1="80" y1="115" x2="80" y2="145" strokeWidth="1.2" />
                    <line x1="90" y1="115" x2="90" y2="145" strokeWidth="1.2" />

                    <rect x="220" y="115" width="40" height="30" fill="#F8FAFC" />
                    <line x1="230" y1="115" x2="230" y2="145" strokeWidth="1.2" />
                    <line x1="240" y1="115" x2="240" y2="145" strokeWidth="1.2" />
                    <line x1="250" y1="115" x2="250" y2="145" strokeWidth="1.2" />
                  </g>
                </svg>
              </div>
            </div>

            {/* 2. Top Action Buttons (Start New Case / Load Existing Case) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={onStartNewCase}
                className="group flex items-center justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Start New Case</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create a new administrative reconstruction from evidence.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onSelectCase('dbt_failure')}
                className="group flex items-center justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Load Existing Case</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Open a previously saved case workspace.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* 3. Your Workspaces Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Your Workspaces
                </h2>

                {/* Search & Filter Bar */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-48 shadow-2xs"
                    />
                  </div>
                  <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-2xs cursor-pointer">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tabs Row */}
              <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'border-blue-600 text-blue-600 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Cases
                </button>
                <button
                  onClick={() => setActiveTab('dbt')}
                  className={`px-3 py-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'dbt'
                      ? 'border-blue-600 text-blue-600 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  DBT / PFMS
                </button>
                <button
                  onClick={() => setActiveTab('epfo')}
                  className={`px-3 py-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'epfo'
                      ? 'border-blue-600 text-blue-600 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EPFO
                </button>
                <button
                  onClick={() => setActiveTab('cyber')}
                  className={`px-3 py-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'cyber'
                      ? 'border-blue-600 text-blue-600 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cyber Restrictions
                </button>
                <button
                  onClick={() => setActiveTab('other')}
                  className={`px-3 py-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'other'
                      ? 'border-blue-600 text-blue-600 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Other Domains
                </button>
              </div>

              {/* 3 Case Cards Grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {/* CARD 1: DBT Scholarship */}
                <div
                  onClick={() => onSelectCase('dbt_failure')}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        DBT Scholarship – ₹48,000 Payment Failure
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                        DBT / PFMS
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md">
                        ESCALATION REQUIRED
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <div>📅 Last updated: 2 hours ago</div>
                      <div>Case ID: DBT-2025-0487</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>70%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>

                {/* CARD 2: EPFO Claim */}
                <div
                  onClick={() => onSelectCase('epfo_claim')}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        EPFO Claim – Date of Exit Mismatch
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                        EPFO
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                        ACTION REQUIRED
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <div>📅 Last updated: 1 day ago</div>
                      <div>Case ID: EPFO-2025-0123</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>

                {/* CARD 3: Cyber Restriction */}
                <div
                  onClick={() => onSelectCase('dbt_failure')}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        Cyber Restriction – Account Hold Inquiry
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                        Cyber Restrictions
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                        ANALYSIS IN PROGRESS
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <div>📅 Last updated: 3 days ago</div>
                      <div>Case ID: CYBR-2025-0099</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Privacy Footer Banner */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Your data is private and protected.</h4>
                  <p className="text-[11px] text-slate-500">
                    INDRA operates with end-to-end citizen consent and data minimization.
                  </p>
                </div>
              </div>
              <a
                href="#learn-more"
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Learn More</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT SIDEBAR COLUMN (Col 9 to 12)                         */}
          {/* ========================================================== */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* 1. Recent Activity Feed */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                <a href="#view-all" className="text-xs text-blue-600 font-bold hover:underline">
                  View All
                </a>
              </div>

              <div className="space-y-4">
                {/* Activity 1 */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Evidence extracted from SBI_Statement_May2025.pdf
                    </p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      NPCI Mapper status retrieved for Account XXXX4567
                    </p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Contradiction detected: BNS-410 mapped to restriction
                    </p>
                    <span className="text-[10px] text-slate-400">3 hours ago</span>
                  </div>
                </div>

                {/* Activity 4 */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      SLA breach predicted in 3 days for PFMS response
                    </p>
                    <span className="text-[10px] text-slate-400">5 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. System Status Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">System Status</h3>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  All Systems Operational
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>INDRA Core Engine</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Case Graph Service</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Evidence Engine</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Temporal Engine (Simulated)</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Mock Institutions</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>
              </div>
            </div>

            {/* 3. Demo Mode Active Card */}
            <div className="bg-blue-50/70 border border-blue-200/90 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  i
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Demo Mode Active</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Simulated institutions and time controls are available.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenDemoControls}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold rounded-2xl border border-blue-200 shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Open Demo Controls</span>
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULL-WIDTH FOOTER BAR                                         */}
      {/* ============================================================ */}
      <footer className="w-full h-12 bg-white border-t border-slate-200/90 px-6 sm:px-10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div>INDRA v1.0.0 &nbsp;|&nbsp; Persistent Administrative Intelligence</div>
        <div>Built for citizens. By citizens.</div>
      </footer>
    </div>
  );
};
