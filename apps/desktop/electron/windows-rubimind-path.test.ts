// Unit tests for the pure Windows `hermes` resolution helpers extracted from
// main.ts's findOnPath(), handOffWindowsBootstrapRecovery(), and
// unwrapWindowsVenvRUBIMINDCommand(). These pin the two Windows resolution bugs
// that caused desktop reinstall loops:
//   1. buildPathExtCandidates() — PATHEXT extensions must be tried BEFORE the
//      empty extension, or an extensionless Git-Bash `hermes` shim shadows
//      the real hermes.cmd/hermes.exe.
//   2. chooseUpdaterArgs() — must distinguish a runnable updater from stale
//      install provenance. The bootstrap marker can outlive the venv, and a
//      partial venv cannot run the updater; those states require --repair.
//   3. resolveVenvRUBIMINDCommand() — must probe the venv python via
//      canImportRUBIMINDCli() before trusting it, or a broken venv gets
//      re-selected forever instead of falling through to bootstrap.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { buildPathExtCandidates, chooseUpdaterArgs, resolveVenvRUBIMINDCommand } from './windows-rubimind-path'

test('buildPathExtCandidates: Windows tries PATHEXT extensions before the empty extension', () => {
  const extensions = buildPathExtCandidates('.COM;.EXE;.BAT;.CMD', true)

  assert.deepEqual(extensions, ['.COM', '.EXE', '.BAT', '.CMD', ''])
  assert.equal(extensions[extensions.length - 1], '', 'empty extension must be last, not first')
  assert.notEqual(extensions[0], '', 'the buggy empty-extension-first order must not return')
})

test('buildPathExtCandidates: defaults to .COM;.EXE;.BAT;.CMD when PATHEXT is unset on Windows', () => {
  assert.deepEqual(buildPathExtCandidates(undefined, true), ['.COM', '.EXE', '.BAT', '.CMD', ''])
})

test('buildPathExtCandidates: respects a custom PATHEXT, still empty-last', () => {
  assert.deepEqual(buildPathExtCandidates('.EXE;.PS1', true), ['.EXE', '.PS1', ''])
})

test('buildPathExtCandidates: non-Windows only tries the bare name', () => {
  assert.deepEqual(buildPathExtCandidates('.COM;.EXE;.BAT;.CMD', false), [''])
  assert.deepEqual(buildPathExtCandidates(undefined, false), [''])
})

test('chooseUpdaterArgs preserves the target and requires a usable runtime, not a marker', () => {
  assert.deepEqual(chooseUpdaterArgs({ runtimeUsable: true }, 'release/1.2'), ['--update', '--branch', 'release/1.2'])
  assert.deepEqual(chooseUpdaterArgs({ runtimeUsable: false }, 'release/1.2'), ['--repair', '--branch', 'release/1.2'])
})

function makeDeps(overrides: Partial<Parameters<typeof resolveVenvRUBIMINDCommand>[2]> = {}) {
  return {
    isWindows: true,
    isCommandScript: () => false,
    fileExists: () => true,
    directoryExists: () => false,
    canImportRUBIMINDCli: async () => true,
    getVenvPython: (venvRoot: string) => `${venvRoot}/Scripts/python.exe`,
    buildDesktopBackendEnv: () => ({ FAKE_ENV: '1' }),
    resolvePath: (...segments: string[]) => segments.join('/').replace(/\/+/g, '/'),
    dirname: (p: string) => p.slice(0, p.lastIndexOf('/')) || '/',
    basename: (p: string) => p.slice(p.lastIndexOf('/') + 1),
    rememberLog: () => {},
    ...overrides
  }
}

test('resolveVenvRUBIMINDCommand: returns null off Windows', async () => {
  const deps = makeDeps({ isWindows: false })

  assert.equal(await resolveVenvRUBIMINDCommand('/root/venv/Scripts/hermes.exe', [], deps), null)
})

test('resolveVenvRUBIMINDCommand: returns null for a .cmd/.bat script command', async () => {
  const deps = makeDeps({ isCommandScript: () => true })

  assert.equal(await resolveVenvRUBIMINDCommand('/root/venv/Scripts/hermes.cmd', [], deps), null)
})

test('resolveVenvRUBIMINDCommand: returns null when the basename is not hermes/hermes.exe', async () => {
  const deps = makeDeps()

  assert.equal(await resolveVenvRUBIMINDCommand('/root/venv/Scripts/python.exe', [], deps), null)
})

test('resolveVenvRUBIMINDCommand: returns null when the parent dir is not Scripts', async () => {
  const deps = makeDeps()

  assert.equal(await resolveVenvRUBIMINDCommand('/root/venv/bin/hermes.exe', [], deps), null)
})

test('resolveVenvRUBIMINDCommand: returns null when the venv python does not exist on disk', async () => {
  const deps = makeDeps({ fileExists: () => false })

  assert.equal(await resolveVenvRUBIMINDCommand('/root/venv/Scripts/hermes.exe', [], deps), null)
})

test('resolveVenvRUBIMINDCommand: probes the venv python before trusting it (returns null on failed probe)', async () => {
  let probed = false

  const deps = makeDeps({
    canImportRUBIMINDCli: async (python: string) => {
      probed = true
      assert.equal(python, '/root/venv/Scripts/python.exe')

      return false
    }
  })

  const result = await resolveVenvRUBIMINDCommand('/root/venv/Scripts/hermes.exe', ['serve'], deps)

  assert.equal(probed, true, 'must probe the venv interpreter; a broken venv must not be re-selected forever')
  assert.equal(result, null, 'a failed probe must fall through (return null) so the resolver reaches bootstrap')
})

test('resolveVenvRUBIMINDCommand: returns the resolved python backend descriptor when the probe passes', async () => {
  const deps = makeDeps()
  const result = await resolveVenvRUBIMINDCommand('/root/venv/Scripts/hermes.exe', ['serve', '--port', '0'], deps)

  assert.ok(result, 'a passing probe must return a backend descriptor, not null')
  assert.equal(result.command, '/root/venv/Scripts/python.exe')
  assert.deepEqual(result.args, ['-m', 'rubimind_cli.main', 'serve', '--port', '0'])
  assert.equal(result.bootstrap, false)
  assert.equal(result.kind, 'python')
  assert.equal(result.shell, false)
  assert.deepEqual(result.env, { FAKE_ENV: '1' })
})

test('resolveVenvRUBIMINDCommand: is case-insensitive on hermes.exe and the Scripts dir name', async () => {
  const deps = makeDeps()

  assert.ok(await resolveVenvRUBIMINDCommand('/root/venv/Scripts/HERMES.EXE', [], deps))
  assert.ok(await resolveVenvRUBIMINDCommand('/root/venv/SCRIPTS/hermes.exe', [], deps))
})
