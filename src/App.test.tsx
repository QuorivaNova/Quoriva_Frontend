import { act, fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { STATUS_TIMEOUT_MS } from './hooks/useServiceStatus'

function response(status = 200, data: unknown = { service: 'quoriva-api', status: 'ready' }) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('foundation connection', () => {
  it('displays a loading state until the request finishes', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('Checking connection')
    expect(screen.getByRole('button', { name: 'Checking…' })).toBeDisabled()
  })

  it('displays confirmed API readiness', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response()))
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Connected and ready' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check again' })).toBeEnabled()
  })

  it('shows unavailability and allows a successful retry', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(503, { service: 'quoriva-api', status: 'unavailable' }))
      .mockResolvedValueOnce(response())
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Temporarily unavailable' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { name: 'Connected and ready' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not display raw network error details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('private connection detail')))
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Temporarily unavailable' })).toBeInTheDocument()
    expect(screen.queryByText(/private connection detail/)).not.toBeInTheDocument()
  })

  it('handles malformed JSON as unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json', { status: 200 })))
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Temporarily unavailable' })).toBeInTheDocument()
  })

  it('times out a stalled request', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    render(<App />)
    await act(async () => { await vi.advanceTimersByTimeAsync(STATUS_TIMEOUT_MS) })
    expect(screen.getByRole('status')).toHaveTextContent('Temporarily unavailable')
  })

  it('cancels the request when the page unmounts', () => {
    let requestSignal: AbortSignal | null | undefined
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => {
      requestSignal = options.signal
      return new Promise(() => {})
    }))
    const { unmount } = render(<App />)
    unmount()
    expect(requestSignal?.aborted).toBe(true)
  })

  it('ignores an old response after React restarts the effect', async () => {
    let finishOldRequest!: (result: Response) => void
    const oldRequest = new Promise<Response>((resolve) => { finishOldRequest = resolve })
    vi.stubGlobal('fetch', vi.fn()
      .mockReturnValueOnce(oldRequest)
      .mockResolvedValueOnce(response()))

    render(<StrictMode><App /></StrictMode>)
    expect(await screen.findByRole('heading', { name: 'Connected and ready' })).toBeInTheDocument()

    // Simulate a late response from a transport that did not honor cancellation.
    await act(async () => { finishOldRequest(response(503, { service: 'quoriva-api', status: 'unavailable' })) })
    expect(screen.getByRole('heading', { name: 'Connected and ready' })).toBeInTheDocument()
  })
})
