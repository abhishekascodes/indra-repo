"""
Declarative Domain Plugin for Direct Benefit Transfer (DBT) & PFMS
Handles DBT scholarship/welfare disbursements, NPCI Aadhaar bank mapping,
PFMS error codes (BNS-410, PFMS-E-102), and mandate alignment.
"""

from packages.domain_plugins.plugin_schema import (
    DomainPlugin, DomainRule, DomainRuleCondition, DomainProcedure, DomainEntitySpec
)

DBT_PLUGIN = DomainPlugin(
    domain_id="dbt_failure",
    title="Direct Benefit Transfer & PFMS Welfare Disbursal",
    description="Resolves scholarship, welfare pension, and subsidy disbursal failures across PFMS, NPCI, and commercial banks.",
    version="1.0.0",
    authoritative_institutions=[
        "PFMS (Public Financial Management System)",
        "NPCI (National Payments Corporation of India)",
        "Ministry of Social Justice & Empowerment",
        "State DBT Cell",
        "Commercial Banks / Lead Bank Office"
    ],
    entities=[
        DomainEntitySpec(name="Beneficiary", identifier_fields=["aadhaar_masked", "beneficiary_id", "name"], description="Citizen entitled to DBT disbursal"),
        DomainEntitySpec(name="DBT Application", identifier_fields=["application_no", "scheme_name"], description="Scholarship or welfare grant application"),
        DomainEntitySpec(name="PFMS Transaction", identifier_fields=["pfms_transaction_id", "rejection_code"], description="Credit attempt by central disbursal portal"),
        DomainEntitySpec(name="NPCI Mapper", identifier_fields=["aadhaar_hash", "mapped_iin", "mapper_status"], description="Aadhaar Payment Bridge System (APBS) routing record")
    ],
    error_codes={
        "BNS-410": "Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank",
        "BNS-404": "Aadhaar Not Seeded in NPCI Central Mapper",
        "PFMS-E-102": "Account Number and IFSC Code Inconsistency with Beneficiary Name",
        "PFMS-ERR-09": "Duplicate Mandate Found for Beneficiary",
        "BNS-501": "Dormant Bank Account / Inoperative Status"
    },
    rules=[
        DomainRule(
            rule_id="RULE_DBT_NPCI_MAPPING_REQUIRED",
            name="NPCI APBS Mandatory Mapping for DBT",
            description="Under DBT Guidelines (DBT Mission / RBI Circular 2021), funds must be routed via Aadhaar Payment Bridge System (APBS) to the latest active NPCI-mapped account.",
            source_statute_or_guideline="DBT Mission Circular No. 11011/58/2016-DBT; RBI Master Direction DPSS.CO.PD.No.1810/02.14.006/2015-16",
            conditions=[
                DomainRuleCondition(field="error_code", operator="EQUALS", value="BNS-404")
            ],
            required_prerequisites=["Aadhaar Consent Form", "Bank Passbook Copy"],
            suggested_action_type="NPCI_MAPPING_UPDATE_REQUEST",
            suggested_action_title="Submit Aadhaar-NPCI Seeding & Mandate Form to Bank Branch",
            statutory_deadline_days=7,
            escalation_authority="Banking Ombudsman / RBI CMS Portal"
        ),
        DomainRule(
            rule_id="RULE_DBT_BNS_410_ACCOUNT_RESTRICTION",
            name="PFMS Rejection BNS-410 Remediation",
            description="When PFMS returns BNS-410, disbursal failed because the destination bank has flagged the beneficiary account (Lien, Freeze, or Dormancy). Bank must clear restriction or citizen must update NPCI mapping to alternate KYC-verified bank account, followed by PFMS re-push.",
            source_statute_or_guideline="PFMS Operational SOP Section 4.3; RBI Circular on Account Freezes DOR.No.Leg.BC.67/09.07.005/2021-22",
            conditions=[
                DomainRuleCondition(field="error_code", operator="EQUALS", value="BNS-410")
            ],
            required_prerequisites=["Bank KYC Verification Slip", "Account Re-activation Letter", "NPCI Mandate Re-linking"],
            suggested_action_type="BANK_RESTRICTION_REMEDIAL_SUBMISSION",
            suggested_action_title="Bank Branch Lien Clearance & NPCI Remapping Directive",
            statutory_deadline_days=10,
            escalation_authority="Lead Bank Officer / Ministry Grievance Cell (CPGRAMS)"
        ),
        DomainRule(
            rule_id="RULE_DBT_PFMS_DISBURSAL_ESCALATION",
            name="Statutory Disbursal Delay Escalation",
            description="If a verified grievance or rectification request receives no institutional response within 15 days, case qualifies for automatic escalation to the Department of Financial Services (DFS) / CPGRAMS.",
            source_statute_or_guideline="Citizen Charter on Public Grievance Redressal (DARPG Guidelines 2022)",
            conditions=[
                DomainRuleCondition(field="waiting_days", operator="GREATER_THAN", value=14)
            ],
            required_prerequisites=["Original Grievance Acknowledgment", "15-Day Inaction Proof"],
            suggested_action_type="CPGRAMS_ESCALATION_FILING",
            suggested_action_title="CPGRAMS Formal Administrative Escalation against Delayed Disbursal",
            statutory_deadline_days=30,
            escalation_authority="Central Public Grievance Redress and Monitoring System (CPGRAMS)"
        )
    ],
    procedures=[
        DomainProcedure(
            procedure_id="PROC_DBT_BENEFIT_RESTORE",
            name="End-to-End Benefit Disbursal Recovery Procedure",
            description="Multi-tier resolution: (1) Identify account restriction, (2) Submit Bank Mandate Rectification, (3) Update NPCI APBS Mapper, (4) Request PFMS payment retry.",
            steps=[
                "Inspect PFMS disbursal response and error status",
                "Audit target bank account status for debit freeze/lien/dormancy",
                "Execute NPCI Seeding & Mandate update with alternate active bank account",
                "Submit DBT portal re-validation request to trigger PFMS re-push",
                "Monitor disbursal status; auto-escalate if unfulfilled in 15 days"
            ],
            required_documents=[
                "Scholarship / Welfare Sanction Letter",
                "PFMS Rejection Statement / SMS Notice",
                "Bank Account Passbook / Statement with IFSC",
                "Aadhaar Card Copy"
            ],
            expected_sla_days=15
        )
    ],
    mock_service_routes={
        "pfms_status": "/api/mock/pfms/status",
        "pfms_retry": "/api/mock/pfms/retry-disbursal",
        "npci_mapper": "/api/mock/npci/mapper-status",
        "bank_status": "/api/mock/bank/account-status"
    }
)
