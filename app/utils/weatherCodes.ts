// WMO weather interpretation codes (used by Open-Meteo `weather_code`)
// mapped to a human label, a day/night Lucide icon, and a visual "tone"
// that drives the hero gradient background.

export type WeatherTone = 'clear' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm'

interface WeatherCodeEntry {
  label: string
  /** Lucide icon for daytime */
  day: string
  /** Lucide icon for night-time */
  night: string
  tone: WeatherTone
}

const WEATHER_CODES: Record<number, WeatherCodeEntry> = {
  0: { label: 'Clear sky', day: 'i-lucide-sun', night: 'i-lucide-moon', tone: 'clear' },
  1: { label: 'Mainly clear', day: 'i-lucide-sun', night: 'i-lucide-moon', tone: 'clear' },
  2: { label: 'Partly cloudy', day: 'i-lucide-cloud-sun', night: 'i-lucide-cloud-moon', tone: 'cloud' },
  3: { label: 'Overcast', day: 'i-lucide-cloudy', night: 'i-lucide-cloudy', tone: 'cloud' },
  45: { label: 'Fog', day: 'i-lucide-cloud-fog', night: 'i-lucide-cloud-fog', tone: 'fog' },
  48: { label: 'Rime fog', day: 'i-lucide-cloud-fog', night: 'i-lucide-cloud-fog', tone: 'fog' },
  51: { label: 'Light drizzle', day: 'i-lucide-cloud-drizzle', night: 'i-lucide-cloud-drizzle', tone: 'drizzle' },
  53: { label: 'Drizzle', day: 'i-lucide-cloud-drizzle', night: 'i-lucide-cloud-drizzle', tone: 'drizzle' },
  55: { label: 'Dense drizzle', day: 'i-lucide-cloud-drizzle', night: 'i-lucide-cloud-drizzle', tone: 'drizzle' },
  56: { label: 'Freezing drizzle', day: 'i-lucide-cloud-hail', night: 'i-lucide-cloud-hail', tone: 'drizzle' },
  57: { label: 'Freezing drizzle', day: 'i-lucide-cloud-hail', night: 'i-lucide-cloud-hail', tone: 'drizzle' },
  61: { label: 'Slight rain', day: 'i-lucide-cloud-sun-rain', night: 'i-lucide-cloud-moon-rain', tone: 'rain' },
  63: { label: 'Rain', day: 'i-lucide-cloud-rain', night: 'i-lucide-cloud-rain', tone: 'rain' },
  65: { label: 'Heavy rain', day: 'i-lucide-cloud-rain-wind', night: 'i-lucide-cloud-rain-wind', tone: 'rain' },
  66: { label: 'Freezing rain', day: 'i-lucide-cloud-hail', night: 'i-lucide-cloud-hail', tone: 'rain' },
  67: { label: 'Freezing rain', day: 'i-lucide-cloud-hail', night: 'i-lucide-cloud-hail', tone: 'rain' },
  71: { label: 'Slight snow', day: 'i-lucide-cloud-snow', night: 'i-lucide-cloud-snow', tone: 'snow' },
  73: { label: 'Snow', day: 'i-lucide-cloud-snow', night: 'i-lucide-cloud-snow', tone: 'snow' },
  75: { label: 'Heavy snow', day: 'i-lucide-snowflake', night: 'i-lucide-snowflake', tone: 'snow' },
  77: { label: 'Snow grains', day: 'i-lucide-cloud-snow', night: 'i-lucide-cloud-snow', tone: 'snow' },
  80: { label: 'Rain showers', day: 'i-lucide-cloud-sun-rain', night: 'i-lucide-cloud-moon-rain', tone: 'rain' },
  81: { label: 'Rain showers', day: 'i-lucide-cloud-rain', night: 'i-lucide-cloud-rain', tone: 'rain' },
  82: { label: 'Violent showers', day: 'i-lucide-cloud-rain-wind', night: 'i-lucide-cloud-rain-wind', tone: 'rain' },
  85: { label: 'Snow showers', day: 'i-lucide-cloud-snow', night: 'i-lucide-cloud-snow', tone: 'snow' },
  86: { label: 'Snow showers', day: 'i-lucide-cloud-snow', night: 'i-lucide-cloud-snow', tone: 'snow' },
  95: { label: 'Thunderstorm', day: 'i-lucide-cloud-lightning', night: 'i-lucide-cloud-lightning', tone: 'storm' },
  96: { label: 'Thunderstorm, hail', day: 'i-lucide-cloud-lightning', night: 'i-lucide-cloud-lightning', tone: 'storm' },
  99: { label: 'Thunderstorm, hail', day: 'i-lucide-cloud-lightning', night: 'i-lucide-cloud-lightning', tone: 'storm' }
}

const FALLBACK: WeatherCodeEntry = { label: 'Unknown', day: 'i-lucide-cloud', night: 'i-lucide-cloud', tone: 'cloud' }

export interface WeatherDescriptor {
  label: string
  icon: string
  tone: WeatherTone
}

export function describeWeather(code: number | null | undefined, isDay = true): WeatherDescriptor {
  const entry = (code != null && WEATHER_CODES[code]) || FALLBACK
  return {
    label: entry.label,
    icon: isDay ? entry.day : entry.night,
    tone: entry.tone
  }
}

// Gradient stops per tone, split by day/night for the hero backdrop.
export const TONE_GRADIENTS: Record<WeatherTone, { day: [string, string], night: [string, string] }> = {
  clear: { day: ['#38bdf8', '#0284c7'], night: ['#1e293b', '#0f172a'] },
  cloud: { day: ['#7dd3fc', '#475569'], night: ['#334155', '#0f172a'] },
  fog: { day: ['#cbd5e1', '#64748b'], night: ['#334155', '#1e293b'] },
  drizzle: { day: ['#60a5fa', '#475569'], night: ['#1e293b', '#0f172a'] },
  rain: { day: ['#38bdf8', '#334155'], night: ['#1e293b', '#020617'] },
  snow: { day: ['#e0f2fe', '#94a3b8'], night: ['#475569', '#1e293b'] },
  storm: { day: ['#475569', '#1e293b'], night: ['#1e1b4b', '#020617'] }
}
