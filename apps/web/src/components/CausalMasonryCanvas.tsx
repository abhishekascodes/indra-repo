import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn, ZoomOut, RotateCcw, HelpCircle,
  Shield, AlertTriangle, FileText, ArrowRight,
  User, Database
} from 'lucide-react';
import type { UIGraphData, Node as GraphNode, Provenance, CaseDocument } from '../types';

interface CausalMasonryCanvasProps {
  graphData: UIGraphData | null;
  documents?: CaseDocument[];
  onSelectNode?: (node: GraphNode) => void;
  onSelectProvenance?: (prov: Provenance | null) => void;
  onOpenWhy?: (node: GraphNode) => void;
  highlightedChainNodeIds?: string[];
  focusedNodeId?: string | null;
}

export const CausalMasonryCanvas: React.FC<CausalMasonryCanvasProps> = ({
  graphData,
  onSelectNode,
  onSelectProvenance,
  onOpenWhy,
  focusedNodeId = null,
}) => {
  // Zoom level: 0.1 to 3.5
  // Level 0: < 0.25 (Macro Outcome)
  // Level 1: 0.25 - 0.45 (Institutional Actors)
  // Level 2: 0.45 - 1.1 (Causal Masonry - Primary View)
  // Level 3: 1.1 - 1.8 (Reasoning Chain)
  // Level 4: 1.8 - 2.8 (Source Document)
  // Level 5: > 2.8 (Atomic OCR Bounding Box)
  const [scale, setScale] = useState<number>(0.8);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 120, y: 80 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(focusedNodeId);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedNodeId) {
      setSelectedNodeId(focusedNodeId);
    }
  }, [focusedNodeId]);

  // Determine Semantic Level
  const getSemanticLevel = (s: number) => {
    if (s < 0.25) return 0;
    if (s < 0.45) return 1;
    if (s <= 1.1) return 2;
    if (s <= 1.8) return 3;
    if (s <= 2.8) return 4;
    return 5;
  };

  const currentLevel = getSemanticLevel(scale);

  // Zoom controls
  const handleZoom = (factor: number) => {
    setScale(prev => Math.max(0.15, Math.min(3.5, prev * factor)));
  };

  const handleResetZoom = () => {
    setScale(0.8);
    setPan({ x: 120, y: 80 });
    setSelectedNodeId(null);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale(prev => Math.max(0.15, Math.min(3.5, prev * zoomFactor)));
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.canvas-interactive-node')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const nodes = graphData?.nodes || [];

  // Categorize nodes for Causal Masonry placement on 8px grid
  const factNodes = nodes.filter(n => n.epistemic_category === 'FACT' && n.type !== 'DOCUMENT');
  const observationNodes = nodes.filter(n => n.epistemic_category === 'SYSTEM_OBSERVATION');
  const ruleNodes = nodes.filter(n => n.epistemic_category === 'RULE' || n.type === 'RULE');
  const inferenceNodes = nodes.filter(n => n.epistemic_category === 'INFERENCE' || n.type === 'DEPENDENCY');
  const actionNodes = nodes.filter(n => n.type === 'ACTION');
  const contradictionNodes = nodes.filter(n => n.type === 'CONTRADICTION' || n.epistemic_category === 'CONTRADICTION');

  return (
    <div
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full bg-[#FAFAFA] overflow-hidden select-none cursor-grab active:cursor-grabbing font-sans"
      role="graphics-document"
      aria-label="Causal Masonry and Semantic Zoom Workspace"
      style={{
        backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* 1. Top-Left Contextual Metadata & Semantic Level Badge */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center space-x-3">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              SEMANTIC ZOOM DEPTH
            </span>
            <span className="text-[10px] font-mono font-black bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
              LEVEL {currentLevel}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {currentLevel === 0 && 'Level 0: Macro Institutional Outcome'}
            {currentLevel === 1 && 'Level 1: Institutional Actors Topology'}
            {currentLevel === 2 && 'Level 2: Causal Masonry (Primary Working View)'}
            {currentLevel === 3 && 'Level 3: Grounded Reasoning Chain'}
            {currentLevel === 4 && 'Level 4: Raw Source Evidence Vault'}
            {currentLevel === 5 && 'Level 5: Atomic OCR Bounding Box'}
          </div>
        </div>
      </div>

      {/* 2. Bottom-Right Semantic Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-1.5 shadow-md">
        <button
          onClick={() => handleZoom(1.25)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Zoom In (Increase Semantic Detail)"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Zoom Out (Decrease Semantic Detail)"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold"
          title="Reset Zoom to Level 2 Overview"
          aria-label="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">100%</span>
        </button>
      </div>

      {/* 3. The 2D Transformed Canvas Layer */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `matrix(${scale}, 0, 0, ${scale}, ${pan.x}, ${pan.y})`
        }}
      >
        {/* ============================================================ */}
        {/* SEMANTIC LEVEL 0: MACRO OUTCOME (Scale < 0.25)                */}
        {/* ============================================================ */}
        {currentLevel === 0 && (
          <div className="w-[800px] p-12 bg-white border-4 border-slate-900 rounded-3xl shadow-2xl space-y-4 text-slate-900 font-sans">
            <span className="text-xs font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded">
              LEVEL 0 MACRO INSTITUTIONAL GOAL
            </span>
            <h1 className="text-3xl font-black">SECURE ₹48,000 POST-MATRIC SCHOLARSHIP</h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Autonomous administrative reconciliation of delayed welfare entitlement across PFMS Treasury Gateway, NPCI Mapper, and Canara Bank restriction.
            </p>
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Beneficiary: Aakash Verma</span>
              <span>Statutory Basis: RBI Master Direction & Gujarat HC Sec 102</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEMANTIC LEVEL 1: INSTITUTIONAL ACTORS (Scale 0.25 - 0.45)   */}
        {/* ============================================================ */}
        {currentLevel === 1 && (
          <div className="flex items-center space-x-8">
            <div className="w-64 p-6 bg-white border-2 border-blue-400 rounded-2xl shadow-md text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">CITIZEN</h3>
              <p className="text-xs text-slate-500">Aakash Verma (Entitled Student)</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400" />

            <div className="w-64 p-6 bg-white border-2 border-red-400 rounded-2xl shadow-md text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">CANARA BANK</h3>
              <p className="text-xs text-slate-500">Account *4401 Freeze Notice</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400" />

            <div className="w-64 p-6 bg-white border-2 border-teal-400 rounded-2xl shadow-md text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">NPCI APBS</h3>
              <p className="text-xs text-slate-500">Aadhaar Mapper INACTIVE</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400" />

            <div className="w-64 p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-md text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">PFMS TREASURY</h3>
              <p className="text-xs text-slate-500">Error BNS-410 Disbursal Block</p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEMANTIC LEVEL 2 & 3: CAUSAL MASONRY (Scale 0.45 - 1.8)     */}
        {/* Primary Working Blueprint on 8px Grid                         */}
        {/* ============================================================ */}
        {(currentLevel === 2 || currentLevel === 3) && (
          <div className="space-y-10 min-w-[1200px]">
            {/* Top Causal Flow Columns */}
            <div className="grid grid-cols-3 gap-8">
              {/* Column 1: Grounded Empirical Facts */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    1. Grounded Facts & Evidence
                  </h4>
                </div>

                <div className="space-y-3">
                  {factNodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (onSelectNode) onSelectNode(node);
                        if (node.provenance && onSelectProvenance) onSelectProvenance(node.provenance);
                      }}
                      className={`canvas-interactive-node p-4 bg-white border rounded-2xl shadow-xs transition-all cursor-pointer ${
                        selectedNodeId === node.id
                          ? 'border-blue-600 ring-2 ring-blue-300 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                      role="graphics-object"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <span>[CONFIRMED FACT]</span>
                        <span>{Math.round(node.confidence * 100)}% CONFIDENCE</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{node.label}</h5>
                      {node.attributes?.raw_snippet && (
                        <p className="text-[11px] text-slate-500 mt-1 font-mono line-clamp-2">
                          "{node.attributes.raw_snippet}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: System Observations & Applicable Statutory Rules */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    2. System Observations & Rules
                  </h4>
                </div>

                <div className="space-y-3">
                  {/* System Observations */}
                  {observationNodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (onSelectNode) onSelectNode(node);
                      }}
                      className="canvas-interactive-node p-4 bg-white border-l-4 border-l-blue-600 border border-slate-200 rounded-2xl shadow-xs space-y-1 cursor-pointer hover:shadow-sm"
                      role="graphics-object"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-teal-700 uppercase">
                        <span>[SYSTEM OBSERVATION]</span>
                        <span>LIVE QUERY</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{node.label}</h5>
                      <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        Status: INACTIVE • Routing: Canara Bank (*4401)
                      </div>
                    </div>
                  ))}

                  {/* Statutory Rules */}
                  {ruleNodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (onSelectNode) onSelectNode(node);
                      }}
                      className="canvas-interactive-node p-4 bg-slate-900 text-white rounded-none border border-slate-800 shadow-md space-y-1 cursor-pointer"
                      role="graphics-object"
                    >
                      <div className="text-[10px] font-bold text-amber-400 uppercase">
                        [STATUTORY RULE]
                      </div>
                      <h5 className="text-xs font-bold text-slate-100">{node.label}</h5>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        PFMS Disbursal SOP Section 4.3 • Error BNS-410 Account Inactive / Debit Freeze.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Root Cause Inferences & Remedial Action */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    3. Root Cause Hypothesis & Action
                  </h4>
                </div>

                <div className="space-y-3">
                  {/* Hypothesis (Epistemic Gold) */}
                  {inferenceNodes.map(node => (
                    <div
                      key={node.id}
                      className="canvas-interactive-node p-5 bg-amber-50/80 border border-amber-400/80 rounded-2xl shadow-md space-y-3"
                      role="graphics-object"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-serif font-black uppercase text-amber-900">
                          [ROOT CAUSE HYPOTHESIS]
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
                          {Math.round((node.confidence || 0.94) * 100)}% CONFIDENCE
                        </span>
                      </div>

                      <h5 className="text-sm font-serif font-bold text-slate-900 leading-snug">
                        {node.label}
                      </h5>

                      <p className="text-xs font-serif text-slate-700 leading-relaxed">
                        Upstream police freeze on Canara Bank account triggered NPCI mapper inactivation, blocking central PFMS scholarship routing.
                      </p>

                      {/* WHY? Button - The Provenance Trigger */}
                      <button
                        onClick={() => {
                          if (onOpenWhy) onOpenWhy(node);
                        }}
                        className="w-full py-2 bg-white hover:bg-slate-50 text-slate-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>WHY? Trace Grounding to Document (Level 5)</span>
                      </button>
                    </div>
                  ))}

                  {/* Remedial Action Block */}
                  {actionNodes.map(node => (
                    <div
                      key={node.id}
                      className="canvas-interactive-node p-4 bg-white border-b-4 border-b-blue-600 border border-slate-200 rounded-2xl shadow-xs space-y-2"
                      role="graphics-object"
                    >
                      <div className="text-[10px] font-bold text-blue-700 uppercase">
                        [REMEDIAL MANDATE]
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{node.label}</h5>
                      <p className="text-[11px] text-slate-600">
                        Remap central APBS Aadhaar routing to unencumbered State Bank of India account (*8812).
                      </p>
                    </div>
                  ))}

                  {/* Contradiction Fracture (For EPFO or conflicting dates) */}
                  {contradictionNodes.map(node => (
                    <div
                      key={node.id}
                      className="canvas-interactive-node relative p-4 bg-red-50 border border-red-300 rounded-2xl shadow-md overflow-hidden"
                      role="graphics-object"
                    >
                      {/* Diagonal Vermillion Fracture Line */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[120%] h-0.5 bg-red-600 -rotate-12 shadow-xs" />
                      </div>
                      <div className="relative z-10 space-y-1">
                        <div className="text-[10px] font-black text-red-700 uppercase">
                          [CONTRADICTION FRACTURE DETECTED]
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">{node.label}</h5>
                        <p className="text-[11px] text-slate-700">
                          Date of Exit in Relieving Letter (2025-10-31) conflicts with Employer ECR filing (2025-11-15).
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEMANTIC LEVEL 4 & 5: SOURCE DOCUMENT & BOUNDING BOX         */}
        {/* Scale > 1.8                                                  */}
        {/* ============================================================ */}
        {(currentLevel === 4 || currentLevel === 5) && (
          <div className="w-[900px] bg-white border-2 border-slate-300 rounded-3xl p-8 shadow-2xl space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>PFMS_Failure_Report.pdf (Level 5 Optical Grounding)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                PAGE 1 • OCR RESOLVED
              </span>
            </div>

            {/* Document Representation with Highlighted Bounding Box */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 font-mono text-xs text-slate-800 leading-relaxed">
              <div className="text-[10px] text-slate-400 uppercase">CENTRAL PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)</div>
              <div>SCHOLARSHIP TRANSACTION BATCH #BT-99120-AY26</div>
              <div>BENEFICIARY: AAKASH VERMA | SCHEME: POST-MATRIC (MINISTRY OF SOCIAL JUSTICE)</div>

              {/* Glowing Azure Bounding Box around BNS-410 */}
              <div className="p-4 bg-white border-2 border-blue-600 rounded-xl shadow-lg ring-4 ring-blue-200/60 space-y-1">
                <div className="text-[10px] font-black text-blue-800 uppercase tracking-wider">
                  OCR BOUNDING BOX [X: 120, Y: 450, W: 320, H: 80]
                </div>
                <div className="text-sm font-black text-red-700">
                  DISBURSAL FAILED: ERROR CODE BNS-410 (ACCOUNT BLOCKED / INACTIVE)
                </div>
                <div className="text-xs text-slate-600">
                  APBS Mapper returned INACTIVE for Aadhaar Token ****-****-8821.
                </div>
              </div>

              <div>STATUS: TRANSACTION_REJECTED • SANCTION AMOUNT: INR 48,000.00</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
