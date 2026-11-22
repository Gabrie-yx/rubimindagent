"""`rubimind config set` of an approval-policy key is gated — and only the INVOCATION is.

The rule exists because `rubimind config set` can rewrite the agent's own approval policy
(``approvals.mode``, ``approvals.deny``, ``command_allowlist``), so it is gated like the
file-tool path for ``~/.rubimind/config.yaml``.

The first form of the rule was ``\\bhermes\\b.*\\bconfig\\b.*\\bset\\b.*\\bapprovals\\b``,
which matched that TEXT anywhere in the command. A plain read of the text therefore demanded
an approval it has no business demanding:

    grep -r 'rubimind config set' docs/approvals.md

The rule is anchored to a real invocation instead, so the read above stays a read.
"""

import time

import pytest

from tools.approval_detection import (
    _iter_dangerous_descriptions,
    detect_dangerous_command,
)

POLICY_RULE = "rubimind config set approval settings"


def _policy_rule_fires(command: str) -> bool:
    """Whether THIS rule matches (other rules may match the same command first)."""
    return POLICY_RULE in set(_iter_dangerous_descriptions(command, only={POLICY_RULE}))


@pytest.mark.parametrize("command", [
    "rubimind config set approvals.mode off",
    "rubimind config set approvals.deny 'rm -rf /'",
    "rubimind config set approvals allow",
    "rubimind config set command_allowlist 'rm -rf /'",
    # `config unset` removes a policy the same way `config set` rewrites it.
    "rubimind config unset approvals.deny",
    "rubimind config unset command_allowlist",
    # A global option in front of the subcommand, both spellings.
    "hermes --profile work config set approvals.mode off",
    "hermes -p work config set approvals.mode off",
    "hermes --json config set approvals.mode off",
    # `config set`'s own flag.
    "rubimind config set --force approvals.mode off",
    # The macOS bundle binary and an absolute path to the program.
    "ai.rubimind config set approvals.mode off",
    "/usr/local/bin/rubimind config set approvals.mode off",
    "hermes.exe config set approvals.mode off",
    # The module form the updater and the cron lifecycle guard actually invoke.
    "python -m rubimind_cli.main config set approvals.mode off",
    "python3 -m rubimind_cli.main config set approvals.mode off",
    # Behind another command in a chain.
    "cd /tmp && rubimind config set approvals.mode off",
    # The spellings the issue names: an inline home override in front of the program.
    "RUBIMIND_HOME=/tmp/x rubimind config set approvals.mode off",
    # Other value-taking top-level flags from the real parser.
    "hermes --resume abc config set approvals.mode off",
    "hermes -s skill config set command_allowlist x",
    # A quoted key reaches the CLI as the same key.
    'rubimind config set "approvals.mode" off',
    "rubimind config set 'command_allowlist' x",
    # `-p`/`--profile` is stripped from anywhere in argv, so it also works after the subcommand.
    "rubimind config set -p work approvals.mode off",
    "rubimind config set --profile=work approvals.mode off",
    "rubimind config -p work set approvals.mode off",
    "rubimind config --profile work unset command_allowlist",
    # A quoted assignment in front of the program.
    "NOTE='a b' rubimind config set approvals.mode off",
    'NOTE="a b" rubimind config set approvals.mode off',
    # A Windows drive-qualified program, either separator, and an attached `-m`.
    r"C:\Users\me\AppData\Local\hermes\hermes.exe config set approvals.mode off",
    "C:/Users/me/hermes.exe config set approvals.mode off",
    r"C:\Python312\python.exe -m rubimind_cli.main config set approvals.mode off",
    "python -mrubimind_cli.main config set approvals.mode off",
])
def test_a_real_config_set_invocation_is_gated(command):
    dangerous, _key, _description = detect_dangerous_command(command)
    assert dangerous is True, command
    assert _policy_rule_fires(command), f"the approval-policy rule did not fire for {command!r}"


@pytest.mark.parametrize("command", [
    # The reported false positive: a READ of the text, not the invocation.
    "grep -r 'rubimind config set' docs/approvals.md",
    "rg 'rubimind config set approvals' website/docs",
    "cat notes.md | grep 'rubimind config set'",
    # The text appears in a quoted argument of another command.
    "echo 'rubimind config set approvals.mode off'",
    "grep -rn 'rubimind config set command_allowlist' .",
    # A `hermes` invocation that is not the policy write.
    "rubimind config show",
    "rubimind config get approvals.mode",
    "rubimind config set model.default gpt-4o",
    "rubimind config set display.language en",
    # `unset` of a key that is not the approval policy.
    "rubimind config unset display.language",
    # The module form, but not a policy write.
    "python -m rubimind_cli.main config show",
    "RUBIMIND_HOME=/tmp/x rubimind config show",
    'rubimind config set "display.language" en',
    "rubimind config -p work set display.language en",
    "NOTE='a b' rubimind config show",
])
def test_a_read_or_an_unrelated_invocation_is_not_gated(command):
    dangerous, _key, description = detect_dangerous_command(command)
    assert dangerous is False, f"{command!r} was gated as {description!r}"
    assert description is None, command
    assert not _policy_rule_fires(command), f"the approval-policy rule fired for {command!r}"


def test_the_rule_is_approvable_not_a_hardline():
    """The policy write is a DANGEROUS rule (approvable, and bypassable under yolo /
    approvals.mode=off), not a HARDLINE one: hardline rules are never bypassable and are
    reserved for commands with no recovery path."""
    from tools.approval_detection import detect_hardline_command

    is_hardline, description = detect_hardline_command("rubimind config set approvals.mode off")
    assert is_hardline is False, description


def test_a_long_global_option_run_stays_linear():
    """The global-option run must not backtrack exponentially: a plain nested `(?:\\s+...)*`
    measured 0.34s per pattern at 30 flags and doubled every 2 more, and this rule is scanned
    on every terminal command."""
    command = "hermes " + " ".join(["--flag=value"] * 40) + " config set approvals.mode off"
    start = time.perf_counter()
    detect_dangerous_command(command)
    elapsed = time.perf_counter() - start
    assert elapsed < 2.0, f"detection took {elapsed:.3f}s for a 40-flag run"
