"""
Action Generation and Citizen Agency Layer for INDRA
Drafts formal legal/administrative representations, manages consent, and coordinates submissions.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from packages.schemas.models import (
    Case, ActionDraft, ActionStatus, TimelineEvent, EpistemicCategory, Node, NodeType, EdgeType
)
from packages.case_engine.graph_manager import CaseGraphManager


class ActionLayer:
    """Coordinates actionable administrative interventions with mandatory citizen consent."""

    @classmethod
    def draft_action_plan(cls, case: Case, graph_mgr: CaseGraphManager) -> List[ActionDraft]:
        """
        Generates actionable administrative steps based on identified root causes and triggered rules.
        """
        actions: List[ActionDraft] = []
        now_str = datetime.now(timezone.utc).strftime('%d %B %Y')

        if case.domain_id == "dbt_failure":
            doc_citations = [f"Doc Ref #{d.id} ({d.filename})" for d in case.documents]
            content = f"""TO:
The Branch Manager,
Canara Bank / State Bank of India,
Lead District Office.

SUBJECT: URGENT APPLICATION FOR NPCI APBS AADHAAR MAPPING SEEDING & LIEN RECTIFICATION
CASE REFERENCE: {case.id}
BENEFICIARY: {case.citizen_name}

RESPECTED SIR/MADAM,

I am writing on behalf of the bonafide citizen {case.citizen_name} regarding non-disbursal of Post-Matric DBT Scholarship / Central Welfare Grant due to PFMS Rejection Code BNS-410 (Beneficiary Account Inactive / Debit Freeze / Lien Restriction).

EVIDENCE AND GROUNDS:
1. Scholarship Sanction: The Department of Social Welfare has approved and sanctioned the scholarship under Application ID #{case.id}.
2. Transaction Failure: PFMS Central Gateway attempted credit transfer which failed on destination bank routing due to inactive NPCI APBS mapping.
3. Supporting Documents Attached:
{chr(10).join(['   - ' + c for c in doc_citations])}

STATUTORY STATUTES & DIRECTIVES:
- RBI Master Direction on Aadhaar Payment Bridge System (APBS) Mapping (DPSS.CO.PD.No.1810/02.14.006/2015-16)
- DBT Mission Guidelines regarding Mandatory Zero-Delay Aadhaar Seeding

PRAYER / REQUESTED ACTION:
1. Immediately update and seed the citizen's active savings bank account on the NPCI Central Aadhaar Mapper.
2. Confirm APBS active status and issue NPCI Mapper Update Acknowledgment Slip.
3. Remove any unauthorized full debit freeze pursuant to RBI Consumer Protection Directives.

DATE: {now_str}
CITIZEN SIGNATURE / CONSENT: [PENDING CITIZEN CONFIRMATION]
"""
            action = ActionDraft(
                id=f"act_npci_{case.id}",
                action_type="NPCI_MAPPING_UPDATE_REQUEST",
                target_institution="Canara Bank / NPCI Lead Branch",
                purpose="Update NPCI APBS Aadhaar Seeding & Remove Bank Account Debit Restriction",
                legal_basis="RBI Master Direction DPSS.CO.PD.No.1810/02.14.006/2015-16 & DBT Mission Guidelines",
                evidence_ids=[d.id for d in case.documents],
                generated_content=content,
                status=ActionStatus.PENDING_APPROVAL,
                citizen_consent=False,
                created_at=datetime.now(timezone.utc).isoformat(),
                response_deadline=15
            )
            actions.append(action)

        elif case.domain_id == "epfo_claim":
            content = f"""TO:
The Regional Provident Fund Commissioner (RPFC-I),
Employees' Provident Fund Organisation (EPFO),
Regional Office.

SUBJECT: SUBMISSION OF JOINT DECLARATION FOR DATE OF EXIT RECTIFICATION UNDER REVISED SOP 2024
MEMBER: {case.citizen_name}
CASE REFERENCE: {case.id}

RESPECTED COMMISSIONER,

Kindly refer to the rejection of EPF Final Settlement Claim Form 19/10C for Member {case.citizen_name}.

GROUNDS:
1. Discrepancy: Member Master on Unified Portal reflects Date of Exit conflicting with the formal Service Relieving Certificate.
2. Under EPFO Standard Operating Procedure (SOP) Version 3.0 (2024), documentary evidence (Relieving Letter + Aadhaar) is submitted herewith for digital correction.

PRAYER:
1. Update Date of Exit in Field Office Master.
2. Permit online re-submission and settlement of Form 19 Claim.

DATE: {now_str}
"""
            action = ActionDraft(
                id=f"act_epfo_{case.id}",
                action_type="EPFO_JOINT_DECLARATION_SUBMISSION",
                target_institution="EPFO Regional Office",
                purpose="Submit Joint Declaration for Date of Exit Correction",
                legal_basis="EPFO Standard Operating Procedure (SOP) Version 3.0 (2024) on Joint Declarations",
                evidence_ids=[d.id for d in case.documents],
                generated_content=content,
                status=ActionStatus.PENDING_APPROVAL,
                citizen_consent=False,
                created_at=datetime.now(timezone.utc).isoformat(),
                response_deadline=15
            )
            actions.append(action)

        elif case.domain_id == "cyber_restriction":
            content = f"""TO:
The Cyber Crime Police Station / Bank Nodal Officer,
State Cyber Security Bureau.

SUBJECT: FORMAL REPRESENTATION FOR RESTRICTION OF LIEN TO DISPUTED LAYERED AMOUNT UNDER SEC 102 CrPC / SEC 107 BNSS
ACCOUNT HOLDER: {case.citizen_name}
CASE REFERENCE: {case.id}

RESPECTED SIR/MADAM,

I submit this formal representation regarding the complete debit freeze placed upon the citizen's bank account.

LEGAL POSITION:
Under High Court precedents (Gujarat High Court R/SCR.A/1908/2023), debit freezes for bonafide third parties must be restricted strictly to the disputed layered transaction amount, and total account operational freeze is unlawful.

PRAYER:
1. Modify total debit freeze to lien on disputed amount only.
2. Issue NOC to Bank Branch for restoring regular account operations.

DATE: {now_str}
"""
            action = ActionDraft(
                id=f"act_cyber_{case.id}",
                action_type="BANK_NODAL_LIEN_LIMITATION_PETITION",
                target_institution="Cyber Police Station & Bank Nodal Office",
                purpose="Petition for Partial Lien Restriction and Account Unfreeze NOC",
                legal_basis="Sec 102 CrPC / Sec 107 BNSS & High Court Proportionality Directives",
                evidence_ids=[d.id for d in case.documents],
                generated_content=content,
                status=ActionStatus.PENDING_APPROVAL,
                citizen_consent=False,
                created_at=datetime.now(timezone.utc).isoformat(),
                response_deadline=7
            )
            actions.append(action)

        case.actions = actions
        return actions

    @classmethod
    def grant_consent(cls, case: Case, action_id: str) -> ActionDraft:
        """Citizen explicitly approves an action draft."""
        for a in case.actions:
            if a.id == action_id:
                a.citizen_consent = True
                a.status = ActionStatus.APPROVED
                return a
        raise ValueError(f"Action {action_id} not found.")
