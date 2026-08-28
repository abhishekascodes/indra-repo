export type EpistemicCategory =
  | 'FACT'
  | 'INFERENCE'
  | 'RULE'
  | 'SYSTEM_OBSERVATION'
  | 'USER_ASSERTION'
  | 'UNKNOWN';

export type NodeType =
  | 'PERSON'
  | 'IDENTITY'
  | 'INSTITUTION'
  | 'EVENT'
  | 'DOCUMENT'
  | 'EVIDENCE'
  | 'TRANSACTION'
  | 'APPLICATION'
  | 'RULE'
  | 'PROCEDURE'
  | 'ACTION'
  | 'RESPONSE'
  | 'DEADLINE'
  | 'DEPENDENCY'
  | 'CONTRADICTION'
  | 'CASE_STATE';

export type EdgeType =
  | 'RELATES_TO'
  | 'BELONGS_TO'
  | 'MENTIONS'
  | 'PROVES'
  | 'CONTRADICTS'
  | 'DEPENDS_ON'
  | 'CAUSED_BY'
  | 'REQUIRES'
  | 'SUBMITTED_TO'
  | 'RESPONDED_BY'
  | 'PRECEDES'
  | 'FOLLOWS'
  | 'ESCALATES_TO'
  | 'PROVES_ELIGIBILITY_FOR';

export type AgentState =
  | 'CASE_CREATED'
  | 'EVIDENCE_ANALYSIS'
  | 'ACTION_REQUIRED'
  | 'USER_APPROVAL'
  | 'SUBMITTED'
  | 'WAITING'
  | 'RESPONSE_RECEIVED'
  | 'VERIFICATION'
  | 'ESCALATION_REQUIRED'
  | 'RESOLUTION'
  | 'BLOCKED';

export type ActionStatus =
  | 'DRAFTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'EXECUTED'
  | 'FAILED';

export interface Provenance {
  document_id: string;
  document_name: string;
  page_number: number;
  bounding_box?: [number, number, number, number] | null;
  extracted_text: string;
  confidence: number;
  extraction_method: string;
  location_precision_available: boolean;
  raw_snippet?: string;
}

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  attributes: Record<string, any>;
  epistemic_category: EpistemicCategory;
  timestamp?: string;
  status: string;
  confidence: number;
  provenance?: Provenance | null;
}

export interface Edge {
  id: string;
  source_id: string;
  target_id: string;
  type: EdgeType;
  label: string;
  attributes: Record<string, any>;
  confidence: number;
  provenance?: Provenance | null;
}

export interface Contradiction {
  id: string;
  field: string;
  node_a_id: string;
  node_b_id: string;
  value_a: any;
  value_b: any;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  provenance_a?: Provenance;
  provenance_b?: Provenance;
  resolved: boolean;
  resolution_note?: string;
}

export interface CandidateCause {
  id: string;
  hypothesis: string;
  confidence: number;
  supporting_evidence_ids: string[];
  counter_evidence_ids: string[];
  unknowns: string[];
  causal_chain: string[];
  recommended_remedy?: string;
}

export interface ActionDraft {
  id: string;
  action_type: string;
  target_institution: string;
  purpose: string;
  supporting_evidence_ids: string[];
  rule_id?: string;
  generated_content: string;
  status: ActionStatus;
  citizen_consent: boolean;
  created_at: string;
  submitted_at?: string;
  response_deadline?: string | number;
  submission_receipt?: Record<string, any>;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  day_offset: number;
  title: string;
  description: string;
  event_type: string;
  related_node_ids?: string[];
  epistemic_category: EpistemicCategory;
}

export interface CaseDocument {
  id: string;
  filename: string;
  file_type: string;
  uploaded_at: string;
  page_count: number;
  file_path?: string;
  preview_url?: string;
  raw_content?: string;
  extractions_count: number;
}

export interface Case {
  id: string;
  title: string;
  citizen_name: string;
  domain_id: string;
  current_state: AgentState;
  objective: string;
  blocker_summary?: string;
  overall_confidence: number;
  created_at: string;
  updated_at: string;
  simulated_day: number;
  documents: CaseDocument[];
  nodes: Node[];
  edges: Edge[];
  contradictions: Contradiction[];
  candidate_causes: CandidateCause[];
  actions: ActionDraft[];
  timeline: TimelineEvent[];
  unknowns: string[];
  facts_summary: string[];
  inferences_summary: string[];
}

export interface UIGraphData {
  nodes: any[];
  edges: any[];
  stats: {
    total_nodes: number;
    total_edges: number;
    facts_count: number;
    inferences_count: number;
    rules_count: number;
    contradictions_count: number;
  };
}
