// data-paths.mjs — the pure path-resolution core, shared by the desktop app
// (via data-paths.ts, a typed re-export) and the CI smoke driver (which runs
// under Node's type-stripping and therefore cannot import the app's
// extensionless TypeScript directly). No Electron imports here; only node:path.
//
// data-paths.ts re-exports these names and adds the TypeScript-facing
// `RUBIMINDHomeOptions` interface. Keep the two in lockstep: every behavior in
// this file is exercised by data-paths.test.ts through the re-export.

import path from 'node:path'

/** A RUBIMIND_HOME rooted inside a `profiles/` directory names the profile's
 * parent (the home), not the profile directory itself. */
function normalizeRUBIMINDHomeRoot(hermesHome, pathModule) {
  if (!hermesHome) {
    return hermesHome
  }
  const resolved = pathModule.resolve(String(hermesHome))
  const parent = pathModule.dirname(resolved)
  if (pathModule.basename(parent).toLowerCase() === 'profiles') {
    return pathModule.dirname(parent)
  }
  return resolved
}

export function platformDefaultRUBIMINDHome(home, env = process.env, platform = process.platform) {
  const suffix = env.RUBIMIND_DATA_DIR_SUFFIX || ''
  if (platform === 'win32') {
    const base = (env.LOCALAPPDATA || '').trim() || path.win32.join(home, 'AppData', 'Local')
    return path.win32.join(base, 'rubimind') + suffix
  }
  return path.posix.join(home, '.rubimind') + suffix
}

export const platformDefaultHermesHome = platformDefaultRUBIMINDHome

export function resolveDesktopUserData(defaultPath, env = process.env) {
  return env.HERMES_DESKTOP_USER_DATA_DIR
    ? path.resolve(env.HERMES_DESKTOP_USER_DATA_DIR)
    : defaultPath + (env.RUBIMIND_DATA_DIR_SUFFIX || '')
}

export function resolveDesktopRUBIMINDHome({ home, env = process.env, platform = process.platform, directoryExists = () => false, readWindowsHome = () => null }) {
  const paths = platform === 'win32' ? path.win32 : path.posix
  if (env.RUBIMIND_HOME) {
    return normalizeRUBIMINDHomeRoot(env.RUBIMIND_HOME, paths)
  }
  // Fresh-install rehearsals must not touch the real RUBIMIND home.
  if (env.HERMES_DESKTOP_USER_DATA_DIR) {
    return paths.join(paths.resolve(env.HERMES_DESKTOP_USER_DATA_DIR), 'hermes-home')
  }
  if (platform === 'win32' && env.RUBIMIND_HOME === undefined) {
    // Explorer can miss setx changes. An explicit empty value opts out of that fallback.
    const registryHome = readWindowsHome()
    if (registryHome) {
      return normalizeRUBIMINDHomeRoot(registryHome, paths)
    }
  }
  const defaultHome = platformDefaultRUBIMINDHome(home, env, platform)
  // Keep the legacy migration for ordinary installs, not isolated suffix runs.
  if (platform === 'win32' && !env.RUBIMIND_DATA_DIR_SUFFIX) {
    const legacy = paths.join(home, '.rubimind')
    if (!directoryExists(defaultHome) && directoryExists(legacy)) {
      return legacy
    }
  }
  return defaultHome
}

export const resolveDesktopHermesHome = resolveDesktopRUBIMINDHome

