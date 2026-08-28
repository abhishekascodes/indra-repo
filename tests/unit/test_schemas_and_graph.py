import pytest
from packages.schemas.models import (
    Node, Edge, NodeType, EdgeType, EpistemicCategory, Provenance, Case, AgentState
)
from packages.case_engine.graph_manager import CaseGraphManager


def test_node_and_edge_creation():
    prov = Provenance(
        document_id="doc_1",
        document_name="sanction_order.pdf",
        page_number=1,
        bounding_box=[0.1, 0.2, 0.3, 0.4],
        extracted_text="Sanctioned: Rs. 48,000",
        confidence=0.99
    )
    node1 = Node(
        id="n_app_1",
        type=NodeType.APPLICATION,
        label="Scholarship Application",
        attributes={"amount": 48000, "status": "APPROVED"},
        epistemic_category=EpistemicCategory.FACT,
        provenance=prov
    )
    node2 = Node(
        id="n_resp_1",
        type=NodeType.RESPONSE,
        label="PFMS Rejection BNS-410",
        attributes={"error_code": "BNS-410"},
        epistemic_category=EpistemicCategory.FACT,
        provenance=prov
    )

    mgr = CaseGraphManager()
    mgr.add_node(node1)
    mgr.add_node(node2)

    edge = Edge(
        id="e_1",
        source_id=node1.id,
        target_id=node2.id,
        type=EdgeType.CAUSED_BY,
        label="FAILED_DISBURSAL"
    )
    mgr.add_edge(edge)

    assert len(mgr.nodes_map) == 2
    assert len(mgr.edges_map) == 1
    assert mgr.get_node("n_app_1").type == NodeType.APPLICATION
    assert mgr.get_edge("e_1").type == EdgeType.CAUSED_BY


def test_unlinked_fact_provenance_fallback():
    # If a fact node has no explicit provenance, ensure fallback is generated without fabricating data
    node = Node(
        id="n_fact_unlinked",
        type=NodeType.EVENT,
        label="Account Restricted",
        epistemic_category=EpistemicCategory.FACT,
        provenance=None
    )
    mgr = CaseGraphManager()
    mgr.add_node(node)
    saved_node = mgr.get_node("n_fact_unlinked")
    assert saved_node.provenance is not None
    assert saved_node.provenance.location_precision_available is False


def test_ui_graph_export():
    case = Case(
        id="CASE-TEST-001",
        title="Test Case",
        citizen_name="John Doe",
        domain_id="dbt_failure"
    )
    mgr = CaseGraphManager(case)
    n1 = Node(id="n1", type=NodeType.PERSON, label="John Doe", epistemic_category=EpistemicCategory.FACT)
    mgr.add_node(n1)
    export = mgr.export_ui_graph()

    assert "nodes" in export
    assert "edges" in export
    assert export["stats"]["total_nodes"] == 1
    assert export["stats"]["facts_count"] == 1
