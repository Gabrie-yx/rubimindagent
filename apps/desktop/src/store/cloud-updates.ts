/**
 * RUBIMIND Cloud owns updates for its agents: it replaces the agent's image, so
 * no in-app updater may be offered there. Two shapes reach a Cloud agent:
 *
 * - the Webapp served BY a Cloud agent (the tab's own origin is the agent):
 *   every update target is Cloud's, because the app itself comes from it;
 * - native Desktop CONNECTED to a Cloud agent: only the backend target is;
 *   the Desktop app on this machine still updates itself.
 */

import { isRUBIMINDCloudUrl } from '@hermes/shared'
import { computed } from 'nanostores'

import type { RUBIMINDConnection } from '@/global'
import { servedByRUBIMINDCloud } from '@/lib/hermes-cloud-host'
import type { UpdateTarget } from '@/lib/update-copy'
import { $connection } from '@/store/session'

function connectedToRUBIMINDCloud(connection: RUBIMINDConnection | null): boolean {
  return connection?.mode === 'remote' && (connection.remoteKind === 'cloud' || isRUBIMINDCloudUrl(connection.baseUrl))
}

/** Whether RUBIMIND Cloud owns updates for `target` under `connection`. */
export function cloudOwnsUpdates(target: UpdateTarget, connection: RUBIMINDConnection | null = $connection.get()): boolean {
  return servedByRUBIMINDCloud() || (target === 'backend' && connectedToRUBIMINDCloud(connection))
}

/**
 * The target a generic "Update RUBIMIND" command acts on: the connected backend
 * in remote mode, unless RUBIMIND Cloud owns it — then this machine's own app.
 */
export function updateTargetFor(connection: RUBIMINDConnection | null): UpdateTarget {
  return connection?.mode === 'remote' && !cloudOwnsUpdates('backend', connection) ? 'backend' : 'client'
}

/** Per target: true while every update control for it must stay hidden. */
export const $cloudOwnsUpdates = computed($connection, connection => ({
  backend: cloudOwnsUpdates('backend', connection),
  client: cloudOwnsUpdates('client', connection)
}))
