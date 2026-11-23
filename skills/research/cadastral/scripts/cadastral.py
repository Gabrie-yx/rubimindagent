#!/usr/bin/env python3
"""RUBIMIND Cadastral Intelligence Lookup CLI & Script.

Queries the official RUBIMIND Cadastral API (/api/public/v1/cadastral) for:
- CPF (Dossier with redundancy)
- CNPJ
- Telefone
- Placa
- Nome
- Email

Usage:
    python cadastral.py cpf 12345678900
    python cadastral.py cnpj 12345678000190
    python cadastral.py telefone 11987654321
    python cadastral.py placa ABC1D23
    python cadastral.py nome "FULANO DE TAL"
    python cadastral.py email nome@dominio.com
    python cadastral.py cpf 12345678900 --json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, Optional

DEFAULT_ENDPOINT = "https://rubimindia.vercel.app/api/public/v1/cadastral"
VALID_TYPES = ("cpf", "cnpj", "telefone", "placa", "nome", "email")


def resolve_api_key(explicit_key: Optional[str] = None) -> str:
    """Resolve RUBIMIND API key from explicit arg, env, or local .env files."""
    if explicit_key and explicit_key.strip():
        return explicit_key.strip()

    env_val = os.environ.get("RUBIMIND_API_KEY") or os.environ.get("RBM_API_KEY")
    if env_val and env_val.strip():
        return env_val.strip()

    # Check common .env locations (Windows & Unix)
    candidates = [
        Path.home() / ".hermes" / ".env",
        Path.home() / ".rubimind" / ".env",
        Path(os.path.expandvars(r"%LOCALAPPDATA%\hermes\.env")),
        Path(os.path.expandvars(r"%LOCALAPPDATA%\RUBIMIND\.env")),
    ]

    for candidate in candidates:
        try:
            if candidate.is_file():
                for line in candidate.read_text(encoding="utf-8", errors="replace").splitlines():
                    line = line.strip()
                    if line.startswith("#") or not line:
                        continue
                    if "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("\"'")
                        if key in ("RUBIMIND_API_KEY", "RBM_API_KEY") and val:
                            return val
        except Exception:
            continue

    return ""


def query_cadastral(
    query_type: str,
    query_value: str,
    api_key: Optional[str] = None,
    base_url: str = DEFAULT_ENDPOINT,
    timeout: int = 60,
) -> Dict[str, Any]:
    """Execute GET request against the cadastral endpoint."""
    q_type = query_type.lower().strip()
    if q_type not in VALID_TYPES:
        raise ValueError(f"Tipo inválido '{query_type}'. Tipos suportados: {', '.join(VALID_TYPES)}")

    key = resolve_api_key(api_key)
    if not key:
        raise ValueError(
            "Chave de API RUBIMIND não encontrada. Defina RUBIMIND_API_KEY no ambiente ou use --key."
        )

    clean_value = query_value.strip()
    # Strip formatting for numeric types
    if q_type in ("cpf", "cnpj", "telefone"):
        clean_value = "".join(ch for ch in clean_value if ch.isalnum())
    elif q_type == "placa":
        clean_value = "".join(ch for ch in clean_value if ch.isalnum()).upper()

    params = urllib.parse.urlencode({q_type: clean_value})
    url = f"{base_url.rstrip('/')}/{q_type}?{params}"

    headers = {
        "Authorization": f"Bearer {key}",
        "User-Agent": "RUBIMIND-Agent/1.0",
        "Accept": "application/json",
    }

    req = urllib.request.Request(url, headers=headers, method="GET")

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except urllib.error.HTTPError as err:
        err_body = err.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(err_body)
            msg = parsed.get("error") or parsed.get("message") or err_body
        except Exception:
            msg = err_body
        raise RuntimeError(f"Erro na API ({err.code}): {msg}") from err
    except urllib.error.URLError as err:
        raise RuntimeError(f"Falha de conexão com a API RUBIMIND: {err.reason}") from err


def format_cadastral_output(query_type: str, query_value: str, data: Dict[str, Any]) -> str:
    """Format JSON response into a forensic cadastral dossier."""
    lines = [
        "============================================================",
        f"  DOSSIÊ CADASTRAL FORENSE — RUBIMIND INTELLIGENCE",
        f"  Consulta: {query_type.upper()} | Chave: {query_value}",
        "============================================================",
    ]

    payload = data.get("dados") or data.get("result") or data.get("data") or data

    if isinstance(payload, dict):
        for k, v in payload.items():
            if k in ("success", "status") or v is None or v == "":
                continue
            key_label = k.replace("_", " ").capitalize()
            if isinstance(v, (dict, list)):
                lines.append(f"{key_label}:")
                formatted_nested = json.dumps(v, ensure_ascii=False, indent=2)
                for nested_line in formatted_nested.splitlines():
                    lines.append(f"  {nested_line}")
            else:
                lines.append(f"{key_label:<20}: {v}")
    elif isinstance(payload, list):
        for i, item in enumerate(payload, 1):
            lines.append(f"\n--- Registro #{i} ---")
            if isinstance(item, dict):
                for k, v in item.items():
                    if v is not None and v != "":
                        lines.append(f"{k.replace('_', ' ').capitalize():<20}: {v}")
            else:
                lines.append(str(item))
    else:
        lines.append(str(payload))

    lines.append("============================================================")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Consulta Cadastral em Tempo Real RUBIMIND")
    parser.add_argument("tipo", choices=VALID_TYPES, help="Tipo de consulta cadastral")
    parser.add_argument("valor", help="Valor a consultar (ex: CPF, CNPJ, telefone, placa, nome, email)")
    parser.add_argument("--key", default=None, help="Chave de API RUBIMIND (RBM-API-...)")
    parser.add_argument("--json", action="store_true", help="Imprimir retorno em JSON bruto")
    parser.add_argument("--base-url", default=DEFAULT_ENDPOINT, help="URL base da API cadastral")
    parser.add_argument("--timeout", type=int, default=60, help="Tempo limite da requisição em segundos")

    args = parser.parse_args()

    try:
        result = query_cadastral(
            query_type=args.tipo,
            query_value=args.valor,
            api_key=args.key,
            base_url=args.base_url,
            timeout=args.timeout,
        )

        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(format_cadastral_output(args.tipo, args.valor, result))

    except Exception as exc:
        print(f"[ERRO] {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
