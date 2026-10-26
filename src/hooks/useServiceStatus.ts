import { useEffect, useState } from 'react'
import { getServiceStatus, type ServiceStatus } from '../api/serviceStatus'

export const STATUS_TIMEOUT_MS = 5_000
type Availability = 'loading' | ServiceStatus

export function useServiceStatus() {
  const [availability, setAvailability] = useState<Availability>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = window.setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS)

    async function checkStatus() {
      try {
        const status = await getServiceStatus(controller.signal)
        if (active) setAvailability(status)
      } catch {
        if (active) setAvailability('unavailable')
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void checkStatus()
    return () => {
      // Ignore a late response from an old request, even if cancellation races with it.
      active = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setAvailability('loading')
    setAttempt((previous) => previous + 1)
  }

  return { availability, retry }
}
