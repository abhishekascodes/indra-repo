import React, { useState } from 'react';
import {
  User, FileText, AlertTriangle, CheckCircle, Zap, Shield, GitCommit,
  Crosshair, Layers, ArrowRight
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
      <div className="h-full flex items-center justify-center bg-[#090C12] text-slate-500 text-xs">
        Generating typed Case Graph...
      </div>
    );
  }

  const filteredNodes = categoryFilter === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.epistemic_category === categoryFilter);

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);

  const getNodeIcon = (type: string, category: string) => {
    if (category === 'CONTRADICTION' || type === 'CONTRADICTION') {
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
    switch (type) {
      case 'PERSON':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'APPLICATION':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'TRANSACTION':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'DEPENDENCY':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'RULE':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'FACT':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
      case 'INFERENCE':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/50';
      case 'RULE':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/50';
      case 'SYSTEM_OBSERVATION':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50';
      case 'USER_ASSERTION':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  // Connected edges for selected node
  const connectedEdges = selectedNode
    ? graphData.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="h-full flex flex-col bg-[#070A10] relative select-none">
      {/* Top Filter Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-[#0B0F17] flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Case Graph Intelligence
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({graphData.stats.total_nodes} Nodes, {graphData.stats.total_edges} Edges)
          </span>
        </div>

        {/* Epistemic Filters */}
        <div className="flex items-center space-x-1 text-[11px]">
          {['ALL', 'FACT', 'INFERENCE', 'RULE', 'SYSTEM_OBSERVATION'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat === 'SYSTEM_OBSERVATION' ? 'OBSERVATIONS' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph Canvas Grid */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400'
                    : isContradiction
                    ? 'bg-red-950/20 border-red-800/60 hover:border-red-500'
                    : 'bg-[#10141E]/90 border-slate-800 hover:border-slate-700 hover:bg-[#151B28]'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {getNodeIcon(node.type, node.epistemic_category)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      {node.type}
                    </span>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${getCategoryBadgeClass(node.epistemic_category)}`}>
                    {node.epistemic_category}
                  </span>
                </div>

                {/* Node Label */}
                <div className="text-xs font-semibold text-slate-200 mb-2 leading-snug">
                  {node.label}
                </div>

                {/* Provenance Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                  {hasProvenance ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                        onSelectProvenance(node.provenance);
                      }}
                      className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium transition-colors"
                    >
                      <Crosshair className="w-3 h-3 text-blue-400" />
                      <span className="truncate max-w-[120px]">{node.provenance.document_name}</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 italic">No direct file</span>
                  )}

                  <span className="text-slate-400 font-mono">
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
        <div className="p-4 bg-[#0D121D] border-t border-slate-800 max-h-56 overflow-y-auto text-xs shadow-2xl z-20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                  {selectedNode.type}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{selectedNode.id}</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">{selectedNode.label}</h3>
            </div>

            <div className="flex items-center space-x-2">
              {selectedNode.provenance && (
                <button
                  onClick={() => onSelectProvenance(selectedNode.provenance)}
                  className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Highlight in Vault</span>
                </button>
              )}
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-500 hover:text-slate-300 font-bold px-2"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Origin & Rationale */}
            <div className="space-y-2 bg-[#080B11] p-3 rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Why this node exists
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedNode.epistemic_category === 'FACT'
                  ? `Extracted deterministically from evidence record '${selectedNode.provenance?.document_name || 'System'}'. Verifies situational attribute.`
                  : selectedNode.epistemic_category === 'INFERENCE'
                  ? 'Synthesized by the Causal Root-Cause Engine by reconciling administrative rules against observed transaction failures.'
                  : selectedNode.epistemic_category === 'RULE'
                  ? 'Statutory requirement from declarative domain policy plugin.'
                  : 'System observation returned from live institutional gateway.'}
              </p>
            </div>

            {/* Right: Relational Connections */}
            <div className="space-y-2 bg-[#080B11] p-3 rounded-lg border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Connected Relationships ({connectedEdges.length})
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {connectedEdges.length === 0 ? (
                  <div className="text-slate-500 italic text-[11px]">No active relational edges.</div>
                ) : (
                  connectedEdges.map(e => (
                    <div key={e.id} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                      <span className="font-mono text-indigo-400 font-bold">{e.type}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="truncate text-slate-400">{e.source === selectedNode.id ? e.target : e.source}</span>
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
