import { getQuery } from 'h3'

const DAILY = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
  'precipitation_sum', 'wind_speed_10m_max'
]

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const { lat, lon } = requireCoords(query)
  const units = String(query.units ?? 'metric')
  const start = String(query.start ?? '')
  const end = String(query.end ?? '')

  return await fetchOpenMeteo('https://archive-api.open-meteo.com/v1/archive', {
    latitude: lat,
    longitude: lon,
    start_date: start,
    end_date: end,
    timezone: 'auto',
    daily: DAILY.join(','),
    ...unitParams(units)
  })
}, {
  maxAge: 60 * 60 * 6, // 6 hours
  swr: true,
  getKey: event => `hist:${new URL(event.node.req.url!, 'http://x').search}`
})
