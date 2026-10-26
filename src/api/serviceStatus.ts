export type ServiceStatus = 'ready' | 'unavailable'

// Network and JSON errors are handled by the caller, alongside request cancellation.
export async function getServiceStatus(signal: AbortSignal): Promise<ServiceStatus> {
  const response = await fetch('/api/status', {
    signal,
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  const data: unknown = await response.json()
  const ready = response.status === 200 && typeof data === 'object' && data !== null
    && 'service' in data && data.service === 'quoriva-api'
    && 'status' in data && data.status === 'ready'

  return ready ? 'ready' : 'unavailable'
}
