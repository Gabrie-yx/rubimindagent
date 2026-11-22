"""Shell-path patterns for the RUBIMIND home and its protected stores (#109367).

The terminal approval gate (tools.approval_detection) prompts before destructive verbs reach these
targets; the store list is HERMES_PROTECTED_SUBPATHS, shared with agent.file_safety's write deny.
"""
import re

from rubimind_cli.home_data_layout import HERMES_PROTECTED_SUBPATHS

# The RUBIMIND home itself and the application-owned stores the file tools refuse to write
# (HERMES_PROTECTED_SUBPATHS: state.db, sessions/, vault/, ...). Destroying them is recoverable only
# from backup, so destructive shell verbs on these targets prompt; reads and copies OUT stay clean.
_RUBIMIND_HOME_ROOT = r'(?:~/\.rubimind|(?:\$home|\$\{home\})/\.rubimind|(?:\$hermes_home|\$\{hermes_home\}))'
_PATH_WORD_END = r'["\']?(?=[\s"\'`;|&<>()]|$)'
# A store, its SQLite sidecars (state.db-wal) or a path inside a directory store (sessions/x.jsonl).
# Neighbours such as state.db.bak or sessions-old.tar are not stores (agent.file_safety agrees).
_HERMES_STORE_FILE = (
    _RUBIMIND_HOME_ROOT + r'/(?:' + '|'.join(
        re.escape(sub) + (r'(?:-wal|-shm|-journal)?' if sub.endswith('.db') else r'(?:/[^\s"\'`;|&<>()]*)?')
        for sub in HERMES_PROTECTED_SUBPATHS) + r')' + _PATH_WORD_END
)
# Overwrites inside credential directories must prompt (vault.key, MCP OAuth tokens, browser cookies).
# New session transcript files stay clean, as before; only the sessions/ root is an overwrite target.
_HERMES_STORE_ROOT = (
    _RUBIMIND_HOME_ROOT + r'/(?:' + '|'.join(
        re.escape(sub) + (
            r'(?:-wal|-shm|-journal)?' if sub.endswith('.db')
            else r'/?' if sub == 'sessions' else r'(?:/[^\s"\'`;|&<>()]*)?'
        )
        for sub in HERMES_PROTECTED_SUBPATHS) + r')' + _PATH_WORD_END
)
_RUBIMIND_HOME_BARE = rf'{_RUBIMIND_HOME_ROOT}/?\*?{_PATH_WORD_END}'
_HERMES_STORE_PATH = rf'(?:{_HERMES_STORE_FILE}|{_RUBIMIND_HOME_BARE})'
