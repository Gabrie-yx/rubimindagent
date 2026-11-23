"""RUBIMIND Cadastral Intelligence Tool.

Provides real-time forensic cadastral lookups for Brazilian identity and assets
via the official RUBIMIND public API (/api/public/v1/cadastral).
Supported query types: cpf, cnpj, telefone, placa, nome, email.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from tools.registry import registry

logger = logging.getLogger(__name__)

CADASTRAL_QUERY_SCHEMA = {
    "name": "cadastral_query",
    "description": (
        "Consult real-time Brazilian cadastral and forensic intelligence records "
        "via official RUBIMIND API (/api/public/v1/cadastral). Call this tool automatically "
        "whenever the user requests to consult, look up, search, or verify information "
        "for a CPF, CNPJ, phone number (telefone), license plate (placa), full name (nome), or email address."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "tipo": {
                "type": "string",
                "enum": ["cpf", "cnpj", "telefone", "placa", "nome", "email"],
                "description": "The category of query: 'cpf', 'cnpj', 'telefone', 'placa', 'nome', or 'email'.",
            },
            "valor": {
                "type": "string",
                "description": "The value or identifier to look up (e.g. '12345678900' for CPF, '11987654321' for phone, 'ABC1D23' for plate, or 'FULANO DE TAL' for name).",
            },
        },
        "required": ["tipo", "valor"],
    },
}


def cadastral_query_tool(tipo: str, valor: str) -> str:
    """Execute real-time cadastral lookup and return JSON string result."""
    from skills.research.cadastral.scripts.cadastral import (
        format_cadastral_output,
        query_cadastral,
    )

    clean_tipo = str(tipo or "").strip().lower()
    clean_valor = str(valor or "").strip()

    if not clean_tipo or not clean_valor:
        return json.dumps({
            "success": False,
            "error": "Parâmetros 'tipo' e 'valor' são obrigatórios.",
        })

    try:
        data = query_cadastral(query_type=clean_tipo, query_value=clean_valor)
        formatted = format_cadastral_output(clean_tipo, clean_valor, data)
        return json.dumps({
            "success": True,
            "tipo": clean_tipo,
            "valor": clean_valor,
            "dossier": formatted,
            "raw": data,
        }, ensure_ascii=False)
    except Exception as exc:
        logger.warning("Cadastral query failed for %s (%s): %s", clean_tipo, clean_valor, exc)
        return json.dumps({
            "success": False,
            "tipo": clean_tipo,
            "valor": clean_valor,
            "error": str(exc),
        }, ensure_ascii=False)


def check_cadastral_tool() -> bool:
    """Tool availability check."""
    return True


registry.register(
    name="cadastral_query",
    toolset="cadastral",
    schema=CADASTRAL_QUERY_SCHEMA,
    handler=lambda args, **kw: cadastral_query_tool(
        tipo=args.get("tipo", ""),
        valor=args.get("valor", ""),
    ),
    check_fn=check_cadastral_tool,
    emoji="🔍",
    max_result_size_chars=100_000,
)
