"""
Root-Cause and Causal Hypothesis Engine for INDRA
Constructs verifiable candidate causal chains with explicit confidence, supporting evidence,
counter-evidence, and unknown gaps.
"""

from typing import List, Dict, Any, Optional
from packages.schemas.models import (
    Case, Node, Edge, CandidateCause, NodeType, EdgeType, EpistemicCategory
)
from packages.case_engine.graph_manager import CaseGraphManager


class RootCauseEngine:
    """Constructs candidate causal chains across fragmented public administrative events."""

    @classmethod
    def analyze_root_cause(cls, case: Case, graph_mgr: CaseGraphManager) -> List[CandidateCause]:
        """
        Synthesizes facts, system observations, and contradictions to formulate candidate root causes.
        """
        candidate_causes: List[CandidateCause] = []

        # Scenario 1: DBT Failure caused by Bank Account Restriction / NPCI Inactive
        bns_410_nodes = [
            n for n in case.nodes
            if (n.attributes.get("error_code") == "BNS-410" or "BNS-410" in n.label)
        ]
        lien_nodes = [
            n for n in case.nodes
            if ("lien" in n.label.lower() or "freeze" in n.label.lower() or n.attributes.get("freeze_type"))
        ]
        npci_nodes = [
            n for n in case.nodes
            if ("npci" in n.label.lower() or "inactive" in n.attributes.get("mapper_status", "").lower())
        ]
        scholarship_nodes = [
            n for n in case.nodes
            if n.type == NodeType.APPLICATION and "scholarship" in n.label.lower()
        ]

        if bns_410_nodes or (npci_nodes and scholarship_nodes):
            chain_nodes = []
            supporting_ids = []
            if lien_nodes:
                chain_nodes.append(lien_nodes[0].id)
                supporting_ids.append(lien_nodes[0].id)
            if npci_nodes:
                chain_nodes.append(npci_nodes[0].id)
                supporting_ids.append(npci_nodes[0].id)
            if bns_410_nodes:
                chain_nodes.append(bns_410_nodes[0].id)
                supporting_ids.append(bns_410_nodes[0].id)
            if scholarship_nodes:
                chain_nodes.append(scholarship_nodes[0].id)
                supporting_ids.append(scholarship_nodes[0].id)

            hypothesis = (
                "Destination Bank Account restriction / Inactive NPCI APBS mapping "
                "caused PFMS central disbursal gateway to abort with rejection code BNS-410, "
                "preventing scholarship fund credit despite government sanction approval."
            )

            cause = CandidateCause(
                id=f"cause_dbt_{case.id}",
                hypothesis=hypothesis,
                confidence=0.92,
                supporting_evidence_ids=supporting_ids,
                counter_evidence_ids=[],
                unknowns=[
                    "Exact date when Bank branch imposed debit freeze / lien flag",
                    "Whether bank sent prior SMS notice to citizen before restricting debit facilities"
                ],
                causal_chain=chain_nodes,
                recommended_remedy=(
                    "1. Direct Bank branch to update Aadhaar-NPCI Seeding to active operational account.\n"
                    "2. Submit Bank Mandate Rectification Form.\n"
                    "3. Initiate PFMS payment retry on DBT portal."
                )
            )
            candidate_causes.append(cause)

        # Scenario 2: EPFO Exit Date Mismatch
        exit_date_contra = [
            c for c in case.contradictions
            if c.field == "date_of_exit"
        ]
        epf_claims = [n for n in case.nodes if n.type == NodeType.APPLICATION and "epf" in n.label.lower()]
        if exit_date_contra or (epf_claims and any("exit" in n.label.lower() for n in case.nodes)):
            contra = exit_date_contra[0] if exit_date_contra else None
            supporting = [contra.node_a_id, contra.node_b_id] if contra else [epf_claims[0].id] if epf_claims else []

            cause = CandidateCause(
                id=f"cause_epfo_{case.id}",
                hypothesis=(
                    "Employer reported Date of Exit on EPFO Unified Portal does not match "
                    "formal Service Relieving Certificate, triggering automatic claim rejection by EPFO Field Office."
                ),
                confidence=0.95,
                supporting_evidence_ids=supporting,
                counter_evidence_ids=[],
                unknowns=["Whether establishment is active and willing to digitally sign online Joint Declaration"],
                causal_chain=supporting,
                recommended_remedy="Submit Joint Declaration Form under Revised SOP 2024 to Regional PF Commissioner."
            )
            candidate_causes.append(cause)

        # Scenario 3: Cyber Police Lien Hold
        cyber_lien = [n for n in case.nodes if "cyber" in n.label.lower() or n.attributes.get("freeze_type") == "FULL_ACCOUNT_FREEZE"]
        if cyber_lien:
            cause = CandidateCause(
                id=f"cause_cyber_{case.id}",
                hypothesis=(
                    "Bank placed full account debit freeze pursuant to Cyber Cell notice under Sec 102 CrPC, "
                    "violating proportionality principles that restrict liens to disputed layered amounts only."
                ),
                confidence=0.88,
                supporting_evidence_ids=[n.id for n in cyber_lien],
                counter_evidence_ids=[],
                unknowns=["Specific UTR number flagged by complainant in original NCRP cyber report"],
                causal_chain=[n.id for n in cyber_lien],
                recommended_remedy="Petition Bank Nodal Officer for partial lien restriction and submit legitimate source proof to Cyber IO."
            )
            candidate_causes.append(cause)

        # Update case
        case.candidate_causes = candidate_causes
        if candidate_causes:
            case.blocker_summary = candidate_causes[0].hypothesis
            case.inferences_summary = [f"INFERENCE: {c.hypothesis} (Confidence: {int(c.confidence*100)}%)" for c in candidate_causes]

        return candidate_causes
