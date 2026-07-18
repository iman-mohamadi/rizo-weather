import { getQuery } from 'h3'

interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
  timezone?: string
  population?: number
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q ?? '').trim()
  if (q.length < 2) return { results: [] as GeoResult[] }

  const data = await fetchOpenMeteo<{ results?: GeoResult[] }>(
    'https://geocoding-api.open-meteo.com/v1/search',
    { name: q, count: 8, language: 'en', format: 'json' }
  )
  return { results: data.results ?? [] }
}, {
  maxAge: 60 * 60 * 24, // 1 day
  swr: true,
  getKey: event => `geo:${String(getQuery(event).q ?? '').toLowerCase()}`
})
