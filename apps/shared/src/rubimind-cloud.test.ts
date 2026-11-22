import { describe, expect, it } from 'vitest'

import { isRUBIMINDCloudUrl } from './hermes-cloud'

describe('isRUBIMINDCloudUrl', () => {
  it('recognises production and staging agent hosts, nothing else', () => {
    expect(isRUBIMINDCloudUrl('https://ares-3009.agents.nousresearch.com')).toBe(true)
    expect(isRUBIMINDCloudUrl('https://ares--app.agents.staging-nousresearch.com/')).toBe(true)
    expect(isRUBIMINDCloudUrl('https://agents.nousresearch.com.evil.example')).toBe(false)
    expect(isRUBIMINDCloudUrl('https://my-box.tailnet.ts.net')).toBe(false)
    expect(isRUBIMINDCloudUrl('not a url')).toBe(false)
    expect(isRUBIMINDCloudUrl(undefined)).toBe(false)
  })
})
