"""
Mock Government API Endpoints for INDRA
Exposes simulated interactive endpoints for PFMS, NPCI, Bank Branches, and EPFO.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
from services.mock_government.state import GLOBAL_MOCK_STATE

router = APIRouter(prefix="/mock", tags=["Mock Government Systems"])


class NPCIMandateUpdateRequest(BaseModel):
    aadhaar: str
    target_account_no: str
    target_ifsc: str
    citizen_consent: bool


class JointDeclarationSubmissionRequest(BaseModel):
    uan: str
    member_name: str
    corrected_exit_date: str
    employer_attestation: bool = True


class PFMSDisbursalRetryRequest(BaseModel):
    sanction_id: str
    aadhaar: str


@router.get("/pfms/status/{sanction_id:path}")
async def get_pfms_status(sanction_id: str):
    """Fetches real-time status of a central DBT disbursal from PFMS gateway."""
    data = GLOBAL_MOCK_STATE.pfms_disbursals.get(sanction_id)
    if not data:
        raise HTTPException(status_code=404, detail="Sanction ID not found in PFMS gateway.")
    return {"status": "SUCCESS", "data": data}


@router.post("/bank/update-npci-mandate")
async def update_npci_mandate(req: NPCIMandateUpdateRequest):
    """Simulates Bank Branch & NPCI APBS Aadhaar Seeding Update."""
    if not req.citizen_consent:
        raise HTTPException(status_code=400, detail="Cannot process bank mandate without citizen consent.")

    acc = GLOBAL_MOCK_STATE.bank_accounts.get(req.target_account_no)
    if not acc:
        raise HTTPException(status_code=404, detail=f"Bank account {req.target_account_no} not found.")

    # Update Bank Account state
    acc["npci_apbs_mapped"] = True

    # Update NPCI Mapper
    GLOBAL_MOCK_STATE.npci_mapper[req.aadhaar] = {
        "citizen_name": acc["holder_name"],
        "mapped_bank": acc["bank_name"],
        "mapped_account": req.target_account_no,
        "status": "ACTIVE",
        "last_updated": "2026-08-28"
    }

    return {
        "status": "SUCCESS",
        "message": f"Aadhaar {req.aadhaar} successfully seeded to {acc['bank_name']} ({req.target_account_no}). APBS Mapper Status: ACTIVE.",
        "receipt_id": f"NPCI-ACK-{uuid.uuid4().hex[:8].upper()}",
        "mapped_bank": acc["bank_name"],
        "mapped_account": req.target_account_no
    }


@router.post("/pfms/retry-disbursal")
async def retry_pfms_disbursal(req: PFMSDisbursalRetryRequest):
    """
    Simulates central PFMS payment execution.
    Inspects destination bank and NPCI APBS status to determine credit outcome.
    """
    disbursal = GLOBAL_MOCK_STATE.pfms_disbursals.get(req.sanction_id)
    if not disbursal:
        raise HTTPException(status_code=404, detail="Sanction record not found.")

    # Check NPCI Mapper
    mapper_entry = GLOBAL_MOCK_STATE.npci_mapper.get(req.aadhaar)
    if not mapper_entry or mapper_entry["status"] != "ACTIVE":
        disbursal["last_status"] = "REJECTED"
        disbursal["rejection_code"] = "BNS-404"
        disbursal["rejection_description"] = "Aadhaar Not Seeded / Inactive in NPCI Central APBS Mapper"
        return {
            "status": "FAILED",
            "error_code": "BNS-404",
            "message": disbursal["rejection_description"]
        }

    mapped_acc_no = mapper_entry["mapped_account"]
    bank_acc = GLOBAL_MOCK_STATE.bank_accounts.get(mapped_acc_no)

    if not bank_acc or bank_acc["debit_freeze"] or bank_acc["status"] != "ACTIVE":
        disbursal["last_status"] = "REJECTED"
        disbursal["rejection_code"] = "BNS-410"
        disbursal["rejection_description"] = "Destination Bank Account Inactive / Debit Freeze / Lien Restriction"
        return {
            "status": "FAILED",
            "error_code": "BNS-410",
            "message": disbursal["rejection_description"]
        }

    # Success: All prerequisites satisfied
    utr = f"PFMS-UTR-{uuid.uuid4().hex[:10].upper()}"
    disbursal["last_status"] = "CREDITED_SUCCESSFULLY"
    disbursal["rejection_code"] = None
    disbursal["settlement_utr"] = utr
    bank_acc["balance"] += disbursal["sanction_amount"]

    return {
        "status": "SUCCESS",
        "message": f"DBT Benefit of Rs. {disbursal['sanction_amount']} successfully credited to {bank_acc['bank_name']} ({mapped_acc_no}).",
        "utr_number": utr,
        "beneficiary": disbursal["beneficiary_name"],
        "credited_amount": disbursal["sanction_amount"],
        "account_new_balance": bank_acc["balance"]
    }


@router.get("/epfo/claim-status/{uan}")
async def get_epfo_claim_status(uan: str):
    """Fetches claim status from EPFO Field Master."""
    member = GLOBAL_MOCK_STATE.epfo_members.get(uan)
    if not member:
        raise HTTPException(status_code=404, detail="UAN not found in EPFO Master.")
    return {"status": "SUCCESS", "member_data": member}


@router.post("/epfo/submit-joint-declaration")
async def submit_epfo_joint_declaration(req: JointDeclarationSubmissionRequest):
    """Simulates online Joint Declaration processing under Revised SOP."""
    member = GLOBAL_MOCK_STATE.epfo_members.get(req.uan)
    if not member:
        raise HTTPException(status_code=404, detail="UAN not found.")

    member["member_master_exit_date"] = req.corrected_exit_date
    member["joint_declaration_status"] = "APPROVED"
    member["claim_status"] = "SETTLED"
    member["claim_rejection_code"] = None
    member["settled_amount"] = 142500.0

    return {
        "status": "SUCCESS",
        "message": f"Joint Declaration approved. Date of Exit updated to {req.corrected_exit_date}. Form 19 Claim settled for Rs. 1,42,500.00.",
        "acknowledgment_id": f"EPFO-JD-{uuid.uuid4().hex[:8].upper()}",
        "settled_amount": member["settled_amount"]
    }


@router.post("/reset")
async def reset_mock_state():
    """Resets mock world back to initial state."""
    GLOBAL_MOCK_STATE.reset()
    return {"status": "SUCCESS", "message": "Mock Government databases successfully reset."}
