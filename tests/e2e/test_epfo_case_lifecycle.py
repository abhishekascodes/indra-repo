import pytest
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from services.mock_government.state import GLOBAL_MOCK_STATE


@pytest.mark.asyncio
async def test_epfo_second_domain_case_lifecycle():
    """
    Verifies that the SAME INDRA Engine works on EPFO Employment / PF domain
    solely by switching the declarative Domain Plugin!
    """
    GLOBAL_MOCK_STATE.reset()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Step 1: Create Case in EPFO Domain
        create_res = await client.post("/api/cases", json={
            "title": "EPFO Form 19 Claim Rejection - Date of Exit Discrepancy",
            "citizen_name": "Pooja Sharma",
            "domain_id": "epfo_claim",
            "objective": "Resolve PF claim rejection caused by Date of Exit conflict between member master and relieving letter."
        })
        assert create_res.status_code == 200
        case_id = create_res.json()["id"]

        # Step 2: Ingest EPFO Evidence
        ingest_res = await client.post(f"/api/cases/{case_id}/ingest-flagship")
        assert ingest_res.status_code == 200
        case_data = ingest_res.json()

        # Step 3: Verify Contradiction Engine detected exit date mismatch
        assert len(case_data["contradictions"]) >= 1
        assert any(c["field"] == "date_of_exit" for c in case_data["contradictions"])

        # Step 4: Verify Candidate Cause
        assert len(case_data["candidate_causes"]) >= 1
        assert "Date of Exit" in case_data["candidate_causes"][0]["hypothesis"]

        # Step 5: Verify Joint Declaration Action Drafted
        assert len(case_data["actions"]) >= 1
        action = case_data["actions"][0]
        assert action["action_type"] == "EPFO_JOINT_DECLARATION_SUBMISSION"
        assert action["status"] == "PENDING_APPROVAL"

        # Step 6: Citizen Approves
        consent_res = await client.post(f"/api/cases/{case_id}/actions/{action['id']}/consent", json={"consent": True})
        assert consent_res.status_code == 200
        assert consent_res.json()["action"]["citizen_consent"] is True

        # Step 7: Submit to Mock EPFO
        submit_res = await client.post(f"/api/cases/{case_id}/actions/{action['id']}/submit")
        assert submit_res.status_code == 200
        assert submit_res.json()["case"]["current_state"] == "WAITING"

        # Step 8: Direct call to mock joint declaration approval & claim settlement
        jd_res = await client.post("/api/mock/epfo/submit-joint-declaration", json={
            "uan": "100982341120",
            "member_name": "Pooja Sharma",
            "corrected_exit_date": "15/04/2023",
            "employer_attestation": True
        })
        assert jd_res.status_code == 200
        assert jd_res.json()["status"] == "SUCCESS"
        assert jd_res.json()["settled_amount"] == 142500.0
