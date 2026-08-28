"""
Deterministic Rule Engine for INDRA
Evaluates domain plugin rules against graph state without LLM guesswork.
"""

from typing import Dict, List, Any, Optional
from packages.schemas.models import Case, Node, Edge, NodeType, EdgeType, EpistemicCategory
from packages.domain_plugins.plugin_schema import DomainPlugin, DomainRule, DomainRuleCondition


class RuleEvaluationResult:
    def __init__(self, rule: DomainRule, matched_nodes: List[Node], context_data: Dict[str, Any]):
        self.rule = rule
        self.matched_nodes = matched_nodes
        self.context_data = context_data

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rule_id": self.rule.rule_id,
            "name": self.rule.name,
            "description": self.rule.description,
            "source": self.rule.source_statute_or_guideline,
            "suggested_action_type": self.rule.suggested_action_type,
            "suggested_action_title": self.rule.suggested_action_title,
            "statutory_deadline_days": self.rule.statutory_deadline_days,
            "matched_node_ids": [n.id for n in self.matched_nodes],
            "context": self.context_data
        }


class DeterministicRuleEngine:
    """Evaluates explicit structured conditions defined in Domain Plugins."""

    @staticmethod
    def _evaluate_condition(condition: DomainRuleCondition, context: Dict[str, Any]) -> bool:
        field_val = context.get(condition.field)
        if field_val is None:
            return False

        op = condition.operator
        target = condition.value

        if op == "EQUALS":
            return str(field_val).strip().upper() == str(target).strip().upper()
        elif op == "NOT_EQUALS":
            return str(field_val).strip().upper() != str(target).strip().upper()
        elif op == "CONTAINS":
            return str(target).lower() in str(field_val).lower()
        elif op == "EXISTS":
            return bool(field_val)
        elif op == "IN":
            if isinstance(target, list):
                return field_val in target
            return str(field_val) in str(target)
        elif op == "GREATER_THAN":
            try:
                return float(field_val) > float(target)
            except (ValueError, TypeError):
                return False
        return False

    @classmethod
    def evaluate_case_rules(cls, case: Case, plugin: DomainPlugin) -> List[RuleEvaluationResult]:
        """
        Gathers facts & attributes from case graph and matches against domain rules.
        """
        results: List[RuleEvaluationResult] = []

        # Aggregate context dictionary from nodes
        context: Dict[str, Any] = {
            "waiting_days": case.simulated_day,
            "domain_id": case.domain_id,
            "current_state": case.current_state.value
        }

        # Check for error codes, transaction statuses, and account attributes in nodes
        for node in case.nodes:
            if "error_code" in node.attributes:
                context["error_code"] = node.attributes["error_code"]
            if "rejection_code" in node.attributes:
                context["error_code"] = node.attributes["rejection_code"]
            if "freeze_type" in node.attributes:
                context["freeze_type"] = node.attributes["freeze_type"]
            if "investigation_status" in node.attributes:
                context["investigation_status"] = node.attributes["investigation_status"]
            if "employer_status" in node.attributes:
                context["employer_status"] = node.attributes["employer_status"]

        for rule in plugin.rules:
            # Rule must satisfy all conditions
            if not rule.conditions:
                continue

            matches_all = True
            for cond in rule.conditions:
                if not cls._evaluate_condition(cond, context):
                    matches_all = False
                    break

            if matches_all:
                matched_nodes = [
                    n for n in case.nodes
                    if any(cond.field in n.attributes for cond in rule.conditions)
                ]
                results.append(RuleEvaluationResult(rule, matched_nodes, context))

        return results
