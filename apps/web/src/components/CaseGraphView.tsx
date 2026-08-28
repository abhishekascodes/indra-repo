import React, { useState } from 'react';
import {
  User, FileText, AlertTriangle, CheckCircle, Zap, Shield, GitCommit,
  Crosshair, Layers, ArrowRight, X
} from 'lucide-react';
import type { UIGraphData, Provenance } from '../types';

interface CaseGraphViewProps {
  graphData: UIGraphData | null;
  onSelectProvenance: (prov: Provenance | null) => void;
}

export const CaseGraphView: React.FC<CaseGraphViewProps> = ({
  graphData,
  onSelectProvenance,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F1F5F9] text-slate-500 text-xs font-mono">
        GENERATING CASE GRAPH INTELLIGENCE...
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
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />;
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
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'INFERENCE':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'RULE':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'SYSTEM_OBSERVATION':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'USER_ASSERTION':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const connectedEdges = selectedNode
    ? graphData.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="h-full flex flex-col bg-[#F1F5F9] relative select-none">
      {/* Top Bloomberg Terminal Filter Bar */}
      <div className="px-4 py-2.5 border-b border-slate-300 bg-white flex items-center justify-between z-10 shadow-xs font-mono">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-slate-800" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            CASE GRAPH TOPOLOGY
          </span>
          <span className="text-[10px] text-slate-500">
            [{graphData.stats.total_nodes} NODES | {graphData.stats.total_edges} EDGES]
          </span>
        </div>

        {/* Epistemic Filters */}
        <div className="flex items-center space-x-1 text-[10px] font-mono">
          {['ALL', 'FACT', 'INFERENCE', 'RULE', 'SYSTEM_OBSERVATION'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-1 rounded-xs transition-all font-bold ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat === 'SYSTEM_OBSERVATION' ? 'OBSERVATIONS' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph Grid */}
      <div className="flex-1 p-4 overflow-y-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const hasProvenance = !!node.provenance;
            const isContradiction = node.type === 'CONTRADICTION' || node.label.toLowerCase().includes('contra');

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  if (node.provenance) {
                    onSelectProvenance(node.provenance);
                  }
                }}
                className={`p-3 rounded border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-amber-50/60 border-amber-600 shadow-sm ring-1 ring-amber-500'
                    : isContradiction
                    ? 'bg-red-50/80 border-red-300 hover:border-red-500 shadow-2xs'
                    : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 rounded bg-slate-100 border border-slate-200">
                      {getNodeIcon(node.type, node.epistemic_category)}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {node.type}
                    </span>
                  </div>

                  <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border font-bold uppercase ${getCategoryBadgeClass(node.epistemic_category)}`}>
                    {node.epistemic_category}
                  </span>
                </div>

                {/* Node Label */}
                <div className="text-xs font-bold text-slate-900 mb-2 leading-tight">
                  {node.label}
                </div>

                {/* Provenance Footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[10px] font-mono">
                  {hasProvenance ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                        onSelectProvenance(node.provenance);
                      }}
                      className="text-amber-700 hover:text-amber-900 flex items-center space-x-1 font-semibold transition-colors"
                    >
                      <Crosshair className="w-3 h-3 text-amber-600" />
                      <span className="truncate max-w-[130px]">{node.provenance.document_name}</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 italic">SYSTEM DERIVED</span>
                  )}

                  <span className="text-slate-600 font-bold">
                    {Math.round((node.confidence || 1.0) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Inspector Bottom Drawer */}
      {selectedNode && (
        <div className="p-4 bg-white border-t border-slate-300 max-h-56 overflow-y-auto text-xs shadow-lg z-20">
          <div className="flex items-start justify-between mb-2.5">
            <div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  {selectedNode.type}
                </span>
                <span className="text-slate-500 text-[10px]">{selectedNode.id}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mt-1 font-mono">{selectedNode.label}</h3>
            </div>

            <div className="flex items-center space-x-2">
              {selectedNode.provenance && (
                <button
                  onClick={() => onSelectProvenance(selectedNode.provenance)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs font-mono font-bold flex items-center space-x-1 transition-all"
                >
                  <Crosshair className="w-3 h-3 text-amber-700" />
                  <span>VAULT LINK</span>
                </button>
              )}
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            {/* Left: Origin & Rationale */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                EPISTEMIC RATIONALE
              </div>
              <p className="text-slate-800 text-[10px] leading-relaxed font-sans">
                {selectedNode.epistemic_category === 'FACT'
                  ? `Deterministically extracted from evidence record '${selectedNode.provenance?.document_name || 'System'}'. Direct empirical observation.`
                  : selectedNode.epistemic_category === 'INFERENCE'
                  ? 'Synthesized by the Causal Root-Cause Engine by reconciling administrative rules against observed transaction failures.'
                  : selectedNode.epistemic_category === 'RULE'
                  ? 'Statutory requirement from declarative domain policy plugin.'
                  : 'System observation returned from live institutional gateway.'}
              </p>
            </div>

            {/* Right: Relational Connections */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                RELATIONAL CONNECTIONS ({connectedEdges.length})
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {connectedEdges.length === 0 ? (
                  <div className="text-slate-400 italic text-[10px]">No active relational edges.</div>
                ) : (
                  connectedEdges.map(e => (
                    <div key={e.id} className="flex items-center space-x-1.5 text-[10px] text-slate-700">
                      <span className="text-amber-700 font-bold">{e.type}</span>
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
