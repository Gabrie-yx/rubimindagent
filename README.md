<p align="center">
  <img src="assets/rubimind.png" alt="RUBIMIND AI" width="160">
</p>

# RUBIMIND ⚡

<p align="center">
  <b>Plataforma de Inteligência Estratégica, Agentes Autônomos & Execução Digital</b>
</p>

<p align="center">
  <a href="https://rubimindia.vercel.app"><img src="https://img.shields.io/badge/API-RUBIMIND%20v1-red?style=for-the-badge" alt="API RUBIMIND"></a>
  <a href="https://rubimindia.vercel.app"><img src="https://img.shields.io/badge/Plataforma-RUBIMIND-black?style=for-the-badge" alt="Plataforma"></a>
  <img src="https://img.shields.io/badge/Status-Produção-darkred?style=for-the-badge" alt="Status">
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença: MIT"></a>
  <img src="https://img.shields.io/badge/Núcleo-Hermes%20Agent-blueviolet?style=for-the-badge" alt="Powered by Hermes">
</p>

---

**RUBIMIND** é a inteligência estratégica definitiva projetada para quem exige alta performance, automação cirúrgica e controle total da sua máquina. Uma esteira autônoma que une raciocínio avançado via modelos nativos da API RUBIMIND com capacidade bruta de execução local — lendo e escrevendo arquivos, operando terminais, navegando na internet e gerenciando pipelines complexos sem atalhos ou preguiça.

> **Nota de Arquitetura & Desenvolvimento:**  
> O **RUBIMIND** foi construído e expandido a partir da robusta arquitetura de agentes open-source do **Hermes Agent** (Nous Research). Adaptamos e elevamos esse motor para integrar nativamente ao ecossistema, modelos proprietários (`rubimind-0.2-omni` e `rubimind-0.1-core`) e identidade da nossa plataforma RUBIMIND, com interface gráfica personalizada, suporte multilíngue (com português nativo) e esteira de automações estratégicas.

---

## 🚀 Principais Capacidades

<table>
<tr>
  <td width="28%"><b>🖥️ Interface Desktop & Terminal</b></td>
  <td>Aplicativo desktop completo em Electron com tema escuro e vermelho de alto contraste, visualizador de artefatos, abas de sessões, bots integrados e terminal interativo TUI com autocompletion de comandos.</td>
</tr>
<tr>
  <td><b>🧠 Soberania de Execução Local</b></td>
  <td>O cérebro estratégico processa pela API oficial do RUBIMIND, mas as ações (criação de arquivos, scripts, comandos no terminal, chamadas MCP e pesquisas) ocorrem de forma 100% segura e isolada na sua máquina.</td>
</tr>
<tr>
  <td><b>⚡ Catálogo de Skills & Ferramentas</b></td>
  <td>Suporte a dezenas de ferramentas nativas (execução de código em Python/Bash/PowerShell, manipulador de arquivos, scraping, web search) e sistema de skills procedurais com evolução contínua.</td>
</tr>
<tr>
  <td><b>📡 Gateway Omnichannel</b></td>
  <td>Conecte o seu agente diretamente a canais como Telegram, Discord, Slack e WhatsApp, mantendo o histórico de conversa unificado entre celular e computador.</td>
</tr>
<tr>
  <td><b>⏱️ Automações & Cron Jobs</b></td>
  <td>Agendador interno nativo para rotinas periódicas: relatórios diários de mercado, monitoramento de servidores, backups e auditorias automatizadas sem intervenção humana.</td>
</tr>
<tr>
  <td><b>🔒 Segurança & Privacidade</b></td>
  <td>Credenciais, históricos e memórias residem na sua máquina local (`.env` e SQLite). Zero dependência de contas terceiras invasivas.</td>
</tr>
</table>

---

## 🛠️ Como Iniciar

### 1. Pré-requisitos
- **Node.js** (versão 22 ou superior)
- **Python** (versão 3.11 ou superior)
- Git instalado

### 2. Configuração da Chave de API RUBIMIND

Obtenha sua chave de API no portal do RUBIMIND (com formato `RBM-API-...`).

No seu terminal ou no arquivo `.env` localizado na sua pasta de configuração (`%LOCALAPPDATA%\hermes\.env` no Windows ou `~/.hermes/.env` no Linux/macOS), configure:

```env
RUBIMIND_API_KEY=RBM-API-SUA_CHAVE_AQUI
```

Em `config.yaml` (`%LOCALAPPDATA%\hermes\config.yaml` ou `~/.hermes/config.yaml`):

```yaml
providers:
  rubimind:
    name: RUBIMIND AI
    api: "https://rubimindia.vercel.app/api/public/v1"
    key_env: RUBIMIND_API_KEY
    transport: chat_completions
    default_model: rubimind-0.2-omni
    models:
      - rubimind-0.1-core
      - rubimind-0.2-omni

model:
  provider: custom:rubimind
  default: rubimind-0.2-omni
  base_url: "https://rubimindia.vercel.app/api/public/v1"
  api_mode: chat_completions
```

Você também pode configurar tudo graficamente pelo aplicativo em **Settings → Providers → RUBIMIND AI**.

---

## 💻 Comandos e Execução

Você pode operar o RUBIMIND tanto pela interface gráfica desktop quanto pelo terminal:

```powershell
# 1. Abrir o aplicativo Desktop
.\rubimind desktop

# 2. Abrir o aplicativo Desktop (modo rápido, sem rebuild)
.\rubimind desktop --skip-build

# 3. Conversar diretamente pelo Terminal interativo (TUI)
.\rubimind

# 4. Gerenciar modelos e provedores
.\rubimind model

# 5. Iniciar o Gateway de Mensageria (WhatsApp, Telegram, etc.)
.\rubimind gateway
```

---

## ⚙️ Modelos Suportados na API

| Modelo | Identificador | Aplicação |
| :--- | :--- | :--- |
| **RUBIMIND Omni** | `rubimind-0.2-omni` | Raciocínio avançado, arquitetura, automação e execução de ferramentas (*Recomendado*). |
| **RUBIMIND Core** | `rubimind-0.1-core` | Processamento rápido e direto para tarefas pontuais de código e síntese. |

---

## 👥 Créditos & Reconhecimento

- Plataforma e ecossistema: **RUBIMIND** ([rubimindia.vercel.app](https://rubimindia.vercel.app))
- Engenharia de base: Desenvolvido utilizando a tecnologia e o motor de agentes open-source [Hermes](https://github.com/NousResearch/hermes-agent) da **Nous Research**.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
