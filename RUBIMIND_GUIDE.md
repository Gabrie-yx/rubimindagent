# RUBIMIND — Plataforma Soberana de Agentes de IA

> **Fork Soberano do RUBIMIND Agent (By Gabriel Almeida)**  
> **Edição Obsidian & Crimson (Preto & Vermelho Rubi)**

---

## 💎 Identidade e Filosofia

O **RUBIMIND** é uma plataforma de agentes de IA autônomos de alta autoridade, projetada para execução implacável, automação de tarefas complexas, estratégias digitais e soberania tecnológica.

- **Símbolo Oficial:** ♦ (Rubi Lapidado)
- **Paleta de Cores:**
  - **Fundo Obsidiana Profundo:** `#080808`, `#0A0A0A`, `#111113`
  - **Vermelho Rubi & Carmesim:** `#FF1A40`, `#E0115F`, `#DC2626`, `#990000`, `#800020`
  - **Destaques e Glow:** `rgba(255, 26, 64, 0.35)`
  - **Tipografia:** `#F4F4F5` / `#FFFFFF` (Alto Contraste WCAG)
- **Disciplina Operacional (`SOUL.md`):** Comunicação direta, autoridade, tolerância zero para preguiça ou placeholders, e entrega completa de soluções de ponta a ponta.

---

## 🚀 Como Executar

### 1. Linha de Comando (CLI & TUI)

Executar o terminal interativo do RUBIMIND:

```bash
# Execução direta via módulo Python
python -m rubimind_cli.main

# Ou via entry point instalado
rubimind
```

Opções frequentes:
```bash
rubimind chat -q "Sua instrução aqui"  # Modo de consulta única (one-shot)
rubimind --tui                         # Terminal interativo moderno com interface TUI
rubimind -c                            # Retoma a última sessão ativa
rubimind model                         # Configura provedor e modelo de IA
rubimind config                        # Visualiza configurações da plataforma
```

### 2. Dashboard Web

Inicie a interface web com o tema exclusivo RUBIMIND (Preto & Vermelho):

```bash
python -m rubimind_cli.main dashboard
# Ou:
rubimind dashboard
```

Acesse no navegador:
👉 `http://localhost:9119`

O Dashboard já vem pré-configurado com os temas **RUBIMIND Obsidian** e **RUBIMIND Crimson**, apresentando o novo branding e a paleta escura com detalhes rubi.

---

## 🛠️ Arquivos e Módulos Customizados

| Componente | Arquivo | Modificação Realizada |
|---|---|---|
| **ASCII Art & Banner** | `rubimind_cli/banner.py` | Logo ASCII gigante em Vermelho Rubi + Emblema em Braille do Rubi Lapidado (♦) |
| **Engine de Skins** | `rubimind_cli/skin_engine.py` | Skin padrão `default` e `rubimind` com paleta Crimson & Obsidian e boas-vindas oficiais |
| **CLI Parser** | `rubimind_cli/_parser.py` | Parser renomeado para `rubimind` e exemplos de comandos atualizados |
| **Entrypoints** | `pyproject.toml` | Adicionados `rubimind`, `rubimind-agent` e `rubimind-acp` |
| **Web Tokens** | `apps/shared/src/theme-presets.ts` | Adicionado preset de tokens `rubimind` (Dark & Red) |
| **Web Presets** | `web/src/themes/presets.ts` | Configuração padrão com `RUBIMIND Obsidian` e `RUBIMIND Crimson` |
| **Dashboard UI** | `web/src/App.tsx` & `web/index.html` | Header lateral com Rubi (♦), branding RUBIMIND e metadados |
| **Backend Dashboard**| `rubimind_cli/web_server_dashboard.py` | Registro dos temas RUBIMIND no backend do servidor web |
| **Soul & Identity** | `SOUL.md` | Persona soberana e diretrizes antipreguiça do RUBIMIND |

---

## 🧠 Integração Obsidian & MCP

O RUBIMIND está conectado ao servidor MCP **Obsidian** para sincronização contínua de:
- Projetos e sub-tarefas autônomas
- Registro estruturado de decisões arquiteturais (`log_decision`)
- Base de conhecimento e descobertas (`log_discovery`)
- Contexto contínuo entre sessões
