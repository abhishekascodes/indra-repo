import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EvidenceVault } from './components/EvidenceVault';
import { CaseGraphView } from './components/CaseGraphView';
import { IntelligencePanel } from './components/IntelligencePanel';
import { TimelineRail } from './components/TimelineRail';
import { api } from './services/api';
import type { Case, UIGraphData, Provenance } from './types';

export const App: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<UIGraphData | null>(null);
  const [activeProvenance, setActiveProvenance] = useState<Provenance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize or load flagship case
  const initializeCase = async (domainId: string = 'dbt_failure') => {
    try {
      setIsLoading(true);
      const title = domainId === 'dbt_failure'
        ? 'Post-Matric Scholarship DBT Failure'
        : 'EPFO Form 19 Claim Settlement Blockade';
      const citizen = domainId === 'dbt_failure' ? 'Aakash Verma' : 'Pooja Sharma';
      const objective = domainId === 'dbt_failure'
        ? 'Resolve Rs. 48,000 scholarship payment failure across PFMS, NPCI, and Canara Bank.'
        : 'Resolve EPF final settlement claim rejection caused by Date of Exit conflict.';

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
    } catch (err) {
      console.error('Error initializing case:', err);
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
      await api.resolveDbtChain(currentCase.id);
      await refreshCase(currentCase.id);
    } catch (err) {
      console.error('Error resolving chain:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      await api.resetMockState();
      if (currentCase) {
        await initializeCase(currentCase.domain_id);
      }
    } catch (err) {
      console.error('Error resetting mock state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F1F5F9] text-slate-900 overflow-hidden font-sans">
      {/* 1. Header Command Bar */}
      <Header
        currentCase={currentCase}
        onAdvanceTime={handleAdvanceTime}
        onSelectDomain={initializeCase}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* 2. Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Evidence Vault (25%) */}
        <div className="w-1/4 h-full">
          <EvidenceVault
            documents={currentCase?.documents || []}
            activeProvenance={activeProvenance}
            onSelectProvenance={setActiveProvenance}
          />
        </div>

        {/* Center: Case Graph Topology (45%) */}
        <div className="w-[45%] h-full">
          <CaseGraphView
            graphData={graphData}
            onSelectProvenance={setActiveProvenance}
          />
        </div>

        {/* Right: INDRA Intelligence & Action Center (30%) */}
        <div className="w-[30%] h-full">
          {currentCase && (
            <IntelligencePanel
              currentCase={currentCase}
              onGrantConsent={handleGrantConsent}
              onSubmitAction={handleSubmitAction}
              onResolveChain={handleResolveChain}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* 3. Bottom: Case Chronology Timeline Rail */}
      {currentCase && (
        <TimelineRail
          timeline={currentCase.timeline}
          simulatedDay={currentCase.simulated_day}
        />
      )}
    </div>
  );
};

export default App;
