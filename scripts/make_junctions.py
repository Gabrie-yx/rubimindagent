import subprocess
import os
from pathlib import Path

root = Path('.').resolve()

def make_junction(link, target):
    link = Path(link)
    target = Path(target)
    if link.exists():
        print(f"Exists: {link}")
        return
    link.parent.mkdir(parents=True, exist_ok=True)
    res = subprocess.run(f'cmd /c mklink /J "{link}" "{target}"', shell=True, capture_output=True, text=True)
    print(f"Junction {link} -> {target}: {res.stdout.strip()} {res.stderr.strip()}")

# Root links
make_junction(root / 'node_modules' / '@hermes' / 'ink', root / 'ui-tui' / 'packages' / 'rubimind-ink')
make_junction(root / 'node_modules' / '@hermes' / 'shared', root / 'apps' / 'shared')
make_junction(root / 'node_modules' / '@rubimind' / 'ink', root / 'ui-tui' / 'packages' / 'rubimind-ink')
make_junction(root / 'node_modules' / '@rubimind' / 'shared', root / 'apps' / 'shared')

make_junction(root / 'node_modules' / '@nanostores', root / 'ui-tui' / 'node_modules' / '@nanostores')
make_junction(root / 'node_modules' / 'nanostores', root / 'ui-tui' / 'node_modules' / 'nanostores')
make_junction(root / 'node_modules' / 'react', root / 'ui-tui' / 'node_modules' / 'react')
make_junction(root / 'node_modules' / 'ink-text-input', root / 'ui-tui' / 'node_modules' / 'ink-text-input')
make_junction(root / 'node_modules' / 'unicode-animations', root / 'ui-tui' / 'node_modules' / 'unicode-animations')

# ui-tui links
make_junction(root / 'ui-tui' / 'node_modules' / '@rubimind' / 'ink', root / 'ui-tui' / 'packages' / 'rubimind-ink')
make_junction(root / 'ui-tui' / 'node_modules' / '@rubimind' / 'shared', root / 'apps' / 'shared')
make_junction(root / 'ui-tui' / 'node_modules' / '@hermes' / 'ink', root / 'ui-tui' / 'packages' / 'rubimind-ink')
make_junction(root / 'ui-tui' / 'node_modules' / '@hermes' / 'shared', root / 'apps' / 'shared')

# desktop plugins link
make_junction(root / 'apps' / 'desktop' / 'src' / 'plugins' / 'hermes-bots', root / 'apps' / 'desktop' / 'src' / 'plugins' / 'rubimind-bots')
print("All junctions verified!")
