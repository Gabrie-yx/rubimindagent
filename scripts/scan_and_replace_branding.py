import os
import re

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    orig = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.relpath(path, REPO_ROOT)}")

# 1. ui-tui/src/i18n/en/chatBits.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'chatBits.ts'),
    [
        ("tagFull: 'Nous Research · Messenger of the Digital Gods'", "tagFull: 'By Gabriel Almeida · Sovereign Intelligence'"),
        ("tagMid: 'Messenger of the Digital Gods'", "tagMid: 'By Gabriel Almeida'"),
        ("noTty: 'hermes-tui: no TTY'", "noTty: 'rubimind-tui: no TTY'"),
        ("${level} memory (${heap}) — auto heap dump", "${level} memory (${heap}) — auto heap dump"),
        ("hermes-tui:", "rubimind-tui:"),
        ("hermes-tui: exiting to avoid OOM", "rubimind-tui: exiting to avoid OOM"),
        ("Brand names (\"RUBIMIND\", \"Nous Research\")", "Brand names (\"RUBIMIND\", \"By Gabriel Almeida\")"),
    ]
)

# 2. ui-tui/src/components/branding.tsx
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'components', 'branding.tsx'),
    [
        ("const TAG_TINY = 'Nous Research'", "const TAG_TINY = 'By Gabriel Almeida'"),
        ("<Text color={t.color.muted}> · Nous Research</Text>", "<Text color={t.color.muted}> · By Gabriel Almeida</Text>"),
    ]
)

# 3. ui-tui/src/i18n/en/chrome.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'chrome.ts'),
    [
        ("summoning: 'summoning hermes…'", "summoning: 'summoning rubimind…'"),
        ("quit: 'exit hermes'", "quit: 'exit rubimind'"),
    ]
)

# 4. ui-tui/src/components/appChrome.tsx
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'components', 'appChrome.tsx'),
    [
        ("const EMOJI_FRAMES = ['☤ ', '🌀', '🤔', '✨', '🍵', '🔮']", "const EMOJI_FRAMES = ['♦ ', '🌀', '🤔', '✨', '🍵', '🔮']"),
        ("if (status === 'summoning hermes…')", "if (status === 'summoning hermes…' || status === 'summoning rubimind…')"),
    ]
)

# 5. ui-tui/src/i18n/en/billing.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'billing.ts'),
    [
        ("allow Nous Research to charge", "allow Gabriel Almeida to charge"),
        ("authorize Nous Research to charge", "authorize Gabriel Almeida to charge"),
    ]
)

# 6. ui-tui/src/i18n/en/session.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'session.ts'),
    [
        ("summoning hermes…", "summoning rubimind…"),
        ("`launching \\`hermes ${command}\\`…`", "`launching \\`rubimind ${command}\\`…`"),
        ("`error launching hermes: ${error}`", "`error launching rubimind: ${error}`"),
        ("`hermes ${subcommand} exited with code ${code}`", "`rubimind ${subcommand} exited with code ${code}`"),
    ]
)

# 7. ui-tui/src/i18n/en/gatewayMsg.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'gatewayMsg.ts'),
    [
        ("run: hermes -p ${profile}", "run: rubimind -p ${profile}"),
    ]
)

# 8. ui-tui/src/i18n/en/hubs.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'hubs.ts'),
    [
        ("install: hermes plugins install", "install: rubimind plugins install"),
        ("`hermes plugins install", "`rubimind plugins install"),
    ]
)

# 9. ui-tui/src/i18n/en/slashCmd/core.ts and ops.ts
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'slashCmd', 'core.ts'),
    [
        ("(hermes serve)", "(rubimind serve)"),
    ]
)
replace_in_file(
    os.path.join(REPO_ROOT, 'ui-tui', 'src', 'i18n', 'en', 'slashCmd', 'ops.ts'),
    [
        ("hermes plugins update", "rubimind plugins update"),
    ]
)

# 10. ui-tui/src/theme.ts
theme_path = os.path.join(REPO_ROOT, 'ui-tui', 'src', 'theme.ts')
if os.path.exists(theme_path):
    with open(theme_path, 'r', encoding='utf-8') as f:
        theme_content = f.read()
    theme_content = re.sub(
        r"const BRAND: ThemeBrand = \{[\s\S]*?helpHeader: '\(\^_\^\)\? Commands'\s*\}",
        """const BRAND: ThemeBrand = {
  name: 'RUBIMIND Agent',
  icon: '♦',
  prompt: '❯',
  welcome: 'Type your message or /help for commands.',
  goodbye: 'Goodbye! ♦',
  tool: '┊',
  helpHeader: '(^_^)? Commands'
}""",
        theme_content
    )
    dark_seeds_ruby = """export const DARK_SEEDS: ThemeSeeds = {
  accent: '#FF1A40',
  activeRow: '#260B12',
  bg: '#080808',
  border: '#800020',
  error: '#EF4444',
  ok: '#22C55E',
  primary: '#FF1A40',
  prompt: '#FF1A40',
  selection: '#3D0C1A',
  shellDollar: '#FF4D6D',
  statusBad: '#F97316',
  statusCritical: '#EF4444',
  statusGood: '#22C55E',
  statusWarn: '#FF1A40',
  surface: '#12070A',
  text: '#F5F5F5',
  warn: '#FB923C'
}"""
    theme_content = re.sub(r"export const DARK_SEEDS: ThemeSeeds = \{[\s\S]*?warn: '#ffa726'\s*\}", dark_seeds_ruby, theme_content)
    with open(theme_path, 'w', encoding='utf-8') as f:
        f.write(theme_content)
    print("Updated theme.ts")

# 11. ui-tui/src/domain/paths.ts
paths_ts = os.path.join(REPO_ROOT, 'ui-tui', 'src', 'domain', 'paths.ts')
if os.path.exists(paths_ts):
    with open(paths_ts, 'r', encoding='utf-8') as f:
        c = f.read()
    new_compose = """export const composeTabTitle = (
  marker: string,
  sessionName: string,
  model: string,
  cwd: string,
  maxName = 28
): string => {
  const name = (sessionName || '').trim() || 'RUBIMIND'
  const shortName = name.length > maxName ? `${name.slice(0, maxName - 1)}…` : name

  const segments = [shortName, model, cwd].filter(Boolean)

  return segments.length ? `${marker} ${segments.join(' · ')}` : 'RUBIMIND'
}"""
    c = re.sub(r"export const composeTabTitle = \([\s\S]*?return segments\.length \? `\$\{marker\} \$\{segments\.join\(' · '\)\}` : marker\s*\}", new_compose, c)
    with open(paths_ts, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated paths.ts")

# 12. ui-tui/src/app/useMainApp.ts
use_main_app = os.path.join(REPO_ROOT, 'ui-tui', 'src', 'app', 'useMainApp.ts')
replace_in_file(
    use_main_app,
    [
        ("tab: composeTabTitle(marker, ui.sessionTitle, '', ''),", "tab: composeTabTitle(marker, ui.sessionTitle || 'RUBIMIND', '', ''),"),
        ("window: composeTabTitle(marker, ui.sessionTitle, model, tabCwd ? shortCwd(tabCwd, 24) : '')", "window: composeTabTitle(marker, ui.sessionTitle || 'RUBIMIND', model, tabCwd ? shortCwd(tabCwd, 24) : '')")
    ]
)

# 13. locales
locales_dir = os.path.join(REPO_ROOT, 'locales')
if os.path.isdir(locales_dir):
    for fn in os.listdir(locales_dir):
        if fn.endswith(('.yaml', '.yml')):
            fp = os.path.join(locales_dir, fn)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as lf:
                c = lf.read()
            c = c.replace("Nous Research", "By Gabriel Almeida")
            c = c.replace("nous research", "by gabriel almeida")
            c = c.replace("NOUS RESEARCH", "BY GABRIEL ALMEIDA")
            c = c.replace("Messenger of the Digital Gods", "Sovereign Intelligence")
            c = c.replace("Mensageiro dos Deuses Digitais", "Soberania Digital")
            c = c.replace("summoning hermes", "summoning rubimind")
            c = c.replace("invocando o hermes", "invocando o rubimind")
            with open(fp, 'w', encoding='utf-8') as lf:
                lf.write(c)
    print("Updated all locales")

# 14. Global sweep for any remaining 'Nous Research' in markdown/config/docs
for root, dirs, files in os.walk(REPO_ROOT):
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.venv', '__pycache__', 'dist']]
    for f in files:
        if f.endswith(('.md', '.yaml', '.yml', '.json', '.toml', '.example')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            if 'nous research' in c.lower() or 'messenger of the digital gods' in c.lower():
                c = re.sub(r'(?i)nous research', 'By Gabriel Almeida', c)
                c = re.sub(r'(?i)messenger of the digital gods', 'Sovereign Intelligence', c)
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(c)
                print(f"Swept {os.path.relpath(p, REPO_ROOT)}")

print("Scan and replacement completed successfully!")
