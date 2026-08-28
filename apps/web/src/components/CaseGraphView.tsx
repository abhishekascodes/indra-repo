import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position,
  type Node as FlowNode,
  type Edge as FlowEdge,
  BackgroundVariant
} from '@xyflow/react';
import {
  User, FileText, AlertTriangle, CheckCircle2, Zap, Shield, GitCommit,
  Crosshair, Layers, ArrowRight, X, Table, GitFork, Sparkles
} from 'lucide-react';
import type { UIGraphData, Provenance } from '../types';

interface CaseGraphViewProps {
  graphData: UIGraphData | null;
  onSelectProvenance: (prov: Provenance | null) => void;
  highlightedChainNodeIds?: string[];
}

// Custom Node Component for React Flow
const CustomGraphNode = ({ data }: { data: any }) => {
  const node = data.node;
  const isSelected = data.isSelected;
  const isCausalChain = data.isCausalChain;
  const isDimmed = data.isDimmed;

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

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
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

  return (
    <div
      className={`w-64 p-3.5 rounded-2xl border transition-all shadow-md bg-white ${
        isCausalChain
          ? 'border-purple-500 ring-4 ring-purple-200 shadow-purple-100'
          : isSelected
          ? 'border-amber-500 ring-2 ring-amber-300'
          : node.type === 'CONTRADICTION'
          ? 'border-red-300 bg-red-50/40'
          : 'border-slate-200 hover:border-slate-300'
      } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white" />

      {/* Top Pill Row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-lg bg-slate-50 border border-slate-200">
            {getNodeIcon(node.type, node.epistemic_category)}
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {node.type}
          </span>
        </div>

        <span className={`text-[9px] px-2 py-0.2 rounded-full border font-bold uppercase ${getCategoryBadge(node.epistemic_category)}`}>
          {node.epistemic_category.replace('_', ' ')}
        </span>
      </div>

      {/* Node Label */}
      <div className="text-xs font-bold text-slate-900 mb-2 leading-snug">
        {node.label}
      </div>

      {/* Provenance Footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
        {node.provenance ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onSelectProvenance(node.provenance);
            }}
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-semibold text-[11px] truncate max-w-[140px]"
          >
            <Crosshair className="w-3 h-3 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{node.provenance.document_name}</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 italic">System Observation</span>
        )}

        <span className="text-slate-500 font-mono font-bold text-[11px]">
          {Math.round((node.confidence || 1.0) * 100)}%
        </span>
      </div>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode,
};

export const CaseGraphView: React.FC<CaseGraphViewProps> = ({
  graphData,
  onSelectProvenance,
  highlightedChainNodeIds = [],
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'canvas' | 'table'>('canvas');

  // Filter nodes
  const rawNodes = graphData?.nodes || [];
  const rawEdges = graphData?.edges || [];

  const filteredRawNodes = useMemo(() => {
    if (categoryFilter === 'ALL') return rawNodes;
    return rawNodes.filter(n => n.epistemic_category === categoryFilter);
  }, [rawNodes, categoryFilter]);

  // Convert to React Flow Nodes with layered positions
  const flowNodes: FlowNode[] = useMemo(() => {
    const cols = 3;
    return filteredRawNodes.map((n, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const isCausalChain = highlightedChainNodeIds.includes(n.id);
      const isDimmed = highlightedChainNodeIds.length > 0 && !isCausalChain;

      return {
        id: n.id,
        type: 'customNode',
        position: { x: col * 320 + 40, y: row * 180 + 40 },
        data: {
          node: n,
          isSelected: selectedNodeId === n.id,
          isCausalChain,
          isDimmed,
          onSelectProvenance,
        },
      };
    });
  }, [filteredRawNodes, selectedNodeId, highlightedChainNodeIds, onSelectProvenance]);

  // Convert to React Flow Edges
  const flowEdges: FlowEdge[] = useMemo(() => {
    const validNodeIds = new Set(filteredRawNodes.map(n => n.id));
    return rawEdges
      .filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map(e => {
        const isCausalEdge =
          highlightedChainNodeIds.includes(e.source) &&
          highlightedChainNodeIds.includes(e.target);

        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.type.replace(/_/g, ' '),
          animated: isCausalEdge,
          style: {
            stroke: isCausalEdge ? '#8B5CF6' : '#94A3B8',
            strokeWidth: isCausalEdge ? 3.5 : 1.5,
          },
          labelStyle: {
            fontSize: 9,
            fontWeight: 700,
            fill: isCausalEdge ? '#6D28D9' : '#64748B',
          },
        };
      });
  }, [rawEdges, filteredRawNodes, highlightedChainNodeIds]);

  const selectedNode = rawNodes.find(n => n.id === selectedNodeId);
  const connectedEdges = selectedNode
    ? rawEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="h-full flex flex-col bg-slate-50 relative select-none">
      {/* Top Toolbar */}
      <div className="h-12 px-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Interactive Case Graph Canvas
            </span>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            ({flowNodes.length} nodes, {flowEdges.length} active relations)
          </span>

          {highlightedChainNodeIds.length > 0 && (
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Causal Path Active ({highlightedChainNodeIds.length} Nodes)</span>
            </span>
          )}
        </div>

        {/* View Controls & Epistemic Filters */}
        <div className="flex items-center space-x-3">
          {/* Epistemic Filters */}
          <div className="hidden lg:flex items-center space-x-1 text-xs border-r border-slate-200 pr-3">
            {['ALL', 'FACT', 'INFERENCE', 'RULE', 'SYSTEM_OBSERVATION'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold text-xs ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat === 'SYSTEM_OBSERVATION' ? 'OBSERVATIONS' : cat}
              </button>
            ))}
          </div>

          {/* Toggle Canvas vs Table */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 space-x-1 text-xs">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center space-x-1 ${
                viewMode === 'canvas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center space-x-1 ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Canvas (React Flow) */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'canvas' ? (
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              const orig = rawNodes.find(n => n.id === node.id);
              if (orig?.provenance) {
                onSelectProvenance(orig.provenance);
              }
            }}
            fitView
            className="bg-slate-50/50"
          >
            <Background color="#CBD5E1" gap={24} size={1.5} variant={BackgroundVariant.Dots} />
            <Controls className="bg-white border border-slate-200 rounded-xl shadow-md p-1 m-4" />
            <MiniMap
              nodeColor="#818CF8"
              className="bg-white border border-slate-200 rounded-xl shadow-md m-4"
              zoomable
              pannable
            />
          </ReactFlow>
        ) : (
          /* Table Matrix View */
          <div className="p-6 h-full overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-bold">
                    <th className="p-3.5">Node Type</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">Factual Label</th>
                    <th className="p-3.5">Source Provenance</th>
                    <th className="p-3.5 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredRawNodes.map(node => (
                    <tr
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (node.provenance) onSelectProvenance(node.provenance);
                      }}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        selectedNodeId === node.id ? 'bg-amber-50/80 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3.5 font-bold text-slate-900">{node.type}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full border bg-slate-100 font-bold uppercase text-slate-700">
                          {node.epistemic_category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-900 font-medium">{node.label}</td>
                      <td className="p-3.5 text-slate-600">
                        {node.provenance ? `${node.provenance.document_name} (Page ${node.provenance.page_number})` : 'System Observation'}
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-800 font-mono">
                        {Math.round((node.confidence || 1.0) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-5 bg-white border-t border-slate-200 max-h-60 overflow-y-auto text-xs shadow-xl z-20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {selectedNode.type}
                </span>
                <span className="text-slate-400 font-mono text-xs">{selectedNode.id}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full border bg-slate-100 font-bold uppercase text-slate-700">
                  {selectedNode.epistemic_category}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">{selectedNode.label}</h3>
            </div>

            <div className="flex items-center space-x-2">
              {selectedNode.provenance && (
                <button
                  onClick={() => onSelectProvenance(selectedNode.provenance)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-600" />
                  <span>Highlight Provenance</span>
                </button>
              )}
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Epistemic Grounding
              </div>
              <p className="text-slate-800 text-xs leading-relaxed">
                {selectedNode.epistemic_category === 'FACT'
                  ? `Deterministically extracted from evidence record '${selectedNode.provenance?.document_name || 'System'}'. Verified empirical fact.`
                  : selectedNode.epistemic_category === 'INFERENCE'
                  ? 'Synthesized by the Causal Root-Cause Engine by reconciling administrative rules against observed transaction failures.'
                  : selectedNode.epistemic_category === 'RULE'
                  ? 'Statutory requirement from declarative domain policy plugin.'
                  : 'System observation returned from live institutional gateway.'}
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Connected Relational Links ({connectedEdges.length})
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {connectedEdges.length === 0 ? (
                  <div className="text-slate-400 italic text-xs">No active relational links.</div>
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
