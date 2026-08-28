import pytest
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from packages.schemas.models import Case, AgentState
from packages.case_engine.state_machine import CaseStateMachine, StateMachineError
from packages.case_engine.contradiction_engine import ContradictionEngine
from packages.case_engine.graph_manager import CaseGraphManager


@pytest.mark.asyncio
async def test_adversarial_user_denial_blocks_submission():
    """Verifies that an action without citizen consent is strictly rejected."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create case
        c_res = await client.post("/api/cases", json={
            "title": "Adversarial Consent Test",
            "citizen_name": "Test User",
            "domain_id": "dbt_failure"
        })
        case_id = c_res.json()["id"]

        # Ingest
        await client.post(f"/api/cases/{case_id}/ingest-flagship")

        # Get case to find action
        case_res = await client.get(f"/api/cases/{case_id}")
        action = case_res.json()["actions"][0]

        # Explicitly deny consent or submit without consent
        sub_res = await client.post(f"/api/cases/{case_id}/actions/{action['id']}/submit")
        assert sub_res.status_code == 400
        assert "consent" in sub_res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_adversarial_nonexistent_case():
    """Verifies safe error handling for missing case IDs."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/cases/NON_EXISTENT_CASE_9999")
        assert res.status_code == 404


def test_adversarial_corrupt_date_parsing():
    """Verifies that corrupted / irregular dates do not crash the engine."""
    norm = ContradictionEngine.normalize_date("InvalidDateString#99")
    assert norm == "99"
    norm_valid = ContradictionEngine.normalize_date("14/05/2001")
    assert norm_valid == "2001-05-14"
    assert ContradictionEngine.normalize_date("") is None


def test_adversarial_empty_graph_reasoning():
    """Verifies that an empty case with no evidence can safely exist without crashing."""
    case = Case(
        id="CASE-EMPTY-01",
        title="Empty Case",
        citizen_name="Ghost Citizen",
        domain_id="dbt_failure"
    )
    graph_mgr = CaseGraphManager(case)
    contradictions = ContradictionEngine.detect_contradictions(case, graph_mgr)
    assert len(contradictions) == 0
