// Response shapes for the Open-Meteo endpoints proxied by server/api/*.

export interface CurrentWeather {
  time: string
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  is_day: number
  precipitation: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  visibility: number
  dew_point_2m: number
  uv_index: number
}

export interface HourlyWeather {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  wind_direction_10m: number[]
  relative_humidity_2m: number[]
  uv_index: number[]
  is_day: number[]
  visibility: number[]
}

export interface DailyWeather {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  sunrise: string[]
  sunset: string[]
  daylight_duration: number[]
  uv_index_max: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  wind_gusts_10m_max: number[]
  wind_direction_10m_dominant: number[]
}

export interface WeatherResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
  elevation: number
  current_units: Record<string, string>
  current: CurrentWeather
  hourly_units: Record<string, string>
  hourly: HourlyWeather
  daily_units: Record<string, string>
  daily: DailyWeather
}

export interface AirQualityResponse {
  current_units: Record<string, string>
  current: { time: string } & Record<string, number | null>
  hourly_units: Record<string, string>
  hourly: { time: string[] } & Record<string, Array<number | null>>
}

export interface HistoricalResponse {
  daily_units: Record<string, string>
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    temperature_2m_mean: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
  }
}

export interface GeoResult {
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
