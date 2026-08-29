import React, { useState, useEffect } from 'react';
import {
  Sliders, RotateCcw, AlertTriangle,
  CheckCircle2, LogOut, X, HelpCircle,
  ChevronDown, ArrowLeft
} from 'lucide-react';
import { PortalHomeView } from './components/PortalHomeView';
import { SimpleCitizenView } from './components/SimpleCitizenView';
import { SovereignStudioView } from './components/SovereignStudioView';
import { ProvenanceDrawer } from './components/ProvenanceDrawer';
import { PresenterOverlay } from './components/PresenterOverlay';
import { LoginScreen } from './components/LoginScreen';
import { EpistemicLedgerModal } from './components/EpistemicLedgerModal';
import { AdministrativeDebugger } from './components/AdministrativeDebugger';
import { FlightRecorderReplay } from './components/FlightRecorderReplay';
import { CounterfactualModal } from './components/CounterfactualModal';
import { IdentityEntropyModal } from './components/IdentityEntropyModal';
import { PolicyGuardrailsModal } from './components/PolicyGuardrailsModal';
import { RedTeamLabModal } from './components/RedTeamLabModal';
import { api } from './services/api';
import type { Case, UIGraphData, Provenance, Node as GraphNode } from './types';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('indra_auth') === 'true'
  );
  const [activeTab, setActiveTab] = useState<'home' | 'workspace'>('home');
  const [viewMode, setViewMode] = useState<'citizen' | 'hypervisor'>('citizen');
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<UIGraphData | null>(null);
  const [activeProvenance, setActiveProvenance] = useState<Provenance | null>(null);
  const [selectedWhyNode, setSelectedWhyNode] = useState<GraphNode | null>(null);
  const [isProvenanceDrawerOpen, setIsProvenanceDrawerOpen] = useState<boolean>(false);
  const [isPresenterOverlayOpen, setIsPresenterOverlayOpen] = useState<boolean>(false);
  const [isCaseMenuOpen, setIsCaseMenuOpen] = useState<boolean>(false);

  // Modal states
  const [activeModal, setActiveModal] = useState<
    'epistemic' | 'debugger' | 'replay' | 'counterfactual' | 'identity' | 'guardrails' | 'redteam' | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Keyboard shortcut listener for Presenter Mode (Shift+D or Ctrl+Shift+O / Cmd+Shift+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.shiftKey && (e.key === 'D' || e.key === 'd')) || (e.shiftKey && (e.ctrlKey || e.metaKey) && (e.key === 'O' || e.key === 'o'))) {
        e.preventDefault();
        setIsPresenterOverlayOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize or load case
  const initializeCase = async (domainId: string = 'dbt_failure', openWorkspace: boolean = true) => {
    try {
      setIsLoading(true);
      const title = domainId === 'dbt_failure'
        ? 'Cross-Domain DBT Scholarship Failure'
        : 'EPFO Form 19 Claim Settlement Blockade';
      const citizen = domainId === 'dbt_failure' ? 'Aakash Verma' : 'Pooja Sharma';
      const objective = domainId === 'dbt_failure'
        ? 'Reconcile ₹48,000 scholarship payment blockage across PFMS Gateway, NPCI Mapper, Canara Bank Restriction, and Cyber Requisition.'
        : 'Resolve EPF final settlement claim rejection caused by Date of Exit conflict between member master and relieving letter.';

      // 1. Create Case
      const newCase = await api.createCase({
        title,
        citizen_name: citizen,
        domain_id: domainId,
        objective,
      });

      // 2. Ingest Evidence and Reason automatically
      const reasonedCase = await api.ingestFlagship(newCase.id);
      setCurrentCase(reasonedCase);

      // 3. Fetch initial graph
      const graph = await api.getGraph(newCase.id);
      setGraphData(graph);

      if (openWorkspace) {
        setActiveTab('workspace');
      }

      showToast(`Loaded ${domainId === 'dbt_failure' ? 'DBT Scholarship' : 'EPFO Claim'} Case for ${citizen}`);
    } catch (err) {
      console.error('Error initializing case:', err);
      showToast('Error initializing case', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      initializeCase('dbt_failure', false);
    }
  }, [isAuthenticated]);

  // Refresh case state & graph
  const refreshCase = async (caseId: string) => {
    try {
      const c = await api.getCase(caseId);
      setCurrentCase(c);
      const g = await api.getGraph(caseId);
      setGraphData(g);
    } catch (err) {
      console.error('Error refreshing case:', err);
    }
  };

  // Action handlers
  const handleAdvanceTime = async (days: number) => {
    if (!currentCase) return;
    try {
      setIsLoading(true);
      const updated = await api.advanceTime(currentCase.id, days);
      setCurrentCase(updated);
      const g = await api.getGraph(currentCase.id);
      setGraphData(g);

      if (updated.current_state === 'ESCALATION_REQUIRED') {
        showToast(`Clock advanced +${days}d: 15-Day SLA Expired! Case auto-escalated to CPGRAMS`, 'warning');
      } else {
        showToast(`Simulated clock advanced by +${days} days (Now Day ${updated.simulated_day})`, 'info');
      }
    } catch (err) {
      console.error('Error advancing time:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantConsent = async (actionId: string, consent: boolean = true) => {
    if (!currentCase) return;
    try {
      await api.grantConsent(currentCase.id, actionId, consent);
      await refreshCase(currentCase.id);
      showToast(consent ? 'Citizen authorization granted!' : 'Consent revoked.');
    } catch (err) {
      console.error('Error granting consent:', err);
    }
  };

  const handleSubmitAction = async (actionId: string) => {
    if (!currentCase) return;
    try {
      setIsLoading(true);
      await api.submitAction(currentCase.id, actionId);
      await refreshCase(currentCase.id);
      showToast('Action Transmitted to Bank Portal! Case entered Sentinel WAITING state.');
    } catch (err) {
      console.error('Error submitting action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveChain = async () => {
    if (!currentCase) return;
    try {
      setIsLoading(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const res = await api.resolveDbtChain(currentCase.id);
      await refreshCase(currentCase.id);
      showToast(`Administrative Certainty Restored! ₹48,000 credited via UTR #${res.utr}`);
    } catch (err) {
      console.error('Error resolving chain:', err);
      showToast('Prerequisites not yet satisfied in bank portal', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateEvent = async (eventType: string) => {
    if (!currentCase) return;
    try {
      setIsLoading(true);
      const res = await api.simulateEvent(currentCase.id, eventType);
      await refreshCase(currentCase.id);
      showToast(res.message || `Simulation event '${eventType}' executed`);
    } catch (err) {
      console.error('Error simulating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWhy = (node: GraphNode) => {
    setSelectedWhyNode(node);
    if (node.provenance) {
      setActiveProvenance(node.provenance);
    }
    setIsProvenanceDrawerOpen(true);
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      setIsProvenanceDrawerOpen(false);
      await api.resetMockState();
      if (currentCase) {
        await initializeCase(currentCase.domain_id, false);
      }
      showToast('Simulation environment reset to Day 0');
    } catch (err) {
      console.error('Error resetting mock state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('indra_auth');
    localStorage.removeItem('indra_citizen');
    setIsAuthenticated(false);
    setCurrentCase(null);
    setGraphData(null);
    showToast('Logged out to Gateway', 'info');
  };

  // If not authenticated, render Demo Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={(domainId) => {
          setIsAuthenticated(true);
          initializeCase(domainId, true);
        }}
      />
    );
  }

  const isDbt = currentCase?.domain_id === 'dbt_failure';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* 1. TOP HEADER (Pixel-Perfect Matching Uploaded Design)       */}
      {/* ============================================================ */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-6 sm:px-8 flex items-center justify-between shadow-2xs z-30 flex-shrink-0">
        {/* Left: INDRA Circuit Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* Geometric Circuit Emblem */}
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shadow-xs hover:opacity-90 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-400">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-slate-950 leading-none">
              INDRA
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              Administrative Intelligence for Citizens
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Active Case Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsCaseMenuOpen(!isCaseMenuOpen)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-left shadow-2xs flex items-center space-x-3 transition-colors cursor-pointer"
            >
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                  ACTIVE CASE
                </span>
                <span className="text-xs font-bold text-slate-900 leading-none mt-1 block">
                  {currentCase ? `${currentCase.citizen_name} • ${isDbt ? 'DBT Scholarship (₹48,000)' : 'EPFO Claim'}` : 'Select Case'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isCaseMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    initializeCase('dbt_failure', true);
                    setIsCaseMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <div className="text-slate-900">Aakash Verma</div>
                  <div className="text-[10px] text-slate-400">DBT Scholarship (₹48,000)</div>
                </button>
                <button
                  onClick={() => {
                    initializeCase('epfo_claim', true);
                    setIsCaseMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <div className="text-slate-900">Pooja Sharma</div>
                  <div className="text-[10px] text-slate-400">EPFO Claim - Exit Date Conflict</div>
                </button>
              </div>
            )}
          </div>

          {/* INDRA Core Engine Status */}
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">INDRA Core Engine</span>
            <span className="flex items-center space-x-1 font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </span>
          </div>

          {/* Help Button */}
          <button
            onClick={() => showToast('INDRA Sovereign Administrative Hypervisor v1.0.0 Help Guide', 'info')}
            className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Help</span>
          </button>

          {/* User Profile Avatar with Menu */}
          <div className="relative">
            <button
              onClick={() => setIsCaseMenuOpen(false)}
              className="flex items-center space-x-1.5 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Quick Exit / Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. SUB-BAR FOR ACTIVE WORKSPACE NAVIGATION                   */}
      {/* ============================================================ */}
      {activeTab === 'workspace' && currentCase && (
        <div className="h-11 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between text-xs z-20 flex-shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </button>

          <div className="flex items-center space-x-3">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('citizen')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'citizen' ? 'bg-white text-slate-950 font-black shadow-2xs' : 'text-slate-500'
                }`}
              >
                Citizen View
              </button>
              <button
                onClick={() => setViewMode('hypervisor')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'hypervisor' ? 'bg-white text-slate-950 font-black shadow-2xs' : 'text-slate-500'
                }`}
              >
                Hypervisor Studio
              </button>
            </div>

            <button
              onClick={() => setIsPresenterOverlayOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              title="Presenter Deck (Shift+D)"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              title="Reset Demo (Day 0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MAIN BODY (PORTAL HOME vs ACTIVE CASE WORKSPACE)          */}
      {/* ============================================================ */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && (
          <PortalHomeView
            onSelectCase={(domainId) => initializeCase(domainId, true)}
            onOpenDemoControls={() => setIsPresenterOverlayOpen(true)}
            onStartNewCase={() => initializeCase('dbt_failure', true)}
          />
        )}

        {activeTab === 'workspace' && currentCase && viewMode === 'citizen' && (
          <SimpleCitizenView
            currentCase={currentCase}
            onGrantConsent={handleGrantConsent}
            onSubmitAction={handleSubmitAction}
            onResolveChain={handleResolveChain}
            onAdvanceTime={handleAdvanceTime}
            onOpenWhy={handleOpenWhy}
            onOpenAdvancedStudio={() => setViewMode('hypervisor')}
            onReset={handleReset}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'workspace' && currentCase && viewMode === 'hypervisor' && (
          <SovereignStudioView
            currentCase={currentCase}
            graphData={graphData}
            onGrantConsent={handleGrantConsent}
            onSubmitAction={handleSubmitAction}
            onResolveChain={handleResolveChain}
            onAdvanceTime={handleAdvanceTime}
            onSelectProvenance={setActiveProvenance}
            onOpenWhy={handleOpenWhy}
            onOpenEpistemicLedger={() => setActiveModal('epistemic')}
            onOpenDebugger={() => setActiveModal('debugger')}
            onOpenReplay={() => setActiveModal('replay')}
            onOpenCounterfactual={() => setActiveModal('counterfactual')}
            onOpenIdentityEntropy={() => setActiveModal('identity')}
            onOpenPolicyGuardrails={() => setActiveModal('guardrails')}
            onOpenRedTeam={() => setActiveModal('redteam')}
            onOpenPresenter={() => setIsPresenterOverlayOpen(true)}
            onReset={handleReset}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* ============================================================ */}
      {/* 4. OVERLAYS & MODALS                                         */}
      {/* ============================================================ */}
      <ProvenanceDrawer
        isOpen={isProvenanceDrawerOpen}
        selectedNode={selectedWhyNode}
        provenance={activeProvenance}
        documents={currentCase?.documents || []}
        onClose={() => setIsProvenanceDrawerOpen(false)}
        onJumpToDocumentRegion={() => {
          setIsProvenanceDrawerOpen(false);
          showToast('Zoomed camera to Level 5 OCR Bounding Box');
        }}
      />

      <PresenterOverlay
        isOpen={isPresenterOverlayOpen}
        onClose={() => setIsPresenterOverlayOpen(false)}
        currentCase={currentCase}
        onAdvanceTime={handleAdvanceTime}
        onSelectDomain={(dom) => initializeCase(dom, true)}
        onSimulateEvent={handleSimulateEvent}
        onReset={handleReset}
      />

      {activeModal === 'epistemic' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EpistemicLedgerModal
              currentCase={currentCase}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

      {activeModal === 'debugger' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-slate-900">Administrative DevTools Debugger</h3>
              <button onClick={() => setActiveModal(null)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer">Close</button>
            </div>
            <AdministrativeDebugger currentCase={currentCase} />
          </div>
        </div>
      )}

      {activeModal === 'replay' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-slate-900">Bitemporal Flight Recorder Replay</h3>
              <button onClick={() => setActiveModal(null)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer">Close</button>
            </div>
            <FlightRecorderReplay currentCase={currentCase} />
          </div>
        </div>
      )}

      {activeModal === 'counterfactual' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CounterfactualModal currentCase={currentCase} onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}

      {activeModal === 'identity' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <IdentityEntropyModal currentCase={currentCase} onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}

      {activeModal === 'guardrails' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <PolicyGuardrailsModal currentCase={currentCase} onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}

      {activeModal === 'redteam' && currentCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <RedTeamLabModal currentCase={currentCase} onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-3 text-xs font-bold ${
            toastMessage.type === 'warning'
              ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800 shadow-slate-900/20'
              : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/20'
          }`}>
            {toastMessage.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
