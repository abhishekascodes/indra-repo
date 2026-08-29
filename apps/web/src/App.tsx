import React, { useState, useEffect } from 'react';
import {
  Shield, Sliders, RotateCcw, AlertTriangle,
  CheckCircle2, LogOut, X
} from 'lucide-react';
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
import type { Case, UIGraphData, Provenance, Node as GraphNode, AgentState } from './types';
import confetti from 'canvas-confetti';

const STATE_BADGE: Record<AgentState, { label: string; bg: string; text: string; dot: string }> = {
  CASE_CREATED: { label: 'WORKSPACE INITIALIZED', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
  EVIDENCE_ANALYSIS: { label: 'INGESTING MESSY EVIDENCE', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
  ACTION_REQUIRED: { label: 'CITIZEN AUTHORIZATION REQUIRED', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', dot: 'bg-amber-600' },
  USER_APPROVAL: { label: 'CITIZEN AUTHORIZATION REQUIRED', bg: 'bg-amber-50 border-amber-400', text: 'text-amber-900', dot: 'bg-amber-600' },
  SUBMITTED: { label: 'TRANSMISSION CONFIRMED', bg: 'bg-cyan-50 border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-600' },
  WAITING: { label: 'SENTINEL MODE ACTIVE (15D SLA)', bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-900 font-extrabold', dot: 'bg-yellow-600' },
  RESPONSE_RECEIVED: { label: 'RESPONSE RECEIVED', bg: 'bg-teal-50 border-teal-300', text: 'text-teal-800', dot: 'bg-teal-600' },
  VERIFICATION: { label: 'VALIDATING SETTLEMENT', bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  ESCALATION_REQUIRED: { label: 'STATUTORY SLA BREACH • CPGRAMS ESCALATION', bg: 'bg-red-50 border-red-300', text: 'text-red-700 font-extrabold', dot: 'bg-red-600' },
  RESOLUTION: { label: 'ADMINISTRATIVE CERTAINTY RESTORED', bg: 'bg-emerald-50 border-emerald-400', text: 'text-emerald-900 font-black', dot: 'bg-emerald-600' },
  BLOCKED: { label: 'ACTION BLOCKED', bg: 'bg-rose-50 border-rose-300', text: 'text-rose-700', dot: 'bg-rose-600' },
};

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('indra_auth') === 'true'
  );
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<UIGraphData | null>(null);
  const [activeProvenance, setActiveProvenance] = useState<Provenance | null>(null);
  const [selectedWhyNode, setSelectedWhyNode] = useState<GraphNode | null>(null);
  const [isProvenanceDrawerOpen, setIsProvenanceDrawerOpen] = useState<boolean>(false);
  const [isPresenterOverlayOpen, setIsPresenterOverlayOpen] = useState<boolean>(false);

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
  const initializeCase = async (domainId: string = 'dbt_failure') => {
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
      initializeCase('dbt_failure');
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
      showToast(consent ? 'Citizen consent granted! Ready for portal submission.' : 'Consent revoked.');
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
      showToast('Action Transmitted to Portal! Case entered Sentinel WAITING state.');
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
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
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
        await initializeCase(currentCase.domain_id);
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
          initializeCase(domainId);
        }}
      />
    );
  }

  const stateCfg = currentCase
    ? STATE_BADGE[currentCase.current_state] || { label: currentCase.current_state, bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' }
    : { label: 'INITIALIZING...', bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' };

  const isDbt = currentCase?.domain_id === 'dbt_failure';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* 1. TOP GLOBAL SOVEREIGN COMMAND HEADER                       */}
      {/* ============================================================ */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-2xs z-30">
        {/* Brand & Citizen Metadata */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm tracking-tight text-slate-900">
                INDRA
              </span>
              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                SOVEREIGN HYPERVISOR
              </span>
              <span className="text-[10px] font-mono font-black bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                {isDbt ? 'DBT / PFMS SCHOLARSHIP' : 'EPFO PF SETTLEMENT'}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Citizen: <strong className="text-slate-800">{currentCase?.citizen_name || 'Citizen'}</strong> • Macro Goal: <span className="font-bold text-slate-700">{isDbt ? 'Secure ₹48,000 Scholarship' : 'Reconcile Exit Date Conflict'}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Case Status Badge */}
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-2xl border text-xs flex items-center space-x-2 shadow-xs ${stateCfg.bg} ${stateCfg.text}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${stateCfg.dot} animate-pulse`} />
            <span className="font-black tracking-wider text-[11px]">{stateCfg.label}</span>
          </div>
        </div>

        {/* Right: Domain Switcher, Presenter & Controls */}
        <div className="flex items-center space-x-3">
          {/* Domain Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 space-x-1 text-xs">
            <button
              onClick={() => initializeCase('dbt_failure')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isDbt ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [1] DBT Scholarship
            </button>
            <button
              onClick={() => initializeCase('epfo_claim')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !isDbt ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [2] EPFO PF Claim
            </button>
          </div>

          {/* Presenter Mode Trigger (Shift+D) */}
          <button
            onClick={() => setIsPresenterOverlayOpen(true)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 rounded-2xl transition-all shadow-xs cursor-pointer"
            title="Presenter Controls (Shift+D)"
            aria-label="Presenter Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 rounded-2xl transition-all shadow-xs cursor-pointer"
            title="Reset Case (Day 0)"
            aria-label="Reset Case"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-red-600 hover:text-red-800 border border-slate-200 rounded-2xl transition-all shadow-xs cursor-pointer"
            title="Exit Sandbox"
            aria-label="Exit Sandbox"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN UNIFIED SOVEREIGN STUDIO VIEW                        */}
      {/* ============================================================ */}
      <main className="flex-1 overflow-hidden relative">
        {currentCase && (
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
      {/* 3. 480px LEFT PROVENANCE DRAWER (WHY? INTERACTION)           */}
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

      {/* ============================================================ */}
      {/* 4. PRESENTER OVERLAY (Shift+D / Ctrl+Shift+O)                */}
      {/* ============================================================ */}
      <PresenterOverlay
        isOpen={isPresenterOverlayOpen}
        onClose={() => setIsPresenterOverlayOpen(false)}
        currentCase={currentCase}
        onAdvanceTime={handleAdvanceTime}
        onSelectDomain={initializeCase}
        onSimulateEvent={handleSimulateEvent}
        onReset={handleReset}
      />

      {/* ============================================================ */}
      {/* 5. FORENSIC MODALS (Epistemic, Debugger, Replay, etc.)       */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* 6. TOAST NOTIFICATIONS BANNER                                */}
      {/* ============================================================ */}
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
