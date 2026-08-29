import { useState, useEffect } from 'react';
import { api } from './services/api';
import type { Case, CaseDocument } from './types';
import { IndraNavbar } from './components/IndraNavbar';
import { PortalHomeView } from './components/PortalHomeView';
import { IndraCaseView } from './components/IndraCaseView';
import { IndraDocumentModal } from './components/IndraDocumentModal';
import { IndraPetitionModal } from './components/IndraPetitionModal';
import { IndraCertificateModal } from './components/IndraCertificateModal';
import { PresenterOverlay } from './components/PresenterOverlay';
import { LoginScreen } from './components/LoginScreen';
import confetti from 'canvas-confetti';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('indra_authenticated') === 'true';
  });
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'workspace'>('home');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument | null>(null);
  const [showPetitionModal, setShowPetitionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPresenter, setShowPresenter] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    loadCase('case-flagship-dbt-8821');
  }, []);

  const loadCase = async (caseId: string) => {
    setIsLoading(true);
    try {
      const c = await api.getCase(caseId);
      setCurrentCase(c);
    } catch (err) {
      console.error('Failed to load case:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (domainId: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('indra_authenticated', 'true');
    if (domainId === 'epfo_claim') {
      loadCase('case-epfo-pooja-002');
    } else {
      loadCase('case-flagship-dbt-8821');
    }
  };

  const handleSelectCase = async (caseId: string) => {
    await loadCase(caseId);
    setActiveTab('workspace');
  };

  // Web Speech API Voice Briefing
  const toggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if (!currentCase) return;
      window.speechSynthesis.cancel();
      const isDbt = currentCase.domain_id === 'dbt_failure';
      const isResolved = currentCase.current_state === 'RESOLUTION';
      const isWaiting = currentCase.current_state === 'WAITING';

      const text = isResolved
        ? `Administrative certainty restored. Entitlement has been successfully credited via official Treasury UTR reference.`
        : isWaiting
        ? `INDRA Sentinel is actively monitoring Canara Bank and NPCI for statutory compliance.`
        : `Hello ${currentCase.citizen_name}. Your ${isDbt ? '48,000 rupee scholarship' : 'provident fund claim'} was halted due to an upstream bank restriction. INDRA has prepared the legal petition to re-link your active account. Please slide to authorize.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGrantConsent = async (actionId: string, consent: boolean) => {
    if (!currentCase) return;
    try {
      const updated = await api.grantConsent(currentCase.id, actionId, consent);
      setCurrentCase(updated);
    } catch (err) {
      console.error('Failed to grant consent:', err);
    }
  };

  const handleSubmitAction = async (actionId: string) => {
    if (!currentCase) return;
    try {
      const updated = await api.submitAction(currentCase.id, actionId);
      setCurrentCase(updated);
    } catch (err) {
      console.error('Failed to submit action:', err);
    }
  };

  const handleResolveChain = async () => {
    if (!currentCase) return;
    try {
      const updated = await api.resolveDbtChain(currentCase.id);
      setCurrentCase(updated);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#2563EB', '#D97706'],
      });
    } catch (err) {
      console.error('Failed to resolve chain:', err);
    }
  };

  const handleAdvanceTime = async (days: number) => {
    if (!currentCase) return;
    try {
      const updated = await api.advanceTime(currentCase.id, days);
      setCurrentCase(updated);
    } catch (err) {
      console.error('Failed to advance time:', err);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetMockState();
      await loadCase('case-flagship-dbt-8821');
      setActiveTab('home');
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  // Keyboard shortcut Shift+D for Presenter Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        setShowPresenter((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col justify-between select-none">
      {/* 1. Global Light-Theme Top Navbar */}
      <IndraNavbar
        currentCase={currentCase || ({} as Case)}
        onSelectCase={handleSelectCase}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={toggleVoice}
        onOpenPresenter={() => setShowPresenter(true)}
        onReset={handleReset}
        onOpenPetition={() => setShowPetitionModal(true)}
      />

      {/* 2. Main Stage (Portal Home vs Case Workspace) */}
      <main className="flex-1 w-full overflow-y-auto">
        {activeTab === 'home' ? (
          <PortalHomeView
            onSelectCase={(caseId) => {
              handleSelectCase(caseId);
            }}
            onStartNewCase={() => {
              handleSelectCase('case-flagship-dbt-8821');
            }}
            onOpenDemoControls={() => setShowPresenter(true)}
          />
        ) : (
          currentCase && (
            <div className="space-y-4 pb-20">
              {/* Back to Home Breadcrumb */}
              <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs font-bold text-black hover:opacity-50 transition-opacity flex items-center space-x-2 cursor-pointer uppercase tracking-widest"
                >
                  <span>← Back</span>
                </button>
              </div>

              <IndraCaseView
                currentCase={currentCase}
                onGrantConsent={handleGrantConsent}
                onSubmitAction={handleSubmitAction}
                onResolveChain={handleResolveChain}
                onAdvanceTime={handleAdvanceTime}
                onReset={handleReset}
                onOpenDocument={(doc) => setSelectedDocument(doc)}
                onOpenPetition={() => setShowPetitionModal(true)}
                onOpenCertificate={() => setShowCertificateModal(true)}
                isLoading={isLoading}
              />
            </div>
          )
        )}
      </main>

      {/* 4. Overlays & Modals */}
      {selectedDocument && (
        <IndraDocumentModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {showPetitionModal && currentCase && (
        <IndraPetitionModal
          currentCase={currentCase}
          onClose={() => setShowPetitionModal(false)}
        />
      )}

      {showCertificateModal && currentCase && (
        <IndraCertificateModal
          currentCase={currentCase}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      <PresenterOverlay
        isOpen={showPresenter}
        onClose={() => setShowPresenter(false)}
        currentCase={currentCase}
        onAdvanceTime={handleAdvanceTime}
        onSelectDomain={(domain) => {
          if (domain === 'dbt') {
            loadCase('case-flagship-dbt-8821');
          } else {
            loadCase('case-epfo-pooja-002');
          }
        }}
        onSimulateEvent={(event) => {
          if (event === 'DISBURSAL_SUCCESS') {
            handleResolveChain();
          } else if (event === 'TIMEOUT_ESCALATION') {
            handleAdvanceTime(15);
          }
        }}
        onReset={handleReset}
      />
    </div>
  );
}

export default App;
