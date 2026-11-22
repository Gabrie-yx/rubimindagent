"""persistence.sqlite._schema and _schema_ddl stand alone: the DDL carries the table text the updater and gateway downgrade guards look for, and importing both modules loads none of the ``rubimind_state`` store or mixin modules.
"""

import subprocess
import sys
from pathlib import Path

from rubimind_cli.update_downgrade_guard import _RUNTIME_SCHEMA_MARKER
from persistence.sqlite import _schema, _schema_ddl


def test_downgrade_guard_marker_present():
    # The updater and gateway downgrade guards recognise a tree with the runtime ledger by this statement.
    assert _RUNTIME_SCHEMA_MARKER in _schema_ddl.SCHEMA_SQL


def test_imports_no_legacy_store_or_mixin_module():
    probe = (
        "import sys, persistence.sqlite._schema, persistence.sqlite._schema_ddl\n"
        "mixins = ('rubimind_state', 'rubimind_state_schema', 'rubimind_state_fts', 'rubimind_state_search',"
        " 'rubimind_state_titles', 'rubimind_state_gateway', 'rubimind_state_sessions', 'rubimind_state_messages')\n"
        "print(sorted(m for m in mixins if m in sys.modules))\n"
    )
    root = Path(_schema.__file__).resolve().parents[2]
    result = subprocess.run([sys.executable, "-c", probe], cwd=root, capture_output=True, text=True, check=True)
    assert result.stdout.strip() == "[]"
