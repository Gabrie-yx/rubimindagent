// The RUBIMIND home the desktop main process runs against, resolved once at boot.
// Resolving it here also registers it with the file-preview read guard, so the
// home's (and every profile's) credential stores are refused before any IPC
// read can be served.

import { resolveDesktopRUBIMINDHome } from './data-paths'
import { directoryExists } from './fs-probes'
import { setSensitiveRUBIMINDHome } from './hardening'
import { readWindowsUserEnvVar } from './windows-user-env'

export function resolveMainRUBIMINDHome(home: string): string {
  const hermesHome = resolveDesktopRUBIMINDHome({
    home,
    directoryExists,
    readWindowsHome: (): string | null => readWindowsUserEnvVar('RUBIMIND_HOME')
  })

  setSensitiveRUBIMINDHome(hermesHome)

  return hermesHome
}
