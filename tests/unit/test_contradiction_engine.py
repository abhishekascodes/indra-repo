import pytest
from packages.schemas.models import (
    Case, Node, NodeType, EpistemicCategory, Provenance, ContradictionSeverity
)
from packages.case_engine.graph_manager import CaseGraphManager
from packages.case_engine.contradiction_engine import ContradictionEngine


def test_dob_contradiction_detection():
    case = Case(
        id="CASE-CONTRA-01",
        title="DOB Conflict Case",
        citizen_name="Aakash Verma",
        domain_id="dbt_failure"
    )
    graph_mgr = CaseGraphManager(case)

    # Node 1: Aadhaar DOB 14/05/2001
    n1 = Node(
        id="node_doc1_dob",
        type=NodeType.EVIDENCE,
        label="Aadhaar DOB: 14/05/2001",
        attributes={"dob": "14/05/2001"},
        epistemic_category=EpistemicCategory.FACT
    )
    # Node 2: Certificate DOB 14/05/1999
    n2 = Node(
        id="node_doc2_dob",
        type=NodeType.EVIDENCE,
        label="Certificate DOB: 14/05/1999",
        attributes={"dob": "14/05/1999"},
        epistemic_category=EpistemicCategory.FACT
    )
    graph_mgr.add_node(n1)
    graph_mgr.add_node(n2)
    graph_mgr.sync_to_case(case)

    contradictions = ContradictionEngine.detect_contradictions(case, graph_mgr)

    assert len(contradictions) == 1
    assert contradictions[0].field == "date_of_birth"
    assert contradictions[0].severity == ContradictionSeverity.HIGH


def test_epfo_exit_date_contradiction():
    case = Case(
        id="CASE-CONTRA-02",
        title="EPFO Exit Date Conflict",
        citizen_name="Pooja Sharma",
        domain_id="epfo_claim"
    )
    graph_mgr = CaseGraphManager(case)

    n1 = Node(
        id="node_epfo_portal",
        type=NodeType.RESPONSE,
        label="Portal Exit Date: 31/03/2023",
        attributes={"date_of_exit": "31/03/2023"},
        epistemic_category=EpistemicCategory.FACT
    )
    n2 = Node(
        id="node_relieving_letter",
        type=NodeType.EVIDENCE,
        label="Relieving Letter Date: 15/04/2023",
        attributes={"date_of_exit": "15/04/2023"},
        epistemic_category=EpistemicCategory.FACT
    )
    graph_mgr.add_node(n1)
    graph_mgr.add_node(n2)
    graph_mgr.sync_to_case(case)

    contradictions = ContradictionEngine.detect_contradictions(case, graph_mgr)

    assert len(contradictions) == 1
    assert contradictions[0].field == "date_of_exit"
