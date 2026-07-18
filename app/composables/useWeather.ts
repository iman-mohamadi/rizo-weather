import type { AirQualityResponse, HistoricalResponse, WeatherResponse } from '~/types/weather'

export function useWeather() {
  const { location } = useLocation()
  const { units } = useUnits()

  return useFetch<WeatherResponse>('/api/weather', {
    key: 'weather',
    query: computed(() => ({
      lat: location.value?.lat,
      lon: location.value?.lon,
      units: units.value
    })),
    immediate: !!location.value,
    dedupe: 'defer'
  })
}

export function useAirQuality() {
  const { location } = useLocation()

  return useFetch<AirQualityResponse>('/api/air-quality', {
    key: 'air-quality',
    query: computed(() => ({
      lat: location.value?.lat,
      lon: location.value?.lon
    })),
    immediate: !!location.value,
    dedupe: 'defer'
  })
}

export function useHistorical(start: Ref<string>, end: Ref<string>) {
  const { location } = useLocation()
  const { units } = useUnits()

  return useFetch<HistoricalResponse>('/api/historical', {
    key: 'historical',
    query: computed(() => ({
      lat: location.value?.lat,
      lon: location.value?.lon,
      units: units.value,
      start: start.value,
      end: end.value
    })),
    immediate: false,
    watch: false,
    dedupe: 'defer'
  })
}
