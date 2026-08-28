import pytest
from packages.schemas.models import Case, Node, NodeType, EpistemicCategory
from packages.domain_plugins.dbt_plugin import DBT_PLUGIN
from packages.case_engine.rule_engine import DeterministicRuleEngine


def test_dbt_rule_evaluation_bns_410():
    case = Case(
        id="CASE-RULE-01",
        title="DBT Rule Test",
        citizen_name="Aakash Verma",
        domain_id="dbt_failure"
    )
    # Add PFMS Rejection Node with error_code BNS-410
    node = Node(
        id="node_pfms_err",
        type=NodeType.RESPONSE,
        label="PFMS Error: BNS-410",
        attributes={"error_code": "BNS-410"},
        epistemic_category=EpistemicCategory.FACT
    )
    case.nodes.append(node)

    results = DeterministicRuleEngine.evaluate_case_rules(case, DBT_PLUGIN)

    assert len(results) > 0
    rule_ids = [r.rule.rule_id for r in results]
    assert "RULE_DBT_BNS_410_ACCOUNT_RESTRICTION" in rule_ids
