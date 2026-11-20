// Requests go through the Vite /api proxy during development.
// In production, serve /api from the same origin with a reverse proxy.
export type SensorStatus = {
  contact: boolean
  button_b: boolean
  count: number
  recording: boolean
  connected: boolean
  uptime_ms: number
}

function isSensorStatus(value: unknown): value is SensorStatus {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return typeof item.contact === 'boolean'
    && typeof item.button_b === 'boolean'
    && typeof item.count === 'number'
    && Number.isSafeInteger(item.count)
    && item.count >= 0
    && typeof item.recording === 'boolean'
    && typeof item.connected === 'boolean'
    && typeof item.uptime_ms === 'number'
}

async function fetchStatus(url: string, method: 'GET' | 'POST'): Promise<SensorStatus> {
  const response = await fetch(url, { method, cache: 'no-store', signal: AbortSignal.timeout(2500) })
  if (!response.ok) throw new Error(`Sensor API error: ${response.status}`)
  const data: unknown = await response.json()
  if (!isSensorStatus(data)) throw new Error('Invalid sensor response')
  return data
}

export const getSensorStatus = () => fetchStatus('/api/status', 'GET')
export const resetSensorCount = () => fetchStatus('/api/reset', 'POST')
