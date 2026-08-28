"""
Declarative Domain Plugin for EPFO (Employees' Provident Fund Organisation)
Handles EPF claim rejections, member exit date mismatches, Joint Declarations (JD),
UAN KYC verification, and employer non-attestation remediation.
"""

from packages.domain_plugins.plugin_schema import (
    DomainPlugin, DomainRule, DomainRuleCondition, DomainProcedure, DomainEntitySpec
)

EPFO_PLUGIN = DomainPlugin(
    domain_id="epfo_claim",
    title="EPFO Provident Fund & Pension Claim Settlement",
    description="Resolves Form 19/10C/31 claim rejections, Joint Declaration name/DOB/exit date corrections, and dormant PF transfer blockades.",
    version="1.0.0",
    authoritative_institutions=[
        "Employees' Provident Fund Organisation (EPFO)",
        "EPF Regional Office (RO / SRO)",
        "EPFiGMS Grievance Portal",
        "Establishment / Employer HR"
    ],
    entities=[
        DomainEntitySpec(name="EPF Member", identifier_fields=["uan", "member_id", "aadhaar_no"], description="Provident fund subscriber"),
        DomainEntitySpec(name="Establishment", identifier_fields=["establishment_id", "establishment_name"], description="Ex-employer / Current employer"),
        DomainEntitySpec(name="EPF Claim", identifier_fields=["claim_id", "claim_form_type", "rejection_reason"], description="Final settlement / advance withdrawal claim")
    ],
    error_codes={
        "EPFO-REJ-DATE-MISMATCH": "Date of Exit / Date of Joining in Member Master Conflicts with Service Record",
        "EPFO-REJ-NAME-MISMATCH": "Member Name in Aadhaar does not match EPFO Field Master (minor/major discrepancy)",
        "EPFO-REJ-KYC-PENDING": "Bank Account or PAN Seeded but not Digitally Signed by Employer",
        "EPFO-REJ-NCP-DAYS": "Non-Contributory Period (NCP) Days Discrepancy in Pension Form 10C"
    },
    rules=[
        DomainRule(
            rule_id="RULE_EPFO_JOINT_DECLARATION_REVISED_SOP",
            name="Joint Declaration under Revised EPFO SOP 2024",
            description="Under EPFO Circular No. WSU/2022/1/UIDAI Matter/Pt.II/3874, exit date and demographic corrections up to minor thresholds can be processed online with Joint Declaration countersigned by employer or approved directly via documentary proof if establishment is closed.",
            source_statute_or_guideline="EPFO Standard Operating Procedure (SOP) for Joint Declaration Version 3.0 (2024)",
            conditions=[
                DomainRuleCondition(field="error_code", operator="EQUALS", value="EPFO-REJ-DATE-MISMATCH")
            ],
            required_prerequisites=["Relieving Letter / Service Certificate", "Aadhaar Card", "Joint Declaration Form Signed by Member"],
            suggested_action_type="EPFO_JOINT_DECLARATION_SUBMISSION",
            suggested_action_title="Submit Joint Declaration for Date of Exit Correction",
            statutory_deadline_days=15,
            escalation_authority="Regional P.F. Commissioner (RPFC-I) / EPFiGMS"
        ),
        DomainRule(
            rule_id="RULE_EPFO_CLOSED_ESTABLISHMENT_ATTESTATION",
            name="Exempted Attestation for Closed Establishments",
            description="If the previous establishment has closed or is non-responsive, the Joint Declaration can be attested by an authorized bank manager, gazetted officer, or magistrate without employer digital signature.",
            source_statute_or_guideline="EPF Scheme 1952 Paragraph 72(5); EPFO Revised Manual of Accounting Procedure",
            conditions=[
                DomainRuleCondition(field="employer_status", operator="EQUALS", value="CLOSED_OR_UNRESPONSIVE")
            ],
            required_prerequisites=["Bank Manager Attestation", "Form 19 Claim Form", "Cancelled Cheque / Bank Passbook Copy"],
            suggested_action_type="EPFO_SPECIAL_OFFICER_REPRESENTATION",
            suggested_action_title="Submit Paragraph 72(5) Direct Claim to Regional PF Commissioner",
            statutory_deadline_days=20,
            escalation_authority="Central PF Commissioner (CPFC) / EPFiGMS Escalation Cell"
        )
    ],
    procedures=[
        DomainProcedure(
            procedure_id="PROC_EPFO_CLAIM_RECOVERY",
            name="Rejected PF Claim Resolution Workflow",
            description="Sequence: (1) Reconcile Date of Exit between Relieving Letter & UAN Unified Portal, (2) Generate Joint Declaration Form, (3) Submit to Regional Office via Unified Portal, (4) Re-submit Form 19/10C online.",
            steps=[
                "Extract Date of Exit discrepancy from Rejection Note and Relieving Letter",
                "Draft EPFO Joint Declaration Form with verified service dates",
                "Dispatch formal requisition to Employer Nodal Cell for digital attestation",
                "File EPFiGMS grievance if approval exceeds statutory 15 days SLA"
            ],
            required_documents=[
                "Relieving Letter / Experience Certificate",
                "Aadhaar Card Copy",
                "Form 19 / 10C Rejection Slip",
                "Cancelled Cheque with printed member name"
            ],
            expected_sla_days=15
        )
    ],
    mock_service_routes={
        "epfo_claim_status": "/api/mock/epfo/claim-status",
        "epfo_submit_jd": "/api/mock/epfo/submit-joint-declaration",
        "epfigms_grievance": "/api/mock/epfo/file-grievance"
    }
)
