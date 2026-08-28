"""
INDRA Core Schemas and Data Models
Strictly typed data structures for Epistemic Classification, Case Graph,
Provenance, Actions, Contradictions, and Agent State.
"""

from enum import Enum
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone


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
    """Deterministic Lifecycle States for the Case Intelligence Agent."""
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
    """Execution status for administrative actions."""
    DRAFTED = "DRAFTED"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUBMITTED = "SUBMITTED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ContradictionSeverity(str, Enum):
    """Severity classification for factual discrepancies."""
    CRITICAL = "CRITICAL"
    FATAL = "FATAL"
    HIGH = "HIGH"
    WARNING = "WARNING"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class Provenance(BaseModel):
    """Strict multimodal evidence provenance linking claims directly to source artefacts."""
    document_id: str
    document_name: str
    page_number: int = 1
    bounding_box: Optional[List[float]] = None  # [ymin, xmin, ymax, xmax] normalized (0.0 - 1.0)
    extracted_text: str
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    extraction_method: str = "OCR_BOUNDING_BOX"  # "OCR_BOUNDING_BOX", "API_EXTRACTION", "NATIVE_PARSER"
    source_timestamp: Optional[str] = None
    location_precision_available: bool = True


class Node(BaseModel):
    """A typed node in the Case Graph."""
    id: str = Field(default_factory=lambda: f"node_{uuid.uuid4().hex[:8]}")
    type: NodeType
    label: str
    attributes: Dict[str, Any] = Field(default_factory=dict)
    epistemic_category: EpistemicCategory = EpistemicCategory.FACT
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    provenance: Optional[Provenance] = None
    status: Optional[str] = None
    timestamp: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Edge(BaseModel):
    """A typed relationship in the Case Graph."""
    id: str = Field(default_factory=lambda: f"edge_{uuid.uuid4().hex[:8]}")
    source_id: str
    target_id: str
    type: EdgeType
    label: Optional[str] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)
    epistemic_category: EpistemicCategory = EpistemicCategory.FACT
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    provenance: Optional[Provenance] = None


class Contradiction(BaseModel):
    """Identified factual or systemic conflict between two records."""
    id: str = Field(default_factory=lambda: f"contra_{uuid.uuid4().hex[:8]}")
    node_a_id: str
    node_b_id: str
    field: str
    value_a: Any
    value_b: Any
    severity: ContradictionSeverity
    description: str
    remedy_rule_id: Optional[str] = None
    resolved: bool = False
    provenance_a: Optional[Provenance] = None
    provenance_b: Optional[Provenance] = None


class CandidateCause(BaseModel):
    """Causal hypothesis generated by the Root Cause Engine."""
    id: str = Field(default_factory=lambda: f"cause_{uuid.uuid4().hex[:8]}")
    hypothesis: str
    confidence: float = Field(ge=0.0, le=1.0)
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    counter_evidence_ids: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    causal_chain: List[str] = Field(default_factory=list)  # Sequence of node IDs
    recommended_remedy: Optional[str] = None


class ActionDraft(BaseModel):
    """Generated administrative action representation or portal submission."""
    id: str = Field(default_factory=lambda: f"act_{uuid.uuid4().hex[:8]}")
    action_type: str  # "EPFO_JOINT_DECLARATION_SUBMISSION", "NPCI_MAPPING_UPDATE_REQUEST", "CPGRAMS_GRIEVANCE"
    target_institution: str
    purpose: str
    legal_basis: str = "Procedural Administrative Guidelines"
    generated_content: str  # Formatted letter/representation text
    evidence_ids: List[str] = Field(default_factory=list)
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    rule_id: Optional[str] = None
    citizen_consent: bool = False
    status: ActionStatus = ActionStatus.DRAFTED
    submission_receipt: Optional[Dict[str, Any]] = None
    response_deadline: Optional[Union[str, int]] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class TimelineEvent(BaseModel):
    """Chronological event record."""
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
    uploaded_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
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
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
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
