import re
import sys
from pathlib import Path

root = Path('.').resolve()
dirs = [
    root / 'apps' / 'desktop' / 'src',
    root / 'ui-tui' / 'src',
    root / 'web' / 'src',
    root / 'apps' / 'shared' / 'src'
]

named_import_re = re.compile(r'import\s+\{([^}]+)\}\s+from\s+[\'"](\.[^\'"]+)[\'"]')

broken_symbols = []

for d in dirs:
    if not d.exists():
        continue
    for f in d.rglob('*.ts*'):
        if f.name.endswith('.d.ts'):
            continue
        try:
            content = f.read_text(encoding='utf-8')
        except Exception:
            continue
        for match in named_import_re.finditer(content):
            raw_symbols = match.group(1)
            target = match.group(2)

            target_path = None
            base = f.parent / target
            for ext in ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js']:
                cand = base.with_name(base.name + ext) if not ext.startswith('/') else base / ext.lstrip('/')
                if cand.exists() and cand.is_file():
                    target_path = cand
                    break
            if not target_path and target.endswith('.js'):
                ts_base = f.parent / target[:-3]
                for ext in ['.ts', '.tsx']:
                    cand = Path(str(ts_base) + ext)
                    if cand.exists() and cand.is_file():
                        target_path = cand
                        break

            if not target_path:
                continue

            target_content = target_path.read_text(encoding='utf-8', errors='ignore')

            # If target has export *, skip
            if 'export *' in target_content:
                continue

            symbols = [s.strip() for s in raw_symbols.split(',') if s.strip()]
            for sym in symbols:
                sym_clean = re.sub(r'^type\s+', '', sym).strip()
                orig_name = sym_clean.split()[0].strip()
                if not orig_name:
                    continue
                exp_pat = rf'export\s+(?:(?:declare\s+)?(?:const|function|class|type|interface|let|var|enum)\s+{re.escape(orig_name)}\b|\{{[^}}]*\b{re.escape(orig_name)}\b[^}}]*\}})'
                if not re.search(exp_pat, target_content):
                    broken_symbols.append((str(f.relative_to(root)), orig_name, str(target_path.relative_to(root))))

print(f"Total potential broken symbol imports: {len(broken_symbols)}")
for src, sym, tgt in broken_symbols:
    print(f"{src}: imported '{sym}' from {tgt}")
