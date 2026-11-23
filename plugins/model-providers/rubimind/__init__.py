"""RUBIMIND AI provider profile."""

from typing import Any

from providers import register_provider
from providers.base import ProviderProfile


class RubimindProfile(ProviderProfile):
    """RUBIMIND AI — Native Omni and Core models with vision and tool calling."""

    def build_api_kwargs_extras(
        self, *, reasoning_config: dict | None = None, **context: Any
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        # The RUBIMIND API ignores reasoning_effort and does not expose reasoning controls.
        return {}, {}


rubimind = RubimindProfile(
    name="rubimind",
    aliases=("rubimind-ai", "rubimindia"),
    display_name="RUBIMIND",
    description="RUBIMIND AI — Modelos nativos Omni e Core",
    signup_url="https://rubimindia.vercel.app/",
    env_vars=("RUBIMIND_API_KEY",),
    base_url="https://rubimindia.vercel.app/api/public/v1",
    models_url="https://rubimindia.vercel.app/api/public/v1/models",
    auth_type="api_key",
    fallback_models=("rubimind-0.2-omni", "rubimind-0.1-core"),
    default_aux_model="rubimind-0.2-omni",
    supports_vision=True,
    supports_streaming=True,
)

register_provider(rubimind)
