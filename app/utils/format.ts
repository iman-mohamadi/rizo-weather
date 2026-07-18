// Formatting helpers. Times are rendered in the target location's timezone
// (Open-Meteo returns local ISO strings without an offset, so we treat them
// as wall-clock time and format the clock portion directly).

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

export function windCompass(degrees: number | null | undefined): string {
  if (degrees == null) return '--'
  return COMPASS[Math.round(degrees / 22.5) % 16]!
}

/** Parse an Open-Meteo local ISO time ("2026-07-18T14:00") into a Date whose
 *  wall-clock fields already reflect the target timezone. */
export function parseLocalIso(iso: string): Date {
  return new Date(iso)
}

export function formatHour(iso: string, hour12 = false): string {
  const d = parseLocalIso(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12 })
}

export function formatHourShort(iso: string): string {
  const d = parseLocalIso(iso)
  const h = d.getHours()
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12} ${period}`
}

export function formatWeekday(iso: string, opts: { short?: boolean } = {}): string {
  const d = parseLocalIso(iso)
  return d.toLocaleDateString('en-US', { weekday: opts.short ? 'short' : 'long' })
}

export function formatDayMonth(iso: string): string {
  const d = parseLocalIso(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatClock(iso: string): string {
  const d = parseLocalIso(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function isSameLocalDay(iso: string, ref: Date): boolean {
  const d = parseLocalIso(iso)
  return d.getFullYear() === ref.getFullYear()
    && d.getMonth() === ref.getMonth()
    && d.getDate() === ref.getDate()
}

export function round(n: number | null | undefined, digits = 0): number | null {
  if (n == null || Number.isNaN(n)) return null
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/** Format a duration given in seconds as "12h 34m". */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return '--'
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return `${h}h ${m}m`
}
