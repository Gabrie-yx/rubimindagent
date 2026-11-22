export function platformDefaultRUBIMINDHome(
  home: string,
  env?: NodeJS.ProcessEnv,
  platform?: NodeJS.Platform,
): string

export function platformDefaultHermesHome(
  home: string,
  env?: NodeJS.ProcessEnv,
  platform?: NodeJS.Platform,
): string

export function resolveDesktopUserData(defaultPath: string, env?: NodeJS.ProcessEnv): string

export interface RUBIMINDHomeOptions {
  home: string
  env?: NodeJS.ProcessEnv
  platform?: NodeJS.Platform
  directoryExists?: (directory: string) => boolean
  readWindowsHome?: () => string | null
}

export type HermesHomeOptions = RUBIMINDHomeOptions

export function resolveDesktopRUBIMINDHome(options: RUBIMINDHomeOptions): string
export function resolveDesktopHermesHome(options: HermesHomeOptions): string
