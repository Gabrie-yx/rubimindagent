import os
import re
import sys
from pathlib import Path

root = Path('.').resolve()
errors = []

scan_dirs = [
    root / 'ui-tui' / 'src',
    root / 'web' / 'src',
    root / 'apps' / 'desktop' / 'src',
    root / 'apps' / 'shared' / 'src'
]

import_pattern = re.compile(r"""(?:import|from)\s+['"](\.[^'"]+|@[^'"]+)['"]""")

for sdir in scan_dirs:
    if not sdir.exists():
        continue
    for f in sdir.rglob('*.ts*'):
        if f.name.endswith('.d.ts'):
            continue
        try:
            content = f.read_text(encoding='utf-8')
        except Exception:
            continue
        for line_no, line in enumerate(content.splitlines(), 1):
            for match in import_pattern.finditer(line):
                target = match.group(1)
                if target.startswith('.'):
                    resolved = False
                    base = f.parent / target
                    for ext in ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js']:
                        cand = base.with_name(base.name + ext) if not ext.startswith('/') else base / ext.lstrip('/')
                        if cand.exists():
                            resolved = True
                            break
                    if not resolved and target.endswith('.js'):
                        ts_base = f.parent / target[:-3]
                        for ext in ['.ts', '.tsx']:
                            if Path(str(ts_base) + ext).exists():
                                resolved = True
                                break
                    if not resolved:
                        errors.append(f"{f.relative_to(root)}:{line_no} -> {target}")

print(f"Total relative import errors: {len(errors)}")
for err in errors:
    print(err)
