"""
Deterministic Agent State Machine for INDRA
Governs the life cycle of a case with deterministic transition validation.
"""

from typing import Dict, List, Set, Tuple, Optional
from packages.schemas.models import AgentState, Case, ActionStatus, TimelineEvent, EpistemicCategory
from datetime import datetime, timezone


class StateMachineError(Exception):
    """Raised when an invalid state transition is attempted."""
    pass


class CaseStateMachine:
    """Deterministic state machine enforcing procedural validity and citizen agency."""

    VALID_TRANSITIONS: Dict[AgentState, Set[AgentState]] = {
        AgentState.CASE_CREATED: {AgentState.EVIDENCE_ANALYSIS, AgentState.BLOCKED},
        AgentState.EVIDENCE_ANALYSIS: {AgentState.ACTION_REQUIRED, AgentState.RESOLUTION, AgentState.BLOCKED},
        AgentState.ACTION_REQUIRED: {AgentState.USER_APPROVAL, AgentState.BLOCKED},
        AgentState.USER_APPROVAL: {AgentState.SUBMITTED, AgentState.ACTION_REQUIRED, AgentState.BLOCKED},
        AgentState.SUBMITTED: {AgentState.WAITING, AgentState.BLOCKED},
        AgentState.WAITING: {AgentState.RESPONSE_RECEIVED, AgentState.ESCALATION_REQUIRED, AgentState.BLOCKED},
        AgentState.RESPONSE_RECEIVED: {AgentState.VERIFICATION, AgentState.ACTION_REQUIRED, AgentState.BLOCKED},
        AgentState.ESCALATION_REQUIRED: {AgentState.RESPONSE_RECEIVED, AgentState.USER_APPROVAL, AgentState.ACTION_REQUIRED, AgentState.BLOCKED},
        AgentState.VERIFICATION: {AgentState.RESOLUTION, AgentState.ACTION_REQUIRED, AgentState.BLOCKED},
        AgentState.RESOLUTION: {AgentState.EVIDENCE_ANALYSIS},
        AgentState.BLOCKED: {AgentState.EVIDENCE_ANALYSIS, AgentState.ACTION_REQUIRED, AgentState.USER_APPROVAL}
    }

    @classmethod
    def can_transition(cls, current_state: AgentState, target_state: AgentState) -> bool:
        """Checks if a transition between states is permissible."""
        return target_state in cls.VALID_TRANSITIONS.get(current_state, set())

    @classmethod
    def validate_transition(cls, case: Case, target_state: AgentState, reason: str = "") -> Tuple[bool, Optional[str]]:
        """
        Validates semantic prerequisites for transitioning state.
        Returns (is_valid, error_message).
        """
        current_state = case.current_state

        if not cls.can_transition(current_state, target_state):
            return False, f"Illegal transition from {current_state.value} to {target_state.value}."

        # Prerequisite: USER_APPROVAL -> SUBMITTED requires at least one APPROVED action
        if current_state == AgentState.USER_APPROVAL and target_state == AgentState.SUBMITTED:
            approved_actions = [a for a in case.actions if a.status == ActionStatus.APPROVED and a.citizen_consent]
            if not approved_actions:
                return False, "Cannot transition to SUBMITTED without explicit citizen consent on an action."

        # Prerequisite: EVIDENCE_ANALYSIS -> ACTION_REQUIRED requires analyzed evidence or detected blocker
        if current_state == AgentState.EVIDENCE_ANALYSIS and target_state == AgentState.ACTION_REQUIRED:
            if not case.nodes and not case.documents:
                return False, "Cannot transition to ACTION_REQUIRED without ingesting evidence or establishing graph facts."

        return True, None

    @classmethod
    def transition(cls, case: Case, target_state: AgentState, reason: str = "") -> Case:
        """
        Executes deterministic state transition and logs timeline event.
        """
        is_valid, err_msg = cls.validate_transition(case, target_state, reason)
        if not is_valid:
            raise StateMachineError(err_msg)

        prev_state = case.current_state
        case.current_state = target_state
        case.updated_at = datetime.now(timezone.utc).isoformat()

        event = TimelineEvent(
            timestamp=case.updated_at,
            day_offset=case.simulated_day,
            title=f"State: {target_state.value}",
            description=reason or f"Case transitioned from {prev_state.value} to {target_state.value}.",
            event_type="STATE_TRANSITION",
            epistemic_category=EpistemicCategory.FACT
        )
        case.timeline.append(event)
        return case
