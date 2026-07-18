import { getQuery } from 'h3'

const CURRENT = [
  'temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'is_day',
  'precipitation', 'weather_code', 'cloud_cover', 'pressure_msl',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
  'visibility', 'dew_point_2m', 'uv_index'
]

const HOURLY = [
  'temperature_2m', 'apparent_temperature', 'precipitation_probability', 'precipitation',
  'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'relative_humidity_2m',
  'uv_index', 'is_day', 'visibility'
]

const DAILY = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'apparent_temperature_max', 'apparent_temperature_min',
  'sunrise', 'sunset', 'daylight_duration', 'uv_index_max',
  'precipitation_sum', 'precipitation_probability_max',
  'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant'
]

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const { lat, lon } = requireCoords(query)
  const units = String(query.units ?? 'metric')

  return await fetchOpenMeteo('https://api.open-meteo.com/v1/forecast', {
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
    forecast_days: 16,
    current: CURRENT.join(','),
    hourly: HOURLY.join(','),
    daily: DAILY.join(','),
    ...unitParams(units)
  })
}, {
  maxAge: 60 * 10, // 10 minutes
  swr: true,
  getKey: event => `weather:${new URL(event.node.req.url!, 'http://x').search}`
})
