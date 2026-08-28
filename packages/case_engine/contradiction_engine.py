"""
Deterministic Contradiction and Entity Resolution Engine for INDRA
Detects inconsistencies, discrepancies, and conflicts between evidence sources.
"""

from typing import List, Dict, Any, Optional, Tuple
import re
from datetime import datetime
from packages.schemas.models import (
    Case, Node, Edge, Contradiction, ContradictionSeverity, EdgeType, NodeType, EpistemicCategory
)
from packages.case_engine.graph_manager import CaseGraphManager


class ContradictionEngine:
    """Deterministic comparison engine for detecting factual and state contradictions."""

    @staticmethod
    def normalize_date(date_str: str) -> Optional[str]:
        """Normalizes multiple date formats to YYYY-MM-DD."""
        if not date_str:
            return None
        cleaned = re.sub(r'[^0-9\-\/\.]', '', str(date_str)).strip()
        formats = [
            "%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d",
            "%d.%m.%Y", "%Y.%m.%d", "%d %b %Y", "%d %B %Y"
        ]
        for fmt in formats:
            try:
                dt = datetime.strptime(cleaned, fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue
        return cleaned

    @staticmethod
    def normalize_name(name_str: str) -> str:
        """Standardizes personal names for comparison."""
        if not name_str:
            return ""
        name = re.sub(r'^(MR|MS|MRS|DR|SH|SMT|KUMARI|SHRI)\.?\s+', '', name_str.strip().upper())
        name = re.sub(r'\s+', ' ', name)
        return name.strip()

    @classmethod
    def detect_contradictions(cls, case: Case, graph_mgr: CaseGraphManager) -> List[Contradiction]:
        """
        Scans all nodes in the case graph for deterministic contradictions.
        """
        contradictions: List[Contradiction] = []

        # 1. Date of Birth Contradictions
        dob_nodes = [n for n in case.nodes if "dob" in n.attributes or "date_of_birth" in n.attributes]
        for i in range(len(dob_nodes)):
            for j in range(i + 1, len(dob_nodes)):
                n1, n2 = dob_nodes[i], dob_nodes[j]
                d1 = n1.attributes.get("dob") or n1.attributes.get("date_of_birth")
                d2 = n2.attributes.get("dob") or n2.attributes.get("date_of_birth")
                norm1 = cls.normalize_date(str(d1))
                norm2 = cls.normalize_date(str(d2))
                if norm1 and norm2 and norm1 != norm2:
                    c = Contradiction(
                        field="date_of_birth",
                        node_a_id=n1.id,
                        node_b_id=n2.id,
                        value_a=d1,
                        value_b=d2,
                        description=f"Date of Birth discrepancy between '{n1.label}' ({d1}) and '{n2.label}' ({d2}).",
                        severity=ContradictionSeverity.HIGH,
                        provenance_a=n1.provenance,
                        provenance_b=n2.provenance
                    )
                    contradictions.append(c)

        # 2. Date of Exit Contradictions (EPFO)
        exit_nodes = [n for n in case.nodes if "date_of_exit" in n.attributes or "exit_date" in n.attributes]
        for i in range(len(exit_nodes)):
            for j in range(i + 1, len(exit_nodes)):
                n1, n2 = exit_nodes[i], exit_nodes[j]
                d1 = n1.attributes.get("date_of_exit") or n1.attributes.get("exit_date")
                d2 = n2.attributes.get("date_of_exit") or n2.attributes.get("exit_date")
                norm1 = cls.normalize_date(str(d1))
                norm2 = cls.normalize_date(str(d2))
                if norm1 and norm2 and norm1 != norm2:
                    c = Contradiction(
                        field="date_of_exit",
                        node_a_id=n1.id,
                        node_b_id=n2.id,
                        value_a=d1,
                        value_b=d2,
                        description=f"EPF Date of Exit mismatch: '{n1.label}' records {d1} while '{n2.label}' records {d2}.",
                        severity=ContradictionSeverity.HIGH,
                        provenance_a=n1.provenance,
                        provenance_b=n2.provenance
                    )
                    contradictions.append(c)

        # 3. Application & Transaction Status Conflict (e.g. Sanctioned vs PFMS Rejection BNS-410)
        app_nodes = [n for n in case.nodes if n.type == NodeType.APPLICATION]
        resp_nodes = [n for n in case.nodes if n.type in [NodeType.RESPONSE, NodeType.TRANSACTION]]
        for app in app_nodes:
            app_status = app.attributes.get("status", "").upper()
            for resp in resp_nodes:
                resp_status = resp.attributes.get("status", "").upper()
                resp_code = resp.attributes.get("error_code") or resp.attributes.get("rejection_code", "")
                if "SANCTIONED" in app_status or "APPROVED" in app_status:
                    if "REJECTED" in resp_status or "FAILED" in resp_status or resp_code in ["BNS-410", "BNS-404"]:
                        c = Contradiction(
                            field="disbursal_status",
                            node_a_id=app.id,
                            node_b_id=resp.id,
                            value_a=app_status,
                            value_b=f"{resp_status} ({resp_code})",
                            description=f"Application status shows '{app_status}' on portal, but transactional processing failed with '{resp_code}: {resp.label}'.",
                            severity=ContradictionSeverity.HIGH,
                            provenance_a=app.provenance,
                            provenance_b=resp.provenance
                        )
                        contradictions.append(c)

        # 4. Bank Account Routing & NPCI Mapping Mismatch
        acc_nodes = [n for n in case.nodes if "account_number" in n.attributes or "account_no" in n.attributes]
        for i in range(len(acc_nodes)):
            for j in range(i + 1, len(acc_nodes)):
                n1, n2 = acc_nodes[i], acc_nodes[j]
                a1 = str(n1.attributes.get("account_number") or n1.attributes.get("account_no"))
                a2 = str(n2.attributes.get("account_number") or n2.attributes.get("account_no"))
                # If different banks or accounts but both claimed for same DBT
                if a1 and a2 and a1[-4:] != a2[-4:]:
                    c = Contradiction(
                        field="bank_account_mismatch",
                        node_a_id=n1.id,
                        node_b_id=n2.id,
                        value_a=a1,
                        value_b=a2,
                        description=f"Primary DBT Beneficiary Account mismatch between '{n1.label}' ({a1}) and '{n2.label}' ({a2}).",
                        severity=ContradictionSeverity.MEDIUM,
                        provenance_a=n1.provenance,
                        provenance_b=n2.provenance
                    )
                    contradictions.append(c)

        # 5. Insert CONTRADICTS edges into the graph
        for c in contradictions:
            edge_id = f"contra_edge_{c.node_a_id}_{c.node_b_id}"
            if not graph_mgr.get_edge(edge_id):
                edge = Edge(
                    id=edge_id,
                    source_id=c.node_a_id,
                    target_id=c.node_b_id,
                    type=EdgeType.CONTRADICTS,
                    label=f"CONTRADICTS: {c.field}",
                    attributes={"contradiction_id": c.id, "severity": c.severity.value, "description": c.description},
                    confidence=1.0
                )
                graph_mgr.add_edge(edge)

        case.contradictions = contradictions
        return contradictions
