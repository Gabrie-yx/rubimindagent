from pathlib import Path
import re

d = Path('apps/desktop/src')
results = []
for p in d.rglob('*.ts*'):
    try:
        content = p.read_text(encoding='utf-8')
        for i, line in enumerate(content.splitlines(), 1):
            if re.search(r'''from\s+['"][^'"]*hermes[^'"]*['"]''', line):
                results.append(f"{p.relative_to(d)}:{i}: {line.strip()}")
    except Exception:
        pass

print(f"Total imports with hermes in apps/desktop/src: {len(results)}")
for r in results[:40]:
    print(r)
