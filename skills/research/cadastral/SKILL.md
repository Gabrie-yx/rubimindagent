---
name: cadastral
description: "Consult real-time cadastral data via RUBIMIND API."
version: 1.0.0
author: Gabriel Azuello, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Cadastral, CPF, CNPJ, Intelligence, Forensics, Investigation, API, Brazil]
    category: research
---

# Cadastral Research Skill

Provides real-time forensic and cadastral intelligence lookups through the official RUBIMIND public API endpoint (`https://rubimindia.vercel.app/api/public/v1/cadastral`).

## When to Use

Use this skill whenever the user or task asks to:
- Investigate or enrich information about a Brazilian person via CPF or Full Name (`nome`).
- Lookup corporate entity details, addresses, and registration status via CNPJ.
- Trace ownership or registration linked to a vehicle license plate (`placa`).
- Identify holders associated with a phone number (`telefone`) or email address (`email`).
- Produce an intelligence dossier with verified identity, address, and parentage records.

## Prerequisites

- Active RUBIMIND API key (`RBM-API-...`) in `RUBIMIND_API_KEY` or configured in the environment.
- Python 3.10+ standard library (no external third-party dependencies required).

## How to Run

Execute the bundled helper script `cadastral.py` with `terminal`:

```bash
python skills/research/cadastral/scripts/cadastral.py <tipo> <valor>
```

Supported types: `cpf`, `cnpj`, `telefone`, `placa`, `nome`, `email`.

For raw JSON responses:
```bash
python skills/research/cadastral/scripts/cadastral.py <tipo> <valor> --json
```

Or execute directly through the RUBIMIND CLI:
```bash
hermes cadastral <tipo> <valor>
```

## Quick Reference

| Type | Parameter | Example | Notes |
|------|-----------|---------|-------|
| CPF | `cpf` | `hermes cadastral cpf 12345678900` | Automated database redundancy |
| CNPJ | `cnpj` | `hermes cadastral cnpj 12345678000190` | Company registration & data |
| Telefone | `telefone` | `hermes cadastral telefone 11987654321` | Cell phone or landline |
| Placa | `placa` | `hermes cadastral placa ABC1D23` | Mercosul or legacy format |
| Nome | `nome` | `hermes cadastral nome "FULANO DE TAL"` | Full name lookup |
| Email | `email` | `hermes cadastral email nome@dominio.com` | Email holder trace |

## Procedure

1. **Identify the target identifier:** Extract the target type and value from the user request.
2. **Execute query:** Run the helper script via `terminal`:
   ```bash
   hermes cadastral <tipo> "<valor>"
   ```
3. **Format findings:** Present the parsed results to the user as a clear forensic dossier, highlighting verified identity, registration status, date of birth, mother's name, and registered addresses.
4. **Privacy:** Treat cadastral findings with appropriate confidentiality and data protection care.

## Pitfalls

- **Punctuation:** The script automatically strips punctuation from CPF, CNPJ, and phone numbers, but raw cURL requests require clean alphanumeric strings.
- **Timeout:** Cadastral database federations may require up to 60 seconds for deep redundancy checks; do not terminate requests early.
- **Missing Key:** If `RUBIMIND_API_KEY` is not present, pass `--key <RBM-API-...>` explicitly.

## Verification

Run a test query or check script help:
```bash
hermes cadastral --help
```
