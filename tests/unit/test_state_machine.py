import pytest
from packages.schemas.models import Case, AgentState, ActionDraft, ActionStatus
from packages.case_engine.state_machine import CaseStateMachine, StateMachineError


def test_valid_deterministic_transitions():
    case = Case(
        id="CASE-SM-01",
        title="Test State Machine",
        citizen_name="Aakash Verma",
        domain_id="dbt_failure",
        current_state=AgentState.CASE_CREATED
    )

    # 1. CASE_CREATED -> EVIDENCE_ANALYSIS
    assert CaseStateMachine.can_transition(case.current_state, AgentState.EVIDENCE_ANALYSIS)
    case = CaseStateMachine.transition(case, AgentState.EVIDENCE_ANALYSIS)
    assert case.current_state == AgentState.EVIDENCE_ANALYSIS

    # 2. EVIDENCE_ANALYSIS -> ACTION_REQUIRED (needs at least one node or document)
    from packages.schemas.models import CaseDocument
    case.documents.append(CaseDocument(id="doc_test", filename="test.pdf", file_type="pdf"))
    case = CaseStateMachine.transition(case, AgentState.ACTION_REQUIRED)
    assert case.current_state == AgentState.ACTION_REQUIRED

    # 3. ACTION_REQUIRED -> USER_APPROVAL
    case = CaseStateMachine.transition(case, AgentState.USER_APPROVAL)
    assert case.current_state == AgentState.USER_APPROVAL

    # 4. USER_APPROVAL -> SUBMITTED fails without citizen consent
    with pytest.raises(StateMachineError):
        CaseStateMachine.transition(case, AgentState.SUBMITTED)

    # Add approved action with consent
    action = ActionDraft(
        id="act_1",
        action_type="BANK_UPDATE",
        target_institution="Canara Bank",
        purpose="Update Mandate",
        generated_content="Notice",
        status=ActionStatus.APPROVED,
        citizen_consent=True
    )
    case.actions.append(action)

    # Now transition succeeds
    case = CaseStateMachine.transition(case, AgentState.SUBMITTED)
    assert case.current_state == AgentState.SUBMITTED


def test_illegal_state_transition():
    case = Case(
        id="CASE-SM-02",
        title="Illegal Test",
        citizen_name="Ramesh",
        domain_id="dbt_failure",
        current_state=AgentState.CASE_CREATED
    )

    # Cannot jump directly from CASE_CREATED to RESOLUTION
    with pytest.raises(StateMachineError):
        CaseStateMachine.transition(case, AgentState.RESOLUTION)
