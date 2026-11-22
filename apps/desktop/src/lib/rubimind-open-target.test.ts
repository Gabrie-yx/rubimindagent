import { describe, expect, it } from 'vitest'

import {
  normalizeRUBIMINDOpenString,
  pathFromRUBIMINDDeepLink,
  pathFromOpenDeepLink,
  resolveRUBIMINDOpenPath
} from './hermes-open-target'

describe('normalizeRUBIMINDOpenString', () => {
  it('accepts hash-router paths and strips a leading hash', () => {
    expect(normalizeRUBIMINDOpenString('/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeRUBIMINDOpenString('#/index-network/intent/1')).toBe('/index-network/intent/1')
  })

  it('maps plugin-scoped hermes:// deep links to the same path', () => {
    expect(normalizeRUBIMINDOpenString('hermes://index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeRUBIMINDOpenString('hermes://index-network/intent/1?focus=true')).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('maps hermes://open/… deep links by stripping the open host', () => {
    expect(normalizeRUBIMINDOpenString('hermes://open/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeRUBIMINDOpenString('hermes://open/settings/plugins')).toBe('/settings/plugins')
  })

  it('rejects reserved hermes kinds and unsafe paths', () => {
    expect(normalizeRUBIMINDOpenString('hermes://blueprint/morning-brief')).toBeNull()
    expect(normalizeRUBIMINDOpenString('hermes://plugin/install')).toBeNull()
    expect(normalizeRUBIMINDOpenString('https://example.com/x')).toBeNull()
    expect(normalizeRUBIMINDOpenString('/../etc/passwd')).toBeNull()
    expect(normalizeRUBIMINDOpenString('index-network')).toBeNull()
  })
})

describe('resolveRUBIMINDOpenPath', () => {
  it('merges structured path + params', () => {
    expect(resolveRUBIMINDOpenPath({ path: '/index-network/intent/1', params: { focus: 'true' } })).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('resolves href the same as a bare string', () => {
    expect(resolveRUBIMINDOpenPath({ href: 'hermes://index-network/intent/1' })).toBe('/index-network/intent/1')
  })
})

describe('pathFromRUBIMINDDeepLink', () => {
  it('builds the navigate path from a plugin-scoped deep-link payload', () => {
    expect(pathFromRUBIMINDDeepLink('index-network', 'intent/1')).toBe('/index-network/intent/1')
  })

  it('builds the navigate path from hermes://open/… payloads', () => {
    expect(pathFromOpenDeepLink('index-network/intent/1')).toBe('/index-network/intent/1')
    expect(pathFromRUBIMINDDeepLink('open', 'agent/42')).toBe('/agent/42')
  })

  it('ignores reserved kinds', () => {
    expect(pathFromRUBIMINDDeepLink('blueprint', 'morning-brief')).toBeNull()
    expect(pathFromRUBIMINDDeepLink('plugin', 'install')).toBeNull()
  })
})
