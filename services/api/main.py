"""
INDRA Master Backend API Service
FastAPI application orchestrating Case Graphs, Epistemic Classifications,
State Machine transitions, Action execution, and Mock Government interaction.
"""

import os
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from packages.schemas.models import (
    Case, AgentState, ActionStatus, ContradictionSeverity,
    EpistemicCategory, NodeType, EdgeType, Node, Edge, ActionDraft, TimelineEvent, CaseDocument
)
from packages.case_engine.graph_manager import CaseGraphManager
from packages.case_engine.state_machine import CaseStateMachine
from packages.case_engine.rule_engine import DeterministicRuleEngine
from packages.case_engine.contradiction_engine import ContradictionEngine
from packages.case_engine.root_cause_engine import RootCauseEngine
from packages.case_engine.temporal_engine import TemporalEngine
from packages.case_engine.action_layer import ActionLayer
from packages.case_engine.extractor import EvidenceExtractor
from packages.domain_plugins.plugin_loader import GLOBAL_PLUGIN_REGISTRY
from services.mock_government.routes import router as mock_gov_router
from services.mock_government.state import GLOBAL_MOCK_STATE


app = FastAPI(
    title="INDRA - Citizen Case Intelligence & Administrative Agency System",
    version="1.0.0",
    description="Deterministic Multimodal Case Graph and Administrative Engine"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Mock Government Endpoints
app.include_router(mock_gov_router, prefix="/api")

# In-Memory Case Store (can be persisted to SQLite)
CASES_DB: Dict[str, Case] = {}


# Request Models
class CreateCaseRequest(BaseModel):
    title: str
    citizen_name: str
    domain_id: str = "dbt_failure"
    objective: Optional[str] = None


class TimeAdvanceRequest(BaseModel):
    days: int = 15


class ActionConsentRequest(BaseModel):
    consent: bool = True


# API Endpoints
@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "system": "INDRA Citizen Case Intelligence Engine",
        "timestamp": datetime.utcnow().isoformat(),
        "active_cases": len(CASES_DB)
    }


@app.get("/api/domains")
async def list_domains():
    """Lists registered declarative domain plugins."""
    return {"domains": GLOBAL_PLUGIN_REGISTRY.list_plugins()}


@app.post("/api/cases", response_model=Case)
async def create_case(req: CreateCaseRequest):
    """Creates a fresh citizen case instance."""
    plugin = GLOBAL_PLUGIN_REGISTRY.get_plugin(req.domain_id)
    if not plugin:
        raise HTTPException(status_code=400, detail=f"Unknown domain: {req.domain_id}")

    case_id = f"CASE-INDRA-{uuid.uuid4().hex[:4].upper()}"
    objective = req.objective or f"Resolve {plugin.title} administrative discrepancy."

    case = Case(
        id=case_id,
        title=req.title,
        citizen_name=req.citizen_name,
        domain_id=req.domain_id,
        current_state=AgentState.CASE_CREATED,
        objective=objective,
        blocker_summary="Awaiting evidence ingestion and factual analysis.",
        overall_confidence=1.0,
        timeline=[
            TimelineEvent(
                timestamp=datetime.utcnow().isoformat(),
                day_offset=0,
                title="Case Initialized",
                description=f"INDRA Case opened for citizen {req.citizen_name} under domain '{plugin.title}'.",
                event_type="CASE_CREATION",
                epistemic_category=EpistemicCategory.FACT
            )
        ]
    )
    CASES_DB[case.id] = case
    return case


@app.get("/api/cases")
async def get_all_cases():
    """Lists all active cases in the system."""
    return list(CASES_DB.values())


@app.get("/api/cases/{case_id}", response_model=Case)
async def get_case(case_id: str):
    """Retrieves a complete case object."""
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")
    return case


@app.post("/api/cases/{case_id}/ingest-flagship")
async def ingest_flagship_data(case_id: str):
    """
    Ingests synthetic multimodal evidence corresponding to the case's domain.
    Extracts structured facts with exact spatial provenance and populates graph.
    """
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    data_dir = os.path.join(base_dir, "data", "synthetic")

    if case.domain_id == "dbt_failure":
        dataset_path = os.path.join(data_dir, "flagship_dbt")
        meta_file = "flagship_dbt_metadata.json"
    elif case.domain_id == "epfo_claim":
        dataset_path = os.path.join(data_dir, "epfo_case")
        meta_file = "epfo_metadata.json"
    else:
        dataset_path = os.path.join(data_dir, "flagship_dbt")
        meta_file = "flagship_dbt_metadata.json"

    # Ingest evidence
    graph_mgr = EvidenceExtractor.ingest_synthetic_dataset(case, dataset_path, meta_file)

    # Transition state: CASE_CREATED -> EVIDENCE_ANALYSIS
    if CaseStateMachine.can_transition(case.current_state, AgentState.EVIDENCE_ANALYSIS):
        case = CaseStateMachine.transition(case, AgentState.EVIDENCE_ANALYSIS, reason="Multimodal evidence ingested into Evidence Vault.")

    # Automatically trigger complete case reasoning
    return await execute_case_reasoning(case_id)


@app.post("/api/cases/{case_id}/reason")
async def execute_case_reasoning(case_id: str):
    """
    Executes core INDRA intelligence:
    1. Graph Sync
    2. Contradiction Detection
    3. Domain Rule Evaluation
    4. Causal Root-Cause Inference
    5. Action Plan Generation
    6. State Machine Progression
    """
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    graph_mgr = CaseGraphManager(case)
    plugin = GLOBAL_PLUGIN_REGISTRY.get_plugin(case.domain_id)

    # 1. Contradiction Detection
    contradictions = ContradictionEngine.detect_contradictions(case, graph_mgr)

    # 2. Domain Rule Evaluation
    triggered_rules = []
    if plugin:
        rule_results = DeterministicRuleEngine.evaluate_case_rules(case, plugin)
        triggered_rules = [r.to_dict() for r in rule_results]

    # 3. Root Cause Analysis
    candidate_causes = RootCauseEngine.analyze_root_cause(case, graph_mgr)

    # 4. Action Plan Drafting
    actions = ActionLayer.draft_action_plan(case, graph_mgr)

    # Summaries for UI
    case.facts_summary = [
        f"{n.label} (Source: {n.provenance.document_name if n.provenance else 'Direct'})"
        for n in case.nodes if n.epistemic_category == EpistemicCategory.FACT and n.type != NodeType.DOCUMENT
    ]

    # 5. State Machine Progression to ACTION_REQUIRED or USER_APPROVAL
    if case.actions and CaseStateMachine.can_transition(case.current_state, AgentState.ACTION_REQUIRED):
        case = CaseStateMachine.transition(
            case,
            AgentState.ACTION_REQUIRED,
            reason=f"Identified root cause and synthesized {len(case.actions)} procedural remedial action(s)."
        )
    if case.actions and CaseStateMachine.can_transition(case.current_state, AgentState.USER_APPROVAL):
        case = CaseStateMachine.transition(
            case,
            AgentState.USER_APPROVAL,
            reason="Awaiting explicit citizen approval before submitting administrative actions."
        )

    graph_mgr.sync_to_case(case)
    return case


@app.post("/api/cases/{case_id}/actions/{action_id}/consent")
async def grant_action_consent(case_id: str, action_id: str, req: ActionConsentRequest):
    """Citizen grants or denies explicit consent for an action."""
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    action = ActionLayer.grant_consent(case, action_id) if req.consent else None
    if not action:
        raise HTTPException(status_code=404, detail="Action not found.")

    # Timeline event
    case.timeline.append(TimelineEvent(
        timestamp=datetime.utcnow().isoformat(),
        day_offset=case.simulated_day,
        title=f"Citizen Consent Granted: {action.action_type}",
        description=f"Citizen approved action: '{action.purpose}'. Ready for administrative submission.",
        event_type="CITIZEN_CONSENT",
        epistemic_category=EpistemicCategory.FACT
    ))
    return {"status": "SUCCESS", "action": action}


@app.post("/api/cases/{case_id}/actions/{action_id}/submit")
async def submit_action_to_mock_system(case_id: str, action_id: str):
    """
    Submits an approved action directly to the stateful mock government service.
    Transitions state machine to SUBMITTED and then WAITING.
    """
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    action = next((a for a in case.actions if a.id == action_id), None)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found.")

    if not action.citizen_consent:
        raise HTTPException(status_code=400, detail="Cannot submit action without explicit citizen consent.")

    # Transition to SUBMITTED
    if CaseStateMachine.can_transition(case.current_state, AgentState.SUBMITTED):
        case = CaseStateMachine.transition(case, AgentState.SUBMITTED, reason=f"Submitted {action.action_type} to {action.target_institution}.")

    # Execute mock backend call based on action type
    if action.action_type == "NPCI_MAPPING_UPDATE_REQUEST":
        # Simulate Bank & NPCI Seeding with SBI active account
        GLOBAL_MOCK_STATE.bank_accounts["38492018812"]["npci_apbs_mapped"] = True
        GLOBAL_MOCK_STATE.npci_mapper["XXXX-XXXX-8821"] = {
            "citizen_name": case.citizen_name,
            "mapped_bank": "State Bank of India",
            "mapped_account": "38492018812",
            "status": "ACTIVE",
            "last_updated": "2026-08-28"
        }
        receipt = {
            "receipt_id": f"NPCI-ACK-{uuid.uuid4().hex[:8].upper()}",
            "submission_timestamp": datetime.utcnow().isoformat(),
            "institution": "Canara Bank Lead Branch & NPCI APBS Gateway",
            "status": "RECEIVED_AND_MAPPED",
            "mapped_bank": "State Bank of India",
            "mapped_account": "38492018812"
        }
        action.submission_receipt = receipt
        action.status = ActionStatus.SUBMITTED

    elif action.action_type == "EPFO_JOINT_DECLARATION_SUBMISSION":
        receipt = {
            "receipt_id": f"EPFO-ACK-{uuid.uuid4().hex[:8].upper()}",
            "submission_timestamp": datetime.utcnow().isoformat(),
            "institution": "EPFO Regional Office Delhi South",
            "status": "RECEIVED_UNDER_REVIEW",
            "sla_days": 15
        }
        action.submission_receipt = receipt
        action.status = ActionStatus.SUBMITTED

    # Transition to WAITING
    if CaseStateMachine.can_transition(case.current_state, AgentState.WAITING):
        case = CaseStateMachine.transition(
            case,
            AgentState.WAITING,
            reason=f"Awaiting institutional response from {action.target_institution} (SLA: {action.response_deadline or 15} days)."
        )

    return {"status": "SUCCESS", "case": case, "action": action}


@app.post("/api/cases/{case_id}/advance-time")
async def advance_case_time(case_id: str, req: TimeAdvanceRequest):
    """
    Advances simulated clock. Evaluates statutory deadlines and SLA escalations.
    """
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    case = TemporalEngine.advance_time(case, req.days)
    return case


@app.post("/api/cases/{case_id}/resolve-dbt-chain")
async def resolve_dbt_chain(case_id: str):
    """
    Completes the full resolution verification cycle:
    1. Checks NPCI status
    2. Retries PFMS Disbursal
    3. If PFMS succeeds, transitions to VERIFICATION -> RESOLUTION!
    """
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    # Check PFMS Disbursal
    disbursal = GLOBAL_MOCK_STATE.pfms_disbursals.get("DBT/2026/SCH-884920")
    mapper_entry = GLOBAL_MOCK_STATE.npci_mapper.get("XXXX-XXXX-8821")

    if mapper_entry and mapper_entry["status"] == "ACTIVE":
        bank_acc = GLOBAL_MOCK_STATE.bank_accounts.get(mapper_entry["mapped_account"])
        if bank_acc and not bank_acc["debit_freeze"] and bank_acc["status"] == "ACTIVE":
            utr = f"PFMS-UTR-{uuid.uuid4().hex[:10].upper()}"
            disbursal["last_status"] = "CREDITED_SUCCESSFULLY"
            disbursal["rejection_code"] = None
            disbursal["settlement_utr"] = utr
            bank_acc["balance"] += disbursal["sanction_amount"]

            # Add System Observation Node to Graph
            graph_mgr = CaseGraphManager(case)
            obs_node = Node(
                id=f"node_pfms_credit_{uuid.uuid4().hex[:6]}",
                type=NodeType.TRANSACTION,
                label=f"PFMS Disbursal Credit: Rs. {disbursal['sanction_amount']} (UTR #{utr})",
                attributes={"status": "CREDITED", "utr": utr, "amount": disbursal["sanction_amount"]},
                epistemic_category=EpistemicCategory.SYSTEM_OBSERVATION,
                confidence=1.0,
                provenance=None
            )
            graph_mgr.add_node(obs_node)

            # State Transitions: WAITING / ESCALATION -> RESPONSE_RECEIVED -> VERIFICATION -> RESOLUTION
            if case.current_state in [AgentState.WAITING, AgentState.ESCALATION_REQUIRED]:
                case = CaseStateMachine.transition(case, AgentState.RESPONSE_RECEIVED, reason="PFMS Payment Gateway confirmed successful benefit credit.")
            if case.current_state == AgentState.RESPONSE_RECEIVED:
                case = CaseStateMachine.transition(case, AgentState.VERIFICATION, reason="Verifying credit against destination bank balance.")
            if case.current_state == AgentState.VERIFICATION:
                case = CaseStateMachine.transition(case, AgentState.RESOLUTION, reason=f"Case Resolved: Benefit Rs. {disbursal['sanction_amount']} credited via UTR {utr}.")

            graph_mgr.sync_to_case(case)
            return {"status": "RESOLVED", "utr": utr, "case": case}

    raise HTTPException(status_code=400, detail="Prerequisites not satisfied in mock environment.")


@app.get("/api/cases/{case_id}/graph")
async def get_case_graph(case_id: str):
    """Exports UI-ready graph data for visualization in the Case Workspace."""
    case = CASES_DB.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    graph_mgr = CaseGraphManager(case)
    return graph_mgr.export_ui_graph()


@app.get("/api/evidence/preview/{doc_id}")
async def get_evidence_preview(doc_id: str):
    """Retrieves document file and bounding boxes for visual evidence viewer."""
    # Find document across all cases
    for case in CASES_DB.values():
        for doc in case.documents:
            if doc.id == doc_id:
                if doc.file_path and os.path.exists(doc.file_path):
                    media_type = "application/pdf" if doc.file_type == "pdf" else "text/plain"
                    return FileResponse(doc.file_path, media_type=media_type)
                return JSONResponse({"raw_content": doc.raw_content, "filename": doc.filename})
    raise HTTPException(status_code=404, detail="Evidence document not found.")
