import React, { useState } from 'react';
import {
  User, FileText, AlertTriangle, CheckCircle2, Zap, Shield, GitCommit,
  Crosshair, Layers, ArrowRight, X, ZoomIn, ZoomOut, Maximize2,
  Table, GitFork, Activity, Sparkles
} from 'lucide-react';
import type { UIGraphData, Provenance } from '../types';

interface CaseGraphViewProps {
  graphData: UIGraphData | null;
  onSelectProvenance: (prov: Provenance | null) => void;
  highlightedChainNodeIds?: string[];
}

export const CaseGraphView: React.FC<CaseGraphViewProps> = ({
  graphData,
  onSelectProvenance,
  highlightedChainNodeIds = [],
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'topology' | 'matrix'>('topology');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs space-y-2 font-medium">
        <Activity className="w-5 h-5 animate-spin text-slate-400" />
        <span>Reconstructing Case Graph...</span>
      </div>
    );
  }

  const filteredNodes = categoryFilter === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.epistemic_category === categoryFilter);

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);

  const getNodeIcon = (type: string, category: string) => {
    if (category === 'CONTRADICTION' || type === 'CONTRADICTION') {
      return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
    }
    switch (type) {
      case 'PERSON':
        return <User className="w-3.5 h-3.5 text-blue-700" />;
      case 'DOCUMENT':
        return <FileText className="w-3.5 h-3.5 text-amber-700" />;
      case 'APPLICATION':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'TRANSACTION':
        return <Zap className="w-3.5 h-3.5 text-cyan-700" />;
      case 'DEPENDENCY':
        return <Layers className="w-3.5 h-3.5 text-purple-700" />;
      case 'RULE':
        return <Shield className="w-3.5 h-3.5 text-indigo-700" />;
      default:
        return <GitCommit className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'FACT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'INFERENCE':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'RULE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'SYSTEM_OBSERVATION':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'USER_ASSERTION':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const connectedEdges = selectedNode
    ? graphData.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="h-full flex flex-col bg-slate-100/70 relative select-none">
      {/* Top Toolbar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Case Graph Topology
            </span>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            ({graphData.stats.total_nodes} nodes, {graphData.stats.total_edges} relations)
          </span>

          {highlightedChainNodeIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Causal Chain Illuminated ({highlightedChainNodeIds.length})</span>
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          {/* Epistemic Filters */}
          <div className="hidden lg:flex items-center space-x-1 text-xs border-r border-slate-200 pr-2">
            {['ALL', 'FACT', 'INFERENCE', 'RULE', 'SYSTEM_OBSERVATION'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-md transition-all font-semibold ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat === 'SYSTEM_OBSERVATION' ? 'OBS' : cat}
              </button>
            ))}
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 space-x-0.5 text-xs">
            <button
              onClick={() => setViewMode('topology')}
              className={`p-1 rounded-sm transition-all ${
                viewMode === 'topology' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
              title="Graph View"
            >
              <GitFork className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1 rounded-sm transition-all ${
                viewMode === 'matrix' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
              className="p-1 text-slate-400 hover:text-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
              className="p-1 text-slate-400 hover:text-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-slate-800 rounded"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="flex-1 p-4 overflow-y-auto relative">
        {viewMode === 'topology' ? (
          <div
            className="transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const hasProvenance = !!node.provenance;
                const isContradiction = node.type === 'CONTRADICTION' || node.label.toLowerCase().includes('contra');
                const isCausalChain = highlightedChainNodeIds.includes(node.id);
                const isDimmed = highlightedChainNodeIds.length > 0 && !isCausalChain;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (node.provenance) {
                        onSelectProvenance(node.provenance);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative shadow-xs ${
                      isCausalChain
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400 shadow-md'
                        : isSelected
                        ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-400'
                        : isContradiction
                        ? 'bg-red-50/80 border-red-300 hover:border-red-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    } ${isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
                  >
                    {/* Top Type & Epistemic Pill */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <div className="p-1 rounded-md bg-slate-50 border border-slate-200">
                          {getNodeIcon(node.type, node.epistemic_category)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {node.type}
                        </span>
                      </div>

                      <span className={`text-[9px] px-2 py-0.2 rounded-full border font-bold uppercase ${getCategoryBadgeClass(node.epistemic_category)}`}>
                        {node.epistemic_category}
                      </span>
                    </div>

                    {/* Label */}
                    <div className="text-xs font-bold text-slate-900 mb-2 leading-snug">
                      {node.label}
                    </div>

                    {/* Provenance Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      {hasProvenance ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(node.id);
                            onSelectProvenance(node.provenance);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-semibold transition-colors text-[11px]"
                        >
                          <Crosshair className="w-3 h-3 text-indigo-500" />
                          <span className="truncate max-w-[120px]">{node.provenance.document_name}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">System Observation</span>
                      )}

                      <span className="text-slate-500 font-mono font-semibold text-[11px]">
                        {Math.round((node.confidence || 1.0) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Matrix Table */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="p-3">Type</th>
                  <th className="p-3">Epistemic Class</th>
                  <th className="p-3">Factual Content</th>
                  <th className="p-3">Source Provenance</th>
                  <th className="p-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNodes.map(node => (
                  <tr
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (node.provenance) onSelectProvenance(node.provenance);
                    }}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedNodeId === node.id ? 'bg-amber-50 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-slate-800">{node.type}</td>
                    <td className="p-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${getCategoryBadgeClass(node.epistemic_category)}`}>
                        {node.epistemic_category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-900 font-medium">{node.label}</td>
                    <td className="p-3 text-slate-600 text-xs">
                      {node.provenance ? `${node.provenance.document_name} (P.${node.provenance.page_number})` : 'System Observation'}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-700 font-mono">
                      {Math.round((node.confidence || 1.0) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-4 bg-white border-t border-slate-200 max-h-56 overflow-y-auto text-xs shadow-xl z-20">
          <div className="flex items-start justify-between mb-2.5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedNode.type}
                </span>
                <span className="text-slate-400 font-mono text-xs">{selectedNode.id}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${getCategoryBadgeClass(selectedNode.epistemic_category)}`}>
                  {selectedNode.epistemic_category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedNode.label}</h3>
            </div>

            <div className="flex items-center space-x-2">
              {selectedNode.provenance && (
                <button
                  onClick={() => onSelectProvenance(selectedNode.provenance)}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-600" />
                  <span>Highlight in Vault</span>
                </button>
              )}
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Epistemic Rationale
              </div>
              <p className="text-slate-800 text-xs leading-relaxed">
                {selectedNode.epistemic_category === 'FACT'
                  ? `Deterministically extracted from evidence record '${selectedNode.provenance?.document_name || 'System'}'. Empirical observation.`
                  : selectedNode.epistemic_category === 'INFERENCE'
                  ? 'Synthesized by the Causal Root-Cause Engine by reconciling administrative rules against observed transaction failures.'
                  : selectedNode.epistemic_category === 'RULE'
                  ? 'Statutory requirement from declarative domain policy plugin.'
                  : 'System observation returned from live institutional gateway.'}
              </p>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Connected Relations ({connectedEdges.length})
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {connectedEdges.length === 0 ? (
                  <div className="text-slate-400 italic text-xs">No active relational connections.</div>
                ) : (
                  connectedEdges.map(e => (
                    <div key={e.id} className="flex items-center space-x-1.5 text-xs text-slate-700">
                      <span className="text-indigo-700 font-bold">{e.type}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="truncate text-slate-600">{e.source === selectedNode.id ? e.target : e.source}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
