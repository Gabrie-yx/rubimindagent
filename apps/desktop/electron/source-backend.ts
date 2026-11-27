import { existsSync } from 'node:fs'
import path from 'node:path'

import { buildDesktopBackendEnv } from './backend-env'
import { execProbe, PROBE_TIMEOUT_MS } from './backend-probes'
import { resolveInstallationLauncher } from './updater-process'

export interface SourceBackend {
  kind: 'command' | 'python'
  label: string
  command: string
  args: string[]
  env: NodeJS.ProcessEnv
  root: string
  bootstrap: false
  shell: boolean
  local: 'installed'
}

interface SourceOptions {
  isWindows?: boolean
  env?: NodeJS.ProcessEnv
}

/** Keep the validated command. PM owns interpreter and generation selection. */
export async function resolveSourceInstallationBackend(
  root: string,
  args: string[],
  options: SourceOptions & { hermesHome?: string; log?: (msg: string) => void } = {}
): Promise<SourceBackend | null> {
  if (!existsSync(path.join(root, 'hermes_cli', 'main.py'))) {
    return null
  }

  const isWindows: boolean = options.isWindows ?? process.platform === 'win32'
  const launcher: string | null = resolveInstallationLauncher(root, isWindows, options.hermesHome)

  if (!launcher) {
    options.log?.(`[bootstrap] resolveSourceInstallationBackend: no launcher found for ${root}`)
    return null
  }

  const candidates: string[] = [launcher]
  if (isWindows && /\.exe$/i.test(launcher)) {
    const cmdFallback = launcher.replace(/\.exe$/i, '.cmd')
    if (existsSync(cmdFallback)) {
      candidates.push(cmdFallback)
    }
  }

  const env: NodeJS.ProcessEnv = buildDesktopBackendEnv({ currentEnv: options.env ?? process.env })

  for (const candidate of candidates) {
    const shell: boolean = isWindows && /\.(cmd|bat)$/i.test(candidate)
    const command: string = shell ? `"${candidate}"` : candidate

    try {
      await execProbe(command, ['--version'], {
        cwd: root,
        env: { ...process.env, ...options.env, ...env },
        shell,
        stdio: 'ignore',
        timeout: PROBE_TIMEOUT_MS,
        windowsHide: true
      })

      return {
        kind: 'command',
        label: `RUBIMIND at ${root}`,
        command,
        args: [...args],
        env,
        root,
        bootstrap: false,
        shell,
        local: 'installed'
      }
    } catch (err: any) {
      options.log?.(
        `[bootstrap] resolveSourceInstallationBackend: probe failed for ${candidate} (${err?.message || err})`
      )
    }
  }

  return null
}

/** Developer overrides retain their interpreter, even outside the checkout. */
export function createSourcePythonBackend(
  root: string,
  python: string | null,
  args: string[],
  options: SourceOptions = {}
): SourceBackend | null {
  if (!python) {
    return null
  }

  let command: string = python

  if ((options.isWindows ?? process.platform === 'win32') && /[\\/]pythonw\.exe$/i.test(python)) {
    // Use only the console interpreter beside the selected windowless one.
    const consolePython: string = python.replace(/pythonw\.exe$/i, 'python.exe')

    if (existsSync(consolePython)) {
      command = consolePython
    }
  }

  return {
    kind: 'python',
    label: `RUBIMIND source at ${root}`,
    command,
    args: ['-m', 'hermes_cli.main', ...args],
    // The backend runs in the user's workspace cwd, and the selected
    // interpreter need not have this checkout installed: name it explicitly.
    // (The scrubbed inherited value could point at another checkout.)
    env: { ...buildDesktopBackendEnv({ currentEnv: options.env ?? process.env }), PYTHONPATH: root },
    root,
    bootstrap: false,
    shell: false,
    local: 'installed'
  }
}

/** Launch a PM-managed source checkout directly via its store Python (bypassing distlib .exe). */
export function createStorePythonBackend(
  root: string,
  storePython: string,
  args: string[],
  options: SourceOptions = {}
): SourceBackend {
  const bootstrapCode = [
    'import os, sys, runpy',
    "os.environ.pop('PYTHONHOME', None)",
    "os.environ.pop('PYTHONPATH', None)",
    "os.environ.pop('VIRTUAL_ENV', None)",
    `sys.path.insert(0, ${JSON.stringify(root)})`,
    'import hermes_bootstrap',
    "runpy.run_module('hermes_cli.main', run_name='__main__', alter_sys=True)"
  ].join('; ')

  return {
    kind: 'python',
    label: `RUBIMIND store Python at ${root}`,
    command: storePython,
    args: ['-I', '-c', bootstrapCode, ...args],
    env: buildDesktopBackendEnv({ currentEnv: options.env ?? process.env }),
    root,
    bootstrap: false,
    shell: false,
    local: 'installed'
  }
}
