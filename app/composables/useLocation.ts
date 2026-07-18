export interface WeatherLocation {
  name: string
  admin1?: string
  country?: string
  countryCode?: string
  lat: number
  lon: number
  timezone?: string
}

export const TEHRAN: WeatherLocation = {
  name: 'Tehran',
  admin1: 'Tehran',
  country: 'Iran',
  countryCode: 'IR',
  lat: 35.6892,
  lon: 51.389,
  timezone: 'Asia/Tehran'
}

const STORAGE_KEY = 'rizo-weather:location'

export function useLocation() {
  const state = useState<WeatherLocation | null>('location', () => null)
  const locating = useState<boolean>('location-locating', () => false)
  const route = useRoute()
  const router = useRouter()

  function setLocation(loc: WeatherLocation, opts: { updateUrl?: boolean } = {}) {
    state.value = loc
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
      } catch { /* private mode */ }
      if (opts.updateUrl !== false) {
        router.replace({
          query: {
            ...route.query,
            lat: String(loc.lat),
            lon: String(loc.lon),
            name: loc.name
          }
        })
      }
    }
  }

  function fromQuery(): WeatherLocation | null {
    const lat = Number(route.query.lat)
    const lon = Number(route.query.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
    return {
      name: String(route.query.name ?? 'Selected location'),
      admin1: route.query.admin1 ? String(route.query.admin1) : undefined,
      country: route.query.country ? String(route.query.country) : undefined,
      lat,
      lon
    }
  }

  function fromStorage(): WeatherLocation | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as WeatherLocation : null
    } catch {
      return null
    }
  }

  async function reverseGeocode(lat: number, lon: number): Promise<WeatherLocation> {
    try {
      const data = await $fetch<{
        city?: string
        locality?: string
        principalSubdivision?: string
        countryName?: string
        countryCode?: string
      }>('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        query: { latitude: lat, longitude: lon, localityLanguage: 'en' }
      })
      return {
        name: data.city || data.locality || 'Current location',
        admin1: data.principalSubdivision,
        country: data.countryName,
        countryCode: data.countryCode,
        lat,
        lon
      }
    } catch {
      return { name: 'Current location', lat, lon }
    }
  }

  function requestGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!import.meta.client || !navigator.geolocation) {
        reject(new Error('Geolocation unavailable'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 8000,
        maximumAge: 1000 * 60 * 30
      })
    })
  }

  async function useMyLocation() {
    locating.value = true
    try {
      const pos = await requestGeolocation()
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      setLocation(loc)
    } catch {
      if (!state.value) setLocation(TEHRAN)
    } finally {
      locating.value = false
    }
  }

  // Runs during setup on both server and client. The URL query is identical on
  // both sides, so resolving it here keeps SSR and hydration in sync (needed for
  // shareable ?lat&lon links). Returns true if a location was resolved.
  function resolveFromQuery(): boolean {
    if (state.value) return true
    const queried = fromQuery()
    if (queried) {
      setLocation(queried, { updateUrl: false })
      return true
    }
    return false
  }

  // Client-only, must run after mount: localStorage -> geolocation -> Tehran.
  // Kept out of setup so the first client render matches the server (no location),
  // avoiding hydration mismatches.
  async function initLocation() {
    if (state.value || !import.meta.client) return

    const stored = fromStorage()
    if (stored) {
      setLocation(stored)
      return
    }

    locating.value = true
    try {
      const pos = await requestGeolocation()
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      setLocation(loc)
    } catch {
      setLocation(TEHRAN)
    } finally {
      locating.value = false
    }
  }

  return { location: state, locating, setLocation, useMyLocation, resolveFromQuery, initLocation }
}
