import { describe, expect, it, vi } from 'vitest'
import { getServiceStatus } from './serviceStatus'

function response(status: number, data: unknown) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('service status API', () => {
  it('requests uncached JSON with the caller’s cancellation signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, { service: 'quoriva-api', status: 'ready' }))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    await expect(getServiceStatus(controller.signal)).resolves.toBe('ready')
    expect(fetchMock).toHaveBeenCalledWith('/api/status', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
  })

  it.each<[number, unknown]>([
    [503, { service: 'quoriva-api', status: 'ready' }],
    [200, null],
    [200, { status: 'ready' }],
    [200, { service: 'another-api', status: 'ready' }],
    [200, { service: 'quoriva-api', status: 'unavailable' }],
  ])('does not confirm readiness for status %i and body %j', async (status, data) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(status, data)))
    await expect(getServiceStatus(new AbortController().signal)).resolves.toBe('unavailable')
  })
})
