"""
Stateful Mock Government Backend for INDRA
Maintains state for PFMS, NPCI, Commercial Banks, EPFO, and Cyber Police Portals.
"""

from typing import Dict, Any, Optional
from datetime import datetime


class MockGovernmentState:
    """In-memory stateful store simulating external Indian public administrative systems."""

    def __init__(self):
        self.reset()

    def reset(self):
        """Resets mock government databases to initial realistic conflict state."""
        self.simulated_clock_day = 0

        # Bank Accounts Database
        self.bank_accounts = {
            "2145101004401": {
                "bank_name": "Canara Bank",
                "holder_name": "Aakash Verma",
                "ifsc": "CNRB0002145",
                "status": "RESTRICTED",
                "debit_freeze": True,
                "npci_apbs_mapped": False,
                "lien_amount": 15000.0,
                "lien_reason": "Cyber Police Station Requisition #CR-4412",
                "balance": 1240.50
            },
            "38492018812": {
                "bank_name": "State Bank of India",
                "holder_name": "Aakash Verma",
                "ifsc": "SBIN0001067",
                "status": "ACTIVE",
                "debit_freeze": False,
                "npci_apbs_mapped": False,
                "balance": 25000.00
            }
        }

        # NPCI APBS Central Mapper Database
        self.npci_mapper = {
            "XXXX-XXXX-8821": {
                "citizen_name": "Aakash Verma",
                "mapped_bank": "Canara Bank",
                "mapped_account": "2145101004401",
                "status": "INACTIVE",
                "last_updated": "2025-11-20"
            }
        }

        # PFMS Disbursal System
        self.pfms_disbursals = {
            "DBT/2026/SCH-884920": {
                "scheme_name": "Post-Matric Professional Scholarship",
                "beneficiary_name": "Aakash Verma",
                "aadhaar": "XXXX-XXXX-8821",
                "sanction_amount": 48000.0,
                "last_status": "REJECTED",
                "rejection_code": "BNS-410",
                "rejection_description": "Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank",
                "settlement_utr": None,
                "attempts_count": 1
            }
        }

        # EPFO Master Database
        self.epfo_members = {
            "100982341120": {
                "member_name": "Pooja Sharma",
                "establishment_id": "TV-DEL-98442",
                "establishment_name": "TechVentures India Pvt Ltd",
                "member_master_exit_date": "31/03/2023",
                "service_record_exit_date": "15/04/2023",
                "claim_status": "REJECTED",
                "claim_rejection_code": "EPFO-REJ-DATE-MISMATCH",
                "joint_declaration_status": "NONE",
                "settled_amount": 0.0
            }
        }

        # Cyber Cell Grievance Database
        self.cyber_notices = {
            "CR-4412": {
                "police_station": "Cyber Crime Police Station, North District",
                "complainant": "Rajesh Mehra",
                "disputed_amount": 15000.0,
                "target_account": "2145101004401",
                "status": "UNDER_INVESTIGATION",
                "noc_issued": False
            }
        }


# Global singleton mock government state
GLOBAL_MOCK_STATE = MockGovernmentState()
