export type UnitSystem = 'metric' | 'imperial'

export function useUnits() {
  // Cookie-backed so the server knows the preference and renders correct units on
  // first paint (no flash / hydration mismatch); useState gives a single reactive
  // source shared across all components.
  const cookie = useCookie<UnitSystem>('rizo-weather-units', {
    default: () => 'metric',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365
  })
  const units = useState<UnitSystem>('units', () => cookie.value)

  function setUnits(value: UnitSystem) {
    units.value = value
    cookie.value = value
  }

  function toggle() {
    setUnits(units.value === 'metric' ? 'imperial' : 'metric')
  }

  const isImperial = computed(() => units.value === 'imperial')
  const tempUnit = computed(() => (isImperial.value ? '°F' : '°C'))
  const windUnit = computed(() => (isImperial.value ? 'mph' : 'km/h'))
  const precipUnit = computed(() => (isImperial.value ? 'in' : 'mm'))
  const distanceUnit = computed(() => (isImperial.value ? 'mi' : 'km'))

  // Open-Meteo returns visibility in metres regardless of unit params.
  function formatVisibility(metres: number | null | undefined): string {
    if (metres == null) return '--'
    if (isImperial.value) return `${(metres / 1609.34).toFixed(1)} mi`
    return `${(metres / 1000).toFixed(1)} km`
  }

  return { units, isImperial, setUnits, toggle, tempUnit, windUnit, precipUnit, distanceUnit, formatVisibility }
}
