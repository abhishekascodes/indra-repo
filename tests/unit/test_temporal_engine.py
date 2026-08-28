import pytest
from packages.schemas.models import Case, AgentState, ActionDraft, ActionStatus
from packages.case_engine.temporal_engine import TemporalEngine


def test_temporal_fast_forward_and_automatic_escalation():
    case = Case(
        id="CASE-TIME-01",
        title="Temporal Test",
        citizen_name="Aakash Verma",
        domain_id="dbt_failure",
        current_state=AgentState.WAITING,
        simulated_day=0
    )
    action = ActionDraft(
        id="act_submitted_01",
        action_type="BANK_REPRESENTATION",
        target_institution="Canara Bank",
        purpose="NPCI Seeding",
        generated_content="Notice",
        status=ActionStatus.SUBMITTED,
        citizen_consent=True,
        response_deadline="15"
    )
    case.actions.append(action)

    # Fast forward time by 5 days (below 15 days SLA)
    case = TemporalEngine.advance_time(case, 5)
    assert case.simulated_day == 5
    assert case.current_state == AgentState.WAITING

    # Fast forward another 11 days (Total 16 days, exceeding 15 days SLA)
    case = TemporalEngine.advance_time(case, 11)
    assert case.simulated_day == 16
    # Should automatically transition to ESCALATION_REQUIRED and draft statutory grievance
    assert case.current_state == AgentState.ESCALATION_REQUIRED
    assert len(case.actions) == 2
    assert any(a.action_type == "CPGRAMS_ADMINISTRATIVE_ESCALATION" for a in case.actions)
