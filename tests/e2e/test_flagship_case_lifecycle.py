import pytest
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from services.mock_government.state import GLOBAL_MOCK_STATE
from packages.schemas.models import AgentState


@pytest.mark.asyncio
async def test_complete_flagship_dbt_case_journey():
    """
    E2E Test of INDRA Flagship Case:
    1. Create DBT Case for Citizen Aakash Verma
    2. Ingest Evidence Vault (Sanction PDF, PFMS Rejection PDF, Canara Bank Statement, SBI Confirmation, SMS)
    3. Verify Structured Fact Extractions and Provenance
    4. Verify Contradictions & Candidate Root Cause (Lien -> NPCI Inactive -> PFMS BNS-410 Failure)
    5. Draft Action Plan (NPCI Mandate Update)
    6. Citizen Grants Explicit Consent
    7. Submit Action to Mock Government
    8. Case Enters WAITING state
    9. Fast-Forward Time (Simulated Clock)
    10. Execute PFMS Disbursal Resolution
    11. Verify Final State Transitions: RESPONSE_RECEIVED -> VERIFICATION -> RESOLUTION
    """
    GLOBAL_MOCK_STATE.reset()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Step 1: Create Case
        create_res = await client.post("/api/cases", json={
            "title": "Post-Matric Scholarship DBT Failure",
            "citizen_name": "Aakash Verma",
            "domain_id": "dbt_failure",
            "objective": "Resolve Rs. 48,000 scholarship payment blockage across PFMS and Canara Bank."
        })
        assert create_res.status_code == 200
        case_data = create_res.json()
        case_id = case_data["id"]
        assert case_data["current_state"] == "CASE_CREATED"

        # Step 2: Ingest Flagship Evidence Vault & Reason
        ingest_res = await client.post(f"/api/cases/{case_id}/ingest-flagship")
        assert ingest_res.status_code == 200
        reasoned_case = ingest_res.json()

        # Step 3: Verify Documents and Facts
        assert len(reasoned_case["documents"]) >= 4
        assert len(reasoned_case["nodes"]) >= 8
        assert reasoned_case["current_state"] == "USER_APPROVAL"

        # Step 4: Verify Candidate Root Cause
        assert len(reasoned_case["candidate_causes"]) >= 1
        top_cause = reasoned_case["candidate_causes"][0]
        assert "BNS-410" in top_cause["hypothesis"] or "NPCI" in top_cause["hypothesis"]
        assert top_cause["confidence"] > 0.85

        # Step 5: Verify Action Drafts
        assert len(reasoned_case["actions"]) >= 1
        action = reasoned_case["actions"][0]
        action_id = action["id"]
        assert action["status"] == "PENDING_APPROVAL"
        assert action["citizen_consent"] is False

        # Step 6: Citizen Grants Explicit Consent
        consent_res = await client.post(f"/api/cases/{case_id}/actions/{action_id}/consent", json={"consent": True})
        assert consent_res.status_code == 200
        assert consent_res.json()["action"]["citizen_consent"] is True
        assert consent_res.json()["action"]["status"] == "APPROVED"

        # Step 7: Submit Action to Mock Government
        submit_res = await client.post(f"/api/cases/{case_id}/actions/{action_id}/submit")
        assert submit_res.status_code == 200
        sub_data = submit_res.json()
        assert sub_data["action"]["status"] == "SUBMITTED"
        assert sub_data["case"]["current_state"] == "WAITING"

        # Step 8: Fast Forward Time by 3 days
        time_res = await client.post(f"/api/cases/{case_id}/advance-time", json={"days": 3})
        assert time_res.status_code == 200
        assert time_res.json()["simulated_day"] == 3

        # Step 9: Resolve DBT Payment Chain
        resolve_res = await client.post(f"/api/cases/{case_id}/resolve-dbt-chain")
        assert resolve_res.status_code == 200
        res_data = resolve_res.json()
        assert res_data["status"] == "RESOLVED"
        assert res_data["case"]["current_state"] == "RESOLUTION"
        assert "utr" in res_data

        # Step 10: Verify Graph Query Export
        graph_res = await client.get(f"/api/cases/{case_id}/graph")
        assert graph_res.status_code == 200
        graph_data = graph_res.json()
        assert graph_data["stats"]["total_nodes"] > 5
        assert graph_data["stats"]["facts_count"] > 3
