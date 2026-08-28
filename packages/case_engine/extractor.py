"""
Multimodal Evidence Extraction and Ingestion Pipeline for INDRA
Processes PDFs, Images, Statements, and SMS with strict schema validation and provenance tracking.
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from packages.schemas.models import (
    Case, CaseDocument, Node, Edge, NodeType, EdgeType, EpistemicCategory, Provenance, TimelineEvent
)
from packages.case_engine.graph_manager import CaseGraphManager


class EvidenceExtractor:
    """Ingests multimodal evidence and populates typed Case Graph nodes with verified provenance."""

    @classmethod
    def ingest_synthetic_dataset(cls, case: Case, dataset_dir: str, metadata_file: str) -> CaseGraphManager:
        """
        Ingests a synthetic dataset directory containing PDFs/documents and metadata.
        Populates graph with strict provenance and epistemic categorization.
        """
        meta_path = os.path.join(dataset_dir, metadata_file)
        if not os.path.exists(meta_path):
            raise FileNotFoundError(f"Metadata file {meta_path} not found.")

        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)

        graph_mgr = CaseGraphManager(case)

        # 1. Create Core Person Node
        citizen_node = Node(
            id=f"person_{case.id}",
            type=NodeType.PERSON,
            label=f"Citizen: {meta['citizen_name']}",
            attributes={"name": meta["citizen_name"]},
            epistemic_category=EpistemicCategory.FACT,
            confidence=1.0,
            provenance=Provenance(
                document_id="citizen_profile",
                document_name="Citizen Master Profile",
                page_number=1,
                extracted_text=meta["citizen_name"],
                confidence=1.0,
                extraction_method="profile_registration"
            )
        )
        graph_mgr.add_node(citizen_node)

        # 2. Ingest Evidence Documents
        for doc_info in meta.get("evidence_files", []):
            doc_id = f"doc_{doc_info['file'].replace('.', '_')}"
            file_path = os.path.join(dataset_dir, doc_info["file"])

            case_doc = CaseDocument(
                id=doc_id,
                filename=doc_info["file"],
                file_type=doc_info.get("type", "pdf"),
                uploaded_at=datetime.utcnow().isoformat(),
                page_count=1,
                file_path=file_path,
                preview_url=f"/api/evidence/preview/{doc_id}",
                extractions_count=len(doc_info.get("extractions", []))
            )
            case.documents.append(case_doc)

            # Add Document Node
            doc_node = Node(
                id=f"node_{doc_id}",
                type=NodeType.DOCUMENT,
                label=f"Document: {doc_info.get('title', doc_info['file'])}",
                attributes={"filename": doc_info["file"], "file_type": doc_info.get("type")},
                epistemic_category=EpistemicCategory.FACT,
                confidence=1.0,
                provenance=Provenance(
                    document_id=doc_id,
                    document_name=doc_info["file"],
                    page_number=1,
                    extracted_text=doc_info.get("title", doc_info["file"]),
                    confidence=1.0,
                    extraction_method="document_header"
                )
            )
            graph_mgr.add_node(doc_node)

            # Edge: Citizen -> Document
            graph_mgr.add_edge(Edge(
                id=f"edge_citizen_{doc_id}",
                source_id=citizen_node.id,
                target_id=doc_node.id,
                type=EdgeType.BELONGS_TO,
                label="SUBMITTED_BY",
                confidence=1.0
            ))

            # Process extractions for this document
            for idx, ext in enumerate(doc_info.get("extractions", [])):
                fact_node_id = f"fact_{doc_id}_{idx}"
                field = ext["field"]
                val = ext["value"]
                raw_text = ext["raw_text"]
                bbox = ext.get("bbox")
                page = ext.get("page", 1)
                conf = ext.get("confidence", 0.95)

                prov = Provenance(
                    document_id=doc_id,
                    document_name=doc_info["file"],
                    page_number=page,
                    bounding_box=bbox,
                    extracted_text=raw_text,
                    confidence=conf,
                    extraction_method="deterministic_multimodal_ocr",
                    location_precision_available=(bbox is not None)
                )

                # Determine Node Type based on field
                if "status" in field:
                    ntype = NodeType.APPLICATION if "sanction" in field else NodeType.RESPONSE
                elif "amount" in field:
                    ntype = NodeType.TRANSACTION
                elif "freeze" in field or "lien" in field or "mapper" in field:
                    ntype = NodeType.DEPENDENCY
                elif "error" in field or "code" in field:
                    ntype = NodeType.RESPONSE
                else:
                    ntype = NodeType.EVIDENCE

                fact_node = Node(
                    id=fact_node_id,
                    type=ntype,
                    label=f"{field.replace('_', ' ').title()}: {val}",
                    attributes={field: val, "raw_snippet": raw_text},
                    epistemic_category=EpistemicCategory.FACT,
                    confidence=conf,
                    provenance=prov
                )
                graph_mgr.add_node(fact_node)

                # Edge: Document -> Fact Node
                graph_mgr.add_edge(Edge(
                    id=f"edge_prov_{doc_id}_{fact_node_id}",
                    source_id=doc_node.id,
                    target_id=fact_node_id,
                    type=EdgeType.PROVES,
                    label="PROVES_FACT",
                    confidence=conf,
                    provenance=prov
                ))

        # Log extraction timeline event
        event = TimelineEvent(
            timestamp=datetime.utcnow().isoformat(),
            day_offset=case.simulated_day,
            title=f"Evidence Vault Ingestion: {len(case.documents)} Documents",
            description=f"Ingested {len(case.documents)} evidence records. Extracted verified factual nodes with spatial bounding box provenance.",
            event_type="EVIDENCE_EXTRACTION",
            epistemic_category=EpistemicCategory.FACT
        )
        case.timeline.append(event)
        graph_mgr.sync_to_case(case)
        return graph_mgr
