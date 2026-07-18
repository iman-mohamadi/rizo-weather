import { getQuery } from 'h3'

const CURRENT = [
  'european_aqi', 'us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide',
  'nitrogen_dioxide', 'sulphur_dioxide', 'ozone',
  'alder_pollen', 'birch_pollen', 'grass_pollen',
  'mugwort_pollen', 'olive_pollen', 'ragweed_pollen', 'uv_index'
]

const HOURLY = ['european_aqi', 'us_aqi', 'pm2_5', 'pm10', 'ozone']

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const { lat, lon } = requireCoords(query)

  return await fetchOpenMeteo('https://air-quality-api.open-meteo.com/v1/air-quality', {
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
    forecast_days: 4,
    current: CURRENT.join(','),
    hourly: HOURLY.join(',')
  })
}, {
  maxAge: 60 * 30, // 30 minutes
  swr: true,
  getKey: event => `aqi:${new URL(event.node.req.url!, 'http://x').search}`
})
