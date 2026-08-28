"""
Domain Plugin Specification Schema for INDRA
Defines the declarative format for public administrative domains.
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class DomainRuleCondition(BaseModel):
    """Structured condition evaluated by the deterministic Rule Engine."""
    field: str
    operator: str  # "EQUALS", "NOT_EQUALS", "CONTAINS", "EXISTS", "IN", "GREATER_THAN"
    value: Any


class DomainRule(BaseModel):
    """Institutional / Statutory Rule definition."""
    rule_id: str
    name: str
    description: str
    source_statute_or_guideline: str
    conditions: List[DomainRuleCondition] = Field(default_factory=list)
    required_prerequisites: List[str] = Field(default_factory=list)
    suggested_action_type: Optional[str] = None
    suggested_action_title: Optional[str] = None
    statutory_deadline_days: Optional[int] = None
    escalation_authority: Optional[str] = None


class DomainProcedure(BaseModel):
    """Administrative procedure steps."""
    procedure_id: str
    name: str
    description: str
    steps: List[str] = Field(default_factory=list)
    required_documents: List[str] = Field(default_factory=list)
    expected_sla_days: int = 15


class DomainEntitySpec(BaseModel):
    """Entity definitions relevant to the domain."""
    name: str
    identifier_fields: List[str] = Field(default_factory=list)
    description: str


class DomainPlugin(BaseModel):
    """Full Domain Plugin specification."""
    domain_id: str
    title: str
    description: str
    version: str = "1.0.0"
    authoritative_institutions: List[str] = Field(default_factory=list)
    entities: List[DomainEntitySpec] = Field(default_factory=list)
    error_codes: Dict[str, str] = Field(default_factory=dict)
    rules: List[DomainRule] = Field(default_factory=list)
    procedures: List[DomainProcedure] = Field(default_factory=list)
    mock_service_routes: Dict[str, str] = Field(default_factory=dict)
