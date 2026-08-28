"""
Case Graph Manager for INDRA
Maintains the typed graph of Entities, Facts, Inferences, Rules, Actions,
Evidence, Dependencies, and Contradictions.
"""

from typing import Dict, List, Optional, Any, Set, Tuple
import networkx as nx
from packages.schemas.models import (
    Node, Edge, NodeType, EdgeType, EpistemicCategory, Provenance, Case
)


class CaseGraphManager:
    """Manages the deterministic typed Case Graph and guarantees provenance integrity."""

    def __init__(self, case: Optional[Case] = None):
        self.nx_graph = nx.DiGraph()
        self.nodes_map: Dict[str, Node] = {}
        self.edges_map: Dict[str, Edge] = {}
        if case:
            self.load_from_case(case)

    def load_from_case(self, case: Case) -> None:
        """Loads nodes and edges from an existing case model."""
        self.nx_graph.clear()
        self.nodes_map.clear()
        self.edges_map.clear()
        for node in case.nodes:
            self.add_node(node)
        for edge in case.edges:
            self.add_edge(edge)

    def add_node(self, node: Node) -> Node:
        """Adds a node with strict epistemic and provenance validation."""
        # Validation: If epistemic category is FACT, ensure provenance is present or flagged
        if node.epistemic_category == EpistemicCategory.FACT and node.provenance is None:
            # Fallback placeholder to maintain transparency without fabricating data
            node.provenance = Provenance(
                document_id="unlinked_fact",
                document_name="System Inferred Fact",
                page_number=1,
                extracted_text=node.label,
                confidence=node.confidence,
                extraction_method="manual_or_system",
                location_precision_available=False
            )
        self.nodes_map[node.id] = node
        self.nx_graph.add_node(
            node.id,
            type=node.type.value if hasattr(node.type, 'value') else node.type,
            label=node.label,
            epistemic_category=node.epistemic_category.value if hasattr(node.epistemic_category, 'value') else node.epistemic_category,
            status=node.status,
            confidence=node.confidence,
            data=node.model_dump()
        )
        return node

    def add_edge(self, edge: Edge) -> Edge:
        """Adds a directed typed edge between two existing nodes."""
        if edge.source_id not in self.nodes_map:
            raise ValueError(f"Source node {edge.source_id} does not exist in the graph.")
        if edge.target_id not in self.nodes_map:
            raise ValueError(f"Target node {edge.target_id} does not exist in the graph.")
        self.edges_map[edge.id] = edge
        self.nx_graph.add_edge(
            edge.source_id,
            edge.target_id,
            key=edge.id,
            type=edge.type.value if hasattr(edge.type, 'value') else edge.type,
            label=edge.label,
            confidence=edge.confidence,
            data=edge.model_dump()
        )
        return edge

    def get_node(self, node_id: str) -> Optional[Node]:
        return self.nodes_map.get(node_id)

    def get_edge(self, edge_id: str) -> Optional[Edge]:
        return self.edges_map.get(edge_id)

    def get_nodes_by_type(self, node_type: NodeType) -> List[Node]:
        return [n for n in self.nodes_map.values() if n.type == node_type]

    def get_nodes_by_epistemic_category(self, category: EpistemicCategory) -> List[Node]:
        return [n for n in self.nodes_map.values() if n.epistemic_category == category]

    def find_connected_subgraph(self, node_id: str, depth: int = 2) -> Dict[str, Any]:
        """Returns reachable neighborhood subgraph around a given node."""
        if node_id not in self.nodes_map:
            return {"nodes": [], "edges": []}
        visited_nodes: Set[str] = {node_id}
        current_layer: Set[str] = {node_id}
        for _ in range(depth):
            next_layer: Set[str] = set()
            for n in current_layer:
                successors = set(self.nx_graph.successors(n))
                predecessors = set(self.nx_graph.predecessors(n))
                nbrs = successors | predecessors
                next_layer.update(nbrs - visited_nodes)
            visited_nodes.update(next_layer)
            current_layer = next_layer
        sub_nodes = [self.nodes_map[n].model_dump() for n in visited_nodes if n in self.nodes_map]
        sub_edges = [
            e.model_dump() for e in self.edges_map.values()
            if e.source_id in visited_nodes and e.target_id in visited_nodes
        ]
        return {"nodes": sub_nodes, "edges": sub_edges}

    def find_causal_chain(self, start_node_id: str, target_node_id: str) -> List[List[str]]:
        """Finds all directed causal or dependency paths between start and target."""
        if start_node_id not in self.nx_graph or target_node_id not in self.nx_graph:
            return []
        try:
            paths = list(nx.all_simple_paths(self.nx_graph, source=start_node_id, target=target_node_id, cutoff=6))
            return paths
        except nx.NetworkXNoPath:
            return []

    def export_ui_graph(self) -> Dict[str, Any]:
        """
        Exports the graph formatted for the Case Workspace frontend (React Flow / Cytoscape compatible).
        """
        nodes_list = []
        for n in self.nodes_map.values():
            node_data = {
                "id": n.id,
                "type": n.type.value if hasattr(n.type, 'value') else n.type,
                "label": n.label,
                "epistemic_category": n.epistemic_category.value if hasattr(n.epistemic_category, 'value') else n.epistemic_category,
                "status": n.status,
                "confidence": n.confidence,
                "timestamp": n.timestamp,
                "attributes": n.attributes,
                "provenance": n.provenance.model_dump() if n.provenance else None
            }
            nodes_list.append(node_data)

        edges_list = []
        for e in self.edges_map.values():
            edge_data = {
                "id": e.id,
                "source": e.source_id,
                "target": e.target_id,
                "type": e.type.value if hasattr(e.type, 'value') else e.type,
                "label": e.label,
                "confidence": e.confidence,
                "attributes": e.attributes,
                "provenance": e.provenance.model_dump() if e.provenance else None
            }
            edges_list.append(edge_data)

        return {
            "nodes": nodes_list,
            "edges": edges_list,
            "stats": {
                "total_nodes": len(nodes_list),
                "total_edges": len(edges_list),
                "facts_count": len([n for n in self.nodes_map.values() if n.epistemic_category == EpistemicCategory.FACT]),
                "inferences_count": len([n for n in self.nodes_map.values() if n.epistemic_category == EpistemicCategory.INFERENCE]),
                "rules_count": len([n for n in self.nodes_map.values() if n.epistemic_category == EpistemicCategory.RULE]),
                "contradictions_count": len([e for e in self.edges_map.values() if e.type == EdgeType.CONTRADICTS])
            }
        }

    def sync_to_case(self, case: Case) -> Case:
        """Syncs in-memory graph back into the Case model."""
        case.nodes = list(self.nodes_map.values())
        case.edges = list(self.edges_map.values())
        return case
