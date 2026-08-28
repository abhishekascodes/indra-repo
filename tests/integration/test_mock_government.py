import pytest
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from services.mock_government.state import GLOBAL_MOCK_STATE


@pytest.mark.asyncio
async def test_mock_government_endpoints_flow():
    # Reset mock state
    GLOBAL_MOCK_STATE.reset()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Check initial PFMS Status -> REJECTED (BNS-410)
        res = await client.get("/api/mock/pfms/status/DBT/2026/SCH-884920")
        assert res.status_code == 200
        data = res.json()
        assert data["data"]["rejection_code"] == "BNS-410"

        # 2. Try PFMS Retry before NPCI fix -> Should Fail
        res_retry = await client.post("/api/mock/pfms/retry-disbursal", json={
            "sanction_id": "DBT/2026/SCH-884920",
            "aadhaar": "XXXX-XXXX-8821"
        })
        assert res_retry.json()["status"] == "FAILED"

        # 3. Submit NPCI Mandate Update to SBI active account
        res_npci = await client.post("/api/mock/bank/update-npci-mandate", json={
            "aadhaar": "XXXX-XXXX-8821",
            "target_account_no": "38492018812",
            "target_ifsc": "SBIN0001067",
            "citizen_consent": True
        })
        assert res_npci.status_code == 200
        assert res_npci.json()["status"] == "SUCCESS"

        # 4. Now Retry PFMS Disbursal -> Should SUCCEED!
        res_retry2 = await client.post("/api/mock/pfms/retry-disbursal", json={
            "sanction_id": "DBT/2026/SCH-884920",
            "aadhaar": "XXXX-XXXX-8821"
        })
        assert res_retry2.status_code == 200
        assert res_retry2.json()["status"] == "SUCCESS"
        assert "utr_number" in res_retry2.json()
        assert res_retry2.json()["credited_amount"] == 48000.0
