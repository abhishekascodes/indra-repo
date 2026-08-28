"""
Declarative Domain Plugin for Cyber-Fraud / Bank Account Restriction
Handles Section 102 CrPC / Sec 107 BNSS lien holds, cyber police notice verification,
unfreezing petitions, and banking ombudsman procedures.
"""

from packages.domain_plugins.plugin_schema import (
    DomainPlugin, DomainRule, DomainRuleCondition, DomainProcedure, DomainEntitySpec
)

CYBER_PLUGIN = DomainPlugin(
    domain_id="cyber_restriction",
    title="Cyber Cell Bank Account Restriction & Lien Unfreezing",
    description="Resolves sudden bank account debit freezes, cyber cell lien notices, and legitimate citizen merchant/student freeze remediation.",
    version="1.0.0",
    authoritative_institutions=[
        "State Cyber Crime Police Station",
        "National Cyber Crime Reporting Portal (NCRP / I4C)",
        "Commercial Bank Nodal Office",
        "Chief Judicial Magistrate Court"
    ],
    entities=[
        DomainEntitySpec(name="Account Holder", identifier_fields=["pan_no", "account_no", "name"], description="Citizen facing account restriction"),
        DomainEntitySpec(name="Lien / Freeze Notice", identifier_fields=["acknowledgment_no", "police_station", "disputed_amount"], description="Formal police requisition under Sec 102 CrPC / Sec 107 BNSS"),
        DomainEntitySpec(name="Transaction", identifier_fields=["utr_no", "txn_date", "txn_amount"], description="Disputed credit/debit trail")
    ],
    error_codes={
        "LIEN-POLICE-102": "Debit Freeze under Sec 102 CrPC / Sec 107 BNSS Requisition",
        "KYC-RE-KYC-PENDING": "Periodic Re-KYC Non-Compliance Hold",
        "AML-SUSPICIOUS-FLAG": "Internal Bank Anti-Money Laundering Rule Flag"
    },
    rules=[
        DomainRule(
            rule_id="RULE_CYBER_LIEN_LIMITATION_TO_DISPUTED_AMOUNT",
            name="Bank Lien Proportionality Rule",
            description="Under High Court precedents (e.g. Madras HC & Gujarat HC guidelines), banks may only freeze the disputed layered amount, not the entire bank account balance or operational debit facility for non-implicated citizens.",
            source_statute_or_guideline="High Court of Gujarat in R/SCR.A/1908/2023; RBI Master Circular on Customer Service Section 8",
            conditions=[
                DomainRuleCondition(field="freeze_type", operator="EQUALS", value="FULL_ACCOUNT_FREEZE")
            ],
            required_prerequisites=["Legitimate Source of Funds Proof", "Police Notice Copy / Acknowledgement Number"],
            suggested_action_type="BANK_NODAL_LIEN_LIMITATION_PETITION",
            suggested_action_title="Petition to Nodal Officer for Partial Lien Restriction (Disputed Amount Only)",
            statutory_deadline_days=7,
            escalation_authority="Banking Ombudsman / Cyber Grievance Appellate Authority"
        ),
        DomainRule(
            rule_id="RULE_CYBER_POLICE_NOC_SUBMISSION",
            name="Cyber Cell Investigation NOC Submission",
            description="Where citizen proves bonafide receipt of funds (e.g. scholarship, salary, goods sold), Cyber Cell IO must issue No Objection Certificate (NOC) to bank within statutory enquiry timeline.",
            source_statute_or_guideline="MHA I4C Standard Operating Procedure for NCRP Grievances 2023",
            conditions=[
                DomainRuleCondition(field="investigation_status", operator="EQUALS", value="BONAFIDE_CONFIRMED")
            ],
            required_prerequisites=["Tax Invoices / Sanction Orders", "Bank Statement showing transaction lineage"],
            suggested_action_type="CYBER_IO_NOC_APPLICATION",
            suggested_action_title="Formal Application to Investigating Officer for Bank Account Unfreeze NOC",
            statutory_deadline_days=14,
            escalation_authority="Superintendent of Police (Cyber Crime) / CJM Court"
        )
    ],
    procedures=[
        DomainProcedure(
            procedure_id="PROC_CYBER_UNFREEZE",
            name="Bank Account Lien & Freeze Clearance Procedure",
            description="Sequence: (1) Fetch police acknowledgment number & FIR reference from bank, (2) Submit statement of facts to Cyber Cell IO, (3) Demand partial lien modification, (4) Submit NOC to bank nodal team.",
            steps=[
                "Obtain Cyber Crime Acknowledgment/Requisition ID from Bank Branch Manager",
                "Submit legitimate source-of-income proof to Cyber Cell Investigating Officer",
                "Submit formal representation to Bank Nodal Officer under RBI Fair Practices Code",
                "Obtain Police NOC and verify bank unfreeze execution"
            ],
            required_documents=[
                "Bank Account Statement showing disputed transaction",
                "Proof of identity (Aadhaar / PAN)",
                "Documentary proof of income source / legitimate transaction",
                "Bank Debit Freeze Advice / SMS"
            ],
            expected_sla_days=14
        )
    ],
    mock_service_routes={
        "bank_lien_status": "/api/mock/bank/account-status",
        "cyber_case_status": "/api/mock/cyber/grievance-status",
        "cyber_submit_noc": "/api/mock/cyber/submit-clarification"
    }
)
