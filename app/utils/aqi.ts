// Air-quality index bands for both the European AQI and the US AQI scales
// returned by the Open-Meteo Air Quality API.

export interface AqiBand {
  category: string
  /** hex colour for gauges/badges */
  color: string
  advice: string
  /** upper bound of this band (for gauge scaling) */
  max: number
}

const EUROPEAN_BANDS: AqiBand[] = [
  { max: 20, category: 'Good', color: '#22c55e', advice: 'Air quality is ideal for outdoor activities.' },
  { max: 40, category: 'Fair', color: '#84cc16', advice: 'Air quality is acceptable for most people.' },
  { max: 60, category: 'Moderate', color: '#eab308', advice: 'Sensitive groups should limit prolonged exertion.' },
  { max: 80, category: 'Poor', color: '#f97316', advice: 'Reduce prolonged or heavy outdoor exertion.' },
  { max: 100, category: 'Very poor', color: '#ef4444', advice: 'Avoid outdoor exertion; sensitive groups stay indoors.' },
  { max: Infinity, category: 'Extremely poor', color: '#a21caf', advice: 'Health warning: avoid all outdoor activity.' }
]

const US_BANDS: AqiBand[] = [
  { max: 50, category: 'Good', color: '#22c55e', advice: 'Air quality is satisfactory with little or no risk.' },
  { max: 100, category: 'Moderate', color: '#eab308', advice: 'Unusually sensitive people should consider limiting exertion.' },
  { max: 150, category: 'Unhealthy for sensitive groups', color: '#f97316', advice: 'Sensitive groups should reduce prolonged outdoor exertion.' },
  { max: 200, category: 'Unhealthy', color: '#ef4444', advice: 'Everyone may begin to experience health effects.' },
  { max: 300, category: 'Very unhealthy', color: '#a21caf', advice: 'Health alert: everyone may experience serious effects.' },
  { max: Infinity, category: 'Hazardous', color: '#7f1d1d', advice: 'Emergency conditions; everyone should avoid outdoor exertion.' }
]

export type AqiScale = 'european' | 'us'

export function getAqiBand(value: number | null | undefined, scale: AqiScale = 'european'): AqiBand {
  const bands = scale === 'us' ? US_BANDS : EUROPEAN_BANDS
  if (value == null || Number.isNaN(value)) {
    return { max: bands[0]!.max, category: 'Unknown', color: '#94a3b8', advice: 'No data available.' }
  }
  return bands.find(b => value <= b.max) ?? bands[bands.length - 1]!
}

// The upper end of the scale used to size a linear gauge (99th-percentile cap).
export function aqiScaleMax(scale: AqiScale = 'european'): number {
  return scale === 'us' ? 300 : 100
}

export interface PollutantMeta {
  key: string
  label: string
  /** measurement unit as reported by Open-Meteo */
  unit: string
}

export const POLLUTANTS: PollutantMeta[] = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'ozone', label: 'Ozone (O₃)', unit: 'µg/m³' },
  { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'µg/m³' },
  { key: 'sulphur_dioxide', label: 'SO₂', unit: 'µg/m³' },
  { key: 'carbon_monoxide', label: 'CO', unit: 'µg/m³' }
]

export const POLLEN_TYPES: PollutantMeta[] = [
  { key: 'alder_pollen', label: 'Alder', unit: 'gr/m³' },
  { key: 'birch_pollen', label: 'Birch', unit: 'gr/m³' },
  { key: 'grass_pollen', label: 'Grass', unit: 'gr/m³' },
  { key: 'mugwort_pollen', label: 'Mugwort', unit: 'gr/m³' },
  { key: 'olive_pollen', label: 'Olive', unit: 'gr/m³' },
  { key: 'ragweed_pollen', label: 'Ragweed', unit: 'gr/m³' }
]

// UV index bands (WHO).
export function getUvBand(uv: number | null | undefined): { category: string, color: string } {
  const v = uv ?? 0
  if (v < 3) return { category: 'Low', color: '#22c55e' }
  if (v < 6) return { category: 'Moderate', color: '#eab308' }
  if (v < 8) return { category: 'High', color: '#f97316' }
  if (v < 11) return { category: 'Very high', color: '#ef4444' }
  return { category: 'Extreme', color: '#a21caf' }
}
