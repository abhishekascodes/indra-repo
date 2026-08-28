"""
INDRA Core Schemas and Data Models
Strictly typed data structures for Epistemic Classification, Case Graph,
Provenance, Actions, Contradictions, and Agent State.
"""

from enum import Enum
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
import uuid
from datetime import datetime


class EpistemicCategory(str, Enum):
    """Explicit epistemic categorization to prevent LLM hallucination."""
    FACT = "FACT"                                     # Directly supported by verified evidence
    INFERENCE = "INFERENCE"                           # Derived hypothesis or causal speculation
    RULE = "RULE"                                     # Institutional / statutory / domain rule
    SYSTEM_OBSERVATION = "SYSTEM_OBSERVATION"         # Direct API response from institutional portal
    USER_ASSERTION = "USER_ASSERTION"                 # Unverified citizen claim or voice transcript
    UNKNOWN = "UNKNOWN"                               # Explicit unknown with missing evidence


class NodeType(str, Enum):
    """Typed nodes in the Case Graph."""
    PERSON = "PERSON"
    IDENTITY = "IDENTITY"
    INSTITUTION = "INSTITUTION"
    EVENT = "EVENT"
    DOCUMENT = "DOCUMENT"
    EVIDENCE = "EVIDENCE"
    TRANSACTION = "TRANSACTION"
    APPLICATION = "APPLICATION"
    RULE = "RULE"
    PROCEDURE = "PROCEDURE"
    ACTION = "ACTION"
    RESPONSE = "RESPONSE"
    DEADLINE = "DEADLINE"
    DEPENDENCY = "DEPENDENCY"
    CONTRADICTION = "CONTRADICTION"
    CASE_STATE = "CASE_STATE"


class EdgeType(str, Enum):
    """Typed relationships in the Case Graph."""
    RELATES_TO = "RELATES_TO"
    BELONGS_TO = "BELONGS_TO"
    MENTIONS = "MENTIONS"
    PROVES = "PROVES"
    CONTRADICTS = "CONTRADICTS"
    DEPENDS_ON = "DEPENDS_ON"
    CAUSED_BY = "CAUSED_BY"
    REQUIRES = "REQUIRES"
    SUBMITTED_TO = "SUBMITTED_TO"
    RESPONDED_BY = "RESPONDED_BY"
    PRECEDES = "PRECEDES"
    FOLLOWS = "FOLLOWS"
    ESCALATES_TO = "ESCALATES_TO"
    PROVES_ELIGIBILITY_FOR = "PROVES_ELIGIBILITY_FOR"


class AgentState(str, Enum):
    """Deterministic Agent State Machine states."""
    CASE_CREATED = "CASE_CREATED"
    EVIDENCE_ANALYSIS = "EVIDENCE_ANALYSIS"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    USER_APPROVAL = "USER_APPROVAL"
    SUBMITTED = "SUBMITTED"
    WAITING = "WAITING"
    RESPONSE_RECEIVED = "RESPONSE_RECEIVED"
    VERIFICATION = "VERIFICATION"
    ESCALATION_REQUIRED = "ESCALATION_REQUIRED"
    RESOLUTION = "RESOLUTION"
    BLOCKED = "BLOCKED"


class ActionStatus(str, Enum):
    """Status lifecycle of an administrative action."""
    DRAFTED = "DRAFTED"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUBMITTED = "SUBMITTED"
    EXECUTED = "EXECUTED"
    FAILED = "FAILED"


class ContradictionSeverity(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Provenance(BaseModel):
    """Exact provenance pointing back to raw evidence."""
    document_id: str
    document_name: str
    page_number: int = 1
    bounding_box: Optional[List[float]] = None  # Normalized [ymin, xmin, ymax, xmax] (0.0 to 1.0)
    extracted_text: str
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    extraction_method: str = "structured_json"  # "ocr_vision", "structured_json", "deterministic_parser", "system_api"
    location_precision_available: bool = True
    raw_snippet: Optional[str] = None


class Node(BaseModel):
    """Typed node in the Case Graph with strict provenance."""
    id: str = Field(default_factory=lambda: f"node_{uuid.uuid4().hex[:8]}")
    type: NodeType
    label: str
    attributes: Dict[str, Any] = Field(default_factory=dict)
    epistemic_category: EpistemicCategory = EpistemicCategory.FACT
    timestamp: Optional[str] = None
    status: str = "ACTIVE"
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    provenance: Optional[Provenance] = None


class Edge(BaseModel):
    """Typed edge between graph nodes."""
    id: str = Field(default_factory=lambda: f"edge_{uuid.uuid4().hex[:8]}")
    source_id: str
    target_id: str
    type: EdgeType
    label: str
    attributes: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    provenance: Optional[Provenance] = None


class Contradiction(BaseModel):
    """Deterministic or semantic conflict between two nodes/facts."""
    id: str = Field(default_factory=lambda: f"contra_{uuid.uuid4().hex[:8]}")
    field: str
    node_a_id: str
    node_b_id: str
    value_a: Any
    value_b: Any
    description: str
    severity: ContradictionSeverity = ContradictionSeverity.HIGH
    provenance_a: Optional[Provenance] = None
    provenance_b: Optional[Provenance] = None
    resolved: bool = False
    resolution_note: Optional[str] = None


class CandidateCause(BaseModel):
    """Explicitly formulated causal hypothesis."""
    id: str = Field(default_factory=lambda: f"cause_{uuid.uuid4().hex[:8]}")
    hypothesis: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.85)
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    counter_evidence_ids: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    causal_chain: List[str] = Field(default_factory=list)  # Sequence of node IDs
    recommended_remedy: Optional[str] = None


class ActionDraft(BaseModel):
    """Proposed administrative action requiring explicit citizen consent."""
    id: str = Field(default_factory=lambda: f"act_{uuid.uuid4().hex[:8]}")
    action_type: str
    target_institution: str
    purpose: str
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    rule_id: Optional[str] = None
    generated_content: str
    status: ActionStatus = ActionStatus.DRAFTED
    citizen_consent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    submitted_at: Optional[str] = None
    response_deadline: Optional[Union[str, int]] = None
    execution_payload: Optional[Dict[str, Any]] = None
    submission_receipt: Optional[Dict[str, Any]] = None


class TimelineEvent(BaseModel):
    """Chronological event along the case timeline."""
    id: str = Field(default_factory=lambda: f"evt_{uuid.uuid4().hex[:8]}")
    timestamp: str
    day_offset: int = 0
    title: str
    description: str
    event_type: str
    related_node_ids: List[str] = Field(default_factory=list)
    epistemic_category: EpistemicCategory = EpistemicCategory.FACT


class CaseDocument(BaseModel):
    """Uploaded multimodal evidence record."""
    id: str = Field(default_factory=lambda: f"doc_{uuid.uuid4().hex[:8]}")
    filename: str
    file_type: str  # "pdf", "image", "sms", "email", "receipt", "notice"
    uploaded_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    page_count: int = 1
    file_path: Optional[str] = None
    preview_url: Optional[str] = None
    raw_content: Optional[str] = None
    extractions_count: int = 0


class Case(BaseModel):
    """The Fundamental Unit of INDRA: The Citizen Case."""
    id: str = Field(default_factory=lambda: f"CASE-INDRA-{uuid.uuid4().hex[:4].upper()}")
    title: str
    citizen_name: str
    domain_id: str  # "dbt_failure", "cyber_restriction", "epfo_claim"
    current_state: AgentState = AgentState.CASE_CREATED
    objective: str = "Resolve administrative case"
    blocker_summary: Optional[str] = None
    overall_confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    simulated_day: int = 0
    documents: List[CaseDocument] = Field(default_factory=list)
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    contradictions: List[Contradiction] = Field(default_factory=list)
    candidate_causes: List[CandidateCause] = Field(default_factory=list)
    actions: List[ActionDraft] = Field(default_factory=list)
    timeline: List[TimelineEvent] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    facts_summary: List[str] = Field(default_factory=list)
    inferences_summary: List[str] = Field(default_factory=list)
