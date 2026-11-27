import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

export interface SourcePythonOptions {
  /** Explicit developer interpreter (`HERMES_DESKTOP_PYTHON`), honoured as-is. */
  override?: string
  isWindows?: boolean
  fileExists?: (candidate: string) => boolean
}

/** A checkout's own interpreter paths, in preference order. */
function interpreterPaths(isWindows: boolean): string[] {
  return isWindows
    ? [path.join('.venv', 'Scripts', 'python.exe'), path.join('venv', 'Scripts', 'python.exe')]
    : [path.join('.venv', 'bin', 'python'), path.join('venv', 'bin', 'python')]
}

function defaultFileExists(candidate: string): boolean {
  try {
    return statSync(candidate).isFile()
  } catch {
    return false
  }
}

/**
 * The interpreter that belongs to a source checkout: an explicit override, else
 * the checkout's own virtualenv, else null.
 *
 * Never a PATH Python. A system interpreter can import a checkout while lacking
 * its selected dependencies (`updater/checkout-source.ts`), so falling back
 * silently turns "this root has no runtime" into an update probe or a backend
 * running under an interpreter nothing selected — and a failed read becomes a
 * wrong answer instead of a refusal. PM deletes the in-tree `venv`/`.venv` once
 * a generation is committed, which makes null the ordinary answer for a managed
 * install: its callers resolve the installation launcher instead
 * (`resolveSourceInstallationBackend`, `readSourceUpdate`) or refuse
 * (`preflightStateDb`), and the backend ladder moves on to its next rung.
 */
export function resolveSourcePython(
  root: string,
  { override, isWindows = process.platform === 'win32', fileExists = defaultFileExists }: SourcePythonOptions = {}
): string | null {
  if (override && fileExists(override)) {
    return override
  }

  for (const relative of interpreterPaths(isWindows)) {
    const candidate: string = path.join(root, relative)

    if (fileExists(candidate)) {
      return candidate
    }
  }

  return null
}

/**
 * Locate PM's store Python under `<hermesHome>/tools/python-*` (or `<root>/../tools/python-*`).
 * Used as a resilient fallback when the distlib launcher executable fails its probe on Windows.
 */
export function findStorePythonForHome(
  hermesHome: string,
  isWindows: boolean = process.platform === 'win32',
  fileExists: (candidate: string) => boolean = defaultFileExists
): string | null {
  const toolsDir = path.join(hermesHome, 'tools')
  let entries: string[]
  try {
    entries = readdirSync(toolsDir)
      .filter(name => name.startsWith('python-'))
      .sort()
      .reverse()
  } catch {
    return null
  }

  const rel = isWindows ? 'python.exe' : path.join('bin', 'python3')
  for (const entry of entries) {
    const candidate = path.join(toolsDir, entry, rel)
    if (fileExists(candidate)) {
      return candidate
    }
  }

  return null
}
