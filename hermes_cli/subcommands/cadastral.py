"""``hermes cadastral`` subcommand parser and dispatcher for RUBIMIND."""

from __future__ import annotations

import argparse
import json
import sys


def cmd_cadastral(args: argparse.Namespace) -> None:
    """Execute cadastral query."""
    from skills.research.cadastral.scripts.cadastral import (
        format_cadastral_output,
        query_cadastral,
    )

    try:
        result = query_cadastral(
            query_type=args.tipo,
            query_value=args.valor,
            api_key=args.api_key,
            timeout=args.timeout,
        )
        if args.json_output:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(format_cadastral_output(args.tipo, args.valor, result))
    except Exception as exc:
        print(f"[ERRO] {exc}", file=sys.stderr)
        sys.exit(1)


def build_cadastral_parser(subparsers) -> None:
    """Attach the ``cadastral`` subcommand to ``subparsers``."""
    parser = subparsers.add_parser(
        "cadastral",
        help="Consult real-time cadastral data (CPF, CNPJ, telefone, placa, nome, email)",
        description="Execute real-time forensic cadastral lookups via RUBIMIND API (/api/public/v1/cadastral).",
    )
    parser.add_argument(
        "tipo",
        choices=["cpf", "cnpj", "telefone", "placa", "nome", "email"],
        help="Query type: cpf, cnpj, telefone, placa, nome, email",
    )
    parser.add_argument(
        "valor",
        help="Target value to look up (e.g. 12345678900, 11987654321, ABC1D23)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Output raw JSON response",
    )
    parser.add_argument(
        "--key",
        default=None,
        dest="api_key",
        help="RUBIMIND API Key (defaults to RUBIMIND_API_KEY environment variable or config)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        dest="timeout",
        help="Request timeout in seconds (default: 60)",
    )
    parser.set_defaults(func=cmd_cadastral)
