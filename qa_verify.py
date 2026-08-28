"""
QA Interactive Verification Script
Executes all end-to-end flows against the FastAPI application instance.
"""

import sys
import asyncio
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from services.mock_government.state import GLOBAL_MOCK_STATE


async def run_full_qa():
    print("=" * 65)
    print("       INDRA QA PASS - FULL INTERACTIVE VERIFICATION")
    print("=" * 65)

    GLOBAL_MOCK_STATE.reset()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # TEST 1: HEALTH
        h = await client.get("/api/health")
        assert h.status_code == 200
        print("[PASS] 1. System Health Check")

        # TEST 2: FLAGSHIP CASE CREATION & INGESTION
        create_res = await client.post("/api/cases", json={
            "title": "Cross-Domain DBT Failure & Bank Account Restriction",
            "citizen_name": "Aakash Verma",
            "domain_id": "dbt_failure",
            "objective": "Reconcile Rs. 48,000 scholarship payment blockage."
        })
        assert create_res.status_code == 200
        case_id = create_res.json()["id"]
        print(f"[PASS] 2. Case Created: {case_id}")

        ingest_res = await client.post(f"/api/cases/{case_id}/ingest-flagship")
        assert ingest_res.status_code == 200
        case = ingest_res.json()
        assert len(case["documents"]) >= 4
        assert len(case["nodes"]) >= 8
        assert len(case["candidate_causes"]) >= 1
        assert len(case["actions"]) >= 1
        print(f"[PASS] 3. Evidence Ingestion & Graph Reconstruction ({len(case['nodes'])} Nodes, {len(case['edges'])} Edges)")

        # TEST 3: GRAPH UI EXPORT
        graph_res = await client.get(f"/api/cases/{case_id}/graph")
        assert graph_res.status_code == 200
        graph_data = graph_res.json()
        assert len(graph_data["nodes"]) > 0
        print(f"[PASS] 4. Case Graph Export Verified ({graph_data['stats']['total_nodes']} UI Nodes)")

        # TEST 4: CITIZEN CONSENT GATE
        action_id = case["actions"][0]["id"]
        consent_res = await client.post(f"/api/cases/{case_id}/actions/{action_id}/consent", json={"consent": True})
        assert consent_res.status_code == 200
        assert consent_res.json()["action"]["citizen_consent"] is True
        print(f"[PASS] 5. Explicit Citizen Consent Granted for Action {action_id}")

        # TEST 5: ACTION SUBMISSION
        submit_res = await client.post(f"/api/cases/{case_id}/actions/{action_id}/submit")
        assert submit_res.status_code == 200
        submitted_case = submit_res.json()["case"]
        assert submitted_case["current_state"] == "WAITING"
        print(f"[PASS] 6. Action Submitted to Mock Portal -> State transitioned to WAITING")

        # TEST 6: TEMPORAL SIMULATION (+15 DAYS SLA) -> AUTOMATIC ESCALATION
        time_res = await client.post(f"/api/cases/{case_id}/advance-time", json={"days": 15})
        assert time_res.status_code == 200
        time_case = time_res.json()
        assert time_case["simulated_day"] == 15
        assert time_case["current_state"] == "ESCALATION_REQUIRED"
        assert any(a["action_type"] == "CPGRAMS_ADMINISTRATIVE_ESCALATION" for a in time_case["actions"])
        print(f"[PASS] 7. Temporal Simulation (+15D) triggered automatic CPGRAMS SLA Escalation")

        # TEST 7: DEMO ADAPTIVE SCENARIOS
        sim_delay = await client.post(f"/api/cases/{case_id}/simulate-event", json={"event_type": "GOV_DELAY"})
        assert sim_delay.status_code == 200
        print(f"[PASS] 8. Demo Control: Institutional Delay Simulated (Clock: Day {sim_delay.json()['case']['simulated_day']})")

        sim_evidence = await client.post(f"/api/cases/{case_id}/simulate-event", json={"event_type": "NEW_EVIDENCE"})
        assert sim_evidence.status_code == 200
        print(f"[PASS] 9. Demo Control: Supplemental Receipt Ingested dynamically")

        # TEST 8: RESOLUTION RECOVERY CYCLE
        res_chain = await client.post(f"/api/cases/{case_id}/resolve-dbt-chain")
        assert res_chain.status_code == 200
        resolved_case = res_chain.json()["case"]
        assert resolved_case["current_state"] == "RESOLUTION"
        print(f"[PASS] 10. PFMS Benefit Disbursal Resolved with UTR #{res_chain.json()['utr']} -> State RESOLUTION!")

        # TEST 9: SECOND DOMAIN (EPFO)
        epfo_res = await client.post("/api/cases", json={
            "title": "EPFO Exit Date Conflict",
            "citizen_name": "Pooja Sharma",
            "domain_id": "epfo_claim",
            "objective": "Resolve PF claim rejection caused by Date of Exit conflict."
        })
        assert epfo_res.status_code == 200
        epfo_id = epfo_res.json()["id"]

        epfo_ingest = await client.post(f"/api/cases/{epfo_id}/ingest-flagship")
        assert epfo_ingest.status_code == 200
        epfo_case = epfo_ingest.json()
        assert len(epfo_case["contradictions"]) >= 1
        assert any(c["field"] == "date_of_exit" for c in epfo_case["contradictions"])
        print(f"[PASS] 11. Second Domain (EPFO) Verified on same INDRA core with Exit Date Contradiction!")

    print("=" * 65)
    print("   ALL 11 INTERACTIVE QA CHECKPOINTS PASSED FLAWLESSLY!")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(run_full_qa())
