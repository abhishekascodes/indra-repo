"""
Plugin Loader and Registry for INDRA Domain Plugins
Enables declarative plug-and-play domain intelligence without altering the core engine.
"""

from typing import Dict, List, Optional, Any
from packages.domain_plugins.plugin_schema import DomainPlugin
from packages.domain_plugins.dbt_plugin import DBT_PLUGIN
from packages.domain_plugins.cyber_plugin import CYBER_PLUGIN
from packages.domain_plugins.epfo_plugin import EPFO_PLUGIN


class DomainPluginRegistry:
    """Registry maintaining active domain plugins."""

    def __init__(self):
        self._plugins: Dict[str, DomainPlugin] = {}
        self.register_plugin(DBT_PLUGIN)
        self.register_plugin(CYBER_PLUGIN)
        self.register_plugin(EPFO_PLUGIN)

    def register_plugin(self, plugin: DomainPlugin) -> None:
        self._plugins[plugin.domain_id] = plugin

    def get_plugin(self, domain_id: str) -> Optional[DomainPlugin]:
        return self._plugins.get(domain_id)

    def list_plugins(self) -> List[Dict[str, Any]]:
        return [
            {
                "domain_id": p.domain_id,
                "title": p.title,
                "description": p.description,
                "version": p.version,
                "rules_count": len(p.rules),
                "procedures_count": len(p.procedures)
            }
            for p in self._plugins.values()
        ]


# Global singleton registry
GLOBAL_PLUGIN_REGISTRY = DomainPluginRegistry()
