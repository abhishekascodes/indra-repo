"""
Temporal Simulation Engine for INDRA
Handles simulated clock advancement, statutory deadline tracking, and automatic SLA escalations.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from packages.schemas.models import (
    Case, AgentState, ActionDraft, ActionStatus, TimelineEvent, EpistemicCategory
)
from packages.case_engine.state_machine import CaseStateMachine


class TemporalEngine:
    """Controls simulated time advancement and monitors institutional SLAs and deadlines."""

    @classmethod
    def advance_time(cls, case: Case, days_to_advance: int) -> Case:
        """
        Advances the simulated case timeline by N days and evaluates temporal triggers.
        """
        if days_to_advance <= 0:
            return case

        case.simulated_day += days_to_advance
        case.updated_at = datetime.utcnow().isoformat()

        # Log timeline event
        time_event = TimelineEvent(
            timestamp=case.updated_at,
            day_offset=case.simulated_day,
            title=f"Time Fast-Forward: +{days_to_advance} Days",
            description=f"Simulated clock advanced to Day {case.simulated_day}. Monitoring institutional deadlines.",
            event_type="TEMPORAL_ADVANCE",
            epistemic_category=EpistemicCategory.SYSTEM_OBSERVATION
        )
        case.timeline.append(time_event)

        # Check if case is currently WAITING on institutional response
        if case.current_state == AgentState.WAITING:
            submitted_actions = [
                a for a in case.actions
                if a.status == ActionStatus.SUBMITTED
            ]

            for action in submitted_actions:
                sla = int(action.response_deadline or 15)
                # If time elapsed exceeds SLA (e.g., 15 days), trigger statutory escalation
                if case.simulated_day >= sla:
                    # Transition to ESCALATION_REQUIRED
                    case = CaseStateMachine.transition(
                        case,
                        AgentState.ESCALATION_REQUIRED,
                        reason=f"Institutional response deadline ({sla} days SLA) expired without resolution on Day {case.simulated_day}."
                    )

                    # Draft Escalation Action
                    escalation_action = ActionDraft(
                        id=f"act_esc_{case.id}",
                        action_type="CPGRAMS_ADMINISTRATIVE_ESCALATION",
                        target_institution="CPGRAMS (Central Public Grievance Redress & Monitoring System) / Banking Ombudsman",
                        purpose=f"Statutory Administrative Escalation for Non-Compliance with {sla}-Day SLA",
                        supporting_evidence_ids=action.supporting_evidence_ids,
                        rule_id="RULE_DBT_PFMS_DISBURSAL_ESCALATION",
                        generated_content=f"""TO:
The Directorate of Public Grievances / Banking Ombudsman / CPGRAMS,
Government of India.

SUBJECT: STATUTORY ESCALATION FOR INACTION & SLA BREACH REGARDING CASE #{case.id}
PETITIONER: {case.citizen_name}

RESPECTED AUTHORITY,

This is a formal statutory grievance filed under the Citizen's Charter and DARPG Public Grievance Guidelines.

FACTUAL TIMELINE:
1. Citizen {case.citizen_name} submitted formal representation #{action.id} to destination institution on Day 0.
2. Statutory SLA for disposal ({sla} Days) elapsed on Day {sla}.
3. Case has reached Day {case.simulated_day} without compliance or written disposal.

PRAYER:
1. Initiate high-level administrative enquiry into delay.
2. Order immediate time-bound compliance and release of withheld citizen benefit.

DATE: Day {case.simulated_day} (Simulated Clock)
""",
                        status=ActionStatus.PENDING_APPROVAL,
                        citizen_consent=False,
                        created_at=datetime.utcnow().isoformat(),
                        response_deadline=30
                    )
                    case.actions.append(escalation_action)
                    break

        return case
