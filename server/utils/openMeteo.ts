import { createError } from 'h3'

// Unit parameters passed straight through to Open-Meteo.
export function unitParams(units: string) {
  const imperial = units === 'imperial'
  return {
    temperature_unit: imperial ? 'fahrenheit' : 'celsius',
    wind_speed_unit: imperial ? 'mph' : 'kmh',
    precipitation_unit: imperial ? 'inch' : 'mm'
  }
}

export function requireCoords(query: Record<string, unknown>): { lat: number, lon: number } {
  const lat = Number(query.lat)
  const lon = Number(query.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw createError({ statusCode: 400, statusMessage: 'lat and lon query params are required' })
  }
  return { lat, lon }
}

export async function fetchOpenMeteo<T>(baseUrl: string, params: Record<string, unknown>): Promise<T> {
  try {
    return await $fetch(baseUrl, { params }) as T
  } catch (err) {
    const e = err as { statusCode?: number, data?: { reason?: string } }
    throw createError({
      statusCode: e.statusCode ?? 502,
      statusMessage: e.data?.reason ?? 'Upstream weather service error'
    })
  }
}
