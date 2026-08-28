import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CaseStoryView } from './components/CaseStoryView';
import { EvidenceVault } from './components/EvidenceVault';
import { CaseGraphView } from './components/CaseGraphView';
import { TimelineRail } from './components/TimelineRail';
import { api } from './services/api';
import type { Case, UIGraphData, Provenance } from './types';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<UIGraphData | null>(null);
  const [activeProvenance, setActiveProvenance] = useState<Provenance | null>(null);
  const [highlightedChainNodeIds, setHighlightedChainNodeIds] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'story' | 'graph' | 'evidence' | 'timeline'>('story');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initialize or load case
  const initializeCase = async (domainId: string = 'dbt_failure') => {
    try {
      setIsLoading(true);
      setHighlightedChainNodeIds([]);
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
    initializeCase('dbt_failure');
  }, []);

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

  const handleGrantConsent = async (actionId: string, consent: boolean) => {
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
      showToast('Action submitted directly to Bank / NPCI portal. Case entered WAITING state.');
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
      const res = await api.resolveDbtChain(currentCase.id);
      await refreshCase(currentCase.id);
      showToast(`Payment Disbursed! ₹48,000 credited successfully via UTR #${res.utr}`);
    } catch (err) {
      console.error('Error resolving chain:', err);
      showToast('Prerequisites not yet satisfied in bank portal', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAutopilot = async () => {
    if (!currentCase) return;
    try {
      setIsLoading(true);
      showToast('Executing Autonomous Case Resolution...', 'info');
      const res = await api.executeAutopilot(currentCase.id);
      await refreshCase(currentCase.id);
      if (res.utr) {
        showToast(`Autonomous Resolution Completed! ₹48,000 credited via UTR #${res.utr}`);
      } else {
        showToast('Autonomous Resolution Completed Successfully!');
      }
    } catch (err) {
      console.error('Error executing autopilot:', err);
      showToast('Error during autonomous execution', 'warning');
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
      showToast(res.message || 'Simulation event executed');
    } catch (err) {
      console.error('Error simulating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCausalChain = (nodeIds: string[]) => {
    setHighlightedChainNodeIds(nodeIds);
    setActiveView('graph');
    showToast('Causal path highlighted in graph topology');
  };

  const handleSelectProvenance = (prov: Provenance | null) => {
    setActiveProvenance(prov);
    if (prov) {
      setActiveView('evidence');
      showToast(`Focused Page ${prov.page_number} in Evidence Vault`);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      setHighlightedChainNodeIds([]);
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

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* 1. Header Command Bar & Workspace View Switcher */}
      <Header
        currentCase={currentCase}
        activeView={activeView}
        onSelectView={setActiveView}
        onAdvanceTime={handleAdvanceTime}
        onSelectDomain={initializeCase}
        onSimulateEvent={handleSimulateEvent}
        onExecuteAutopilot={handleExecuteAutopilot}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* 2. Main Full-Width Active View Canvas */}
      <main className="flex-1 overflow-hidden relative">
        {/* VIEW 1: CASE STORY & RESOLUTION HUB (Default) */}
        {activeView === 'story' && currentCase && (
          <CaseStoryView
            currentCase={currentCase}
            onGrantConsent={handleGrantConsent}
            onSubmitAction={handleSubmitAction}
            onResolveChain={handleResolveChain}
            onExecuteAutopilot={handleExecuteAutopilot}
            onHighlightCausalChain={handleToggleCausalChain}
            onViewGraph={() => setActiveView('graph')}
            isLoading={isLoading}
          />
        )}

        {/* VIEW 2: CASE GRAPH TOPOLOGY */}
        {activeView === 'graph' && (
          <CaseGraphView
            graphData={graphData}
            onSelectProvenance={handleSelectProvenance}
            highlightedChainNodeIds={highlightedChainNodeIds}
          />
        )}

        {/* VIEW 3: EVIDENCE VAULT & PROVENANCE */}
        {activeView === 'evidence' && (
          <EvidenceVault
            documents={currentCase?.documents || []}
            activeProvenance={activeProvenance}
            onSelectProvenance={setActiveProvenance}
          />
        )}

        {/* VIEW 4: CHRONOLOGY & TIMELINE */}
        {activeView === 'timeline' && currentCase && (
          <div className="h-full p-8 overflow-y-auto bg-slate-50 flex flex-col justify-center">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                Case Chronology & SLA Timeline
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Chronological sequence of all empirical extractions, citizen consents, portal submissions, and time-bound statutory escalations.
              </p>
              <TimelineRail
                timeline={currentCase.timeline}
                simulatedDay={currentCase.simulated_day}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. Toast Notification Banner */}
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
              className="p-1 hover:bg-white/20 rounded-full transition-colors ml-2"
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
