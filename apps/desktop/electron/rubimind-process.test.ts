import { describe, expect, it } from 'vitest'

import { commandLineIsRUBIMINDRuntime } from './rubimind-process'

// HX003: process identity comes from a whole argv TOKEN, never an argv substring.
describe('commandLineIsRUBIMINDRuntime (HX003 token matching)', () => {
  it('matches a real RUBIMIND gateway command line', () => {
    expect(commandLineIsRUBIMINDRuntime('hermes\0gateway\0run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('hermes gateway run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('hermes --profile work gateway run')).toBe(true)
  })

  it('matches a RUBIMIND launched by an interpreter (basename of a path token)', () => {
    expect(commandLineIsRUBIMINDRuntime('/venv/bin/python\0/venv/bin/hermes\0gateway\0run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('C:\\RUBIMIND\\hermes.exe gateway run')).toBe(true)
  })

  // The bug this replaces: a bare `.includes('hermes')` matched any of these.
  it('does NOT match an unrelated process whose path merely contains "hermes"', () => {
    expect(commandLineIsRUBIMINDRuntime('vim /home/user/hermes-notes.txt')).toBe(false)
    expect(commandLineIsRUBIMINDRuntime('/opt/hermesbrew/bin/tool --run')).toBe(false)
    expect(commandLineIsRUBIMINDRuntime('node /srv/hermes-dashboard/server.js')).toBe(false)
    expect(commandLineIsRUBIMINDRuntime('cat ~/.rubimind/config.yaml')).toBe(false)
  })

  // G2 (#150283): the real unmanaged-gateway launch is `python -m rubimind_cli.main … gateway
  // run`, which the executable-basename-only matcher REJECTED — so findRunningGatewayProfiles
  // missed a live gateway at first launch / profile repair. Mirror the canonical Python matcher
  // (gateway.status.looks_like_gateway_command_line): recognize the module entry point, by argv
  // TOKENS not a substring, carrying the gateway subcommand.
  it('matches a module-launched gateway (python -m rubimind_cli.main … gateway run)', () => {
    expect(commandLineIsRUBIMINDRuntime('python\0-m\0rubimind_cli.main\0-p\0x\0gateway\0run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('python -m rubimind_cli.main -p x gateway run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('/venv/bin/python /venv/lib/rubimind_cli/main.py gateway run')).toBe(true)
    expect(commandLineIsRUBIMINDRuntime('python -m rubimind_cli.main --profile work gateway run')).toBe(true)
  })

  it('does NOT match a module entry without the gateway subcommand, nor an unrelated hermes-tool path', () => {
    // A rubimind_cli.main invocation that is not a gateway (e.g. `chat`) is not a running gateway.
    expect(commandLineIsRUBIMINDRuntime('python -m rubimind_cli.main chat')).toBe(false)
    // HX003: no substring; an unrelated tool whose path contains "hermes" is never a runtime.
    expect(commandLineIsRUBIMINDRuntime('/opt/hermes-tool/foo gateway run')).toBe(false)
    // `-p gateway` is a profile value, not a subcommand.
    expect(commandLineIsRUBIMINDRuntime('python -m rubimind_cli.main -p gateway chat')).toBe(false)
  })
})
