// Client-side moon phase from a date. Based on the synodic-month approximation
// (mean lunation length 29.53059 days from a known new moon epoch).

export interface MoonPhase {
  /** 0..1 position through the lunation (0 = new moon) */
  phase: number
  /** 0..1 illuminated fraction of the disk */
  illumination: number
  label: string
  icon: string
}

const SYNODIC_MONTH = 29.530588853
// Known new moon: 2000-01-06 18:14 UTC
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000
  let phase = (days % SYNODIC_MONTH) / SYNODIC_MONTH
  if (phase < 0) phase += 1

  // Illuminated fraction: 0 at new, 1 at full.
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2

  const { label, icon } = describePhase(phase)
  return { phase, illumination, label, icon }
}

function describePhase(phase: number): { label: string, icon: string } {
  // 8 principal phases, each spanning 1/8 of the cycle.
  const idx = Math.round(phase * 8) % 8
  const phases: Array<{ label: string, icon: string }> = [
    { label: 'New moon', icon: 'i-lucide-circle' },
    { label: 'Waxing crescent', icon: 'i-lucide-moon' },
    { label: 'First quarter', icon: 'i-lucide-moon' },
    { label: 'Waxing gibbous', icon: 'i-lucide-moon' },
    { label: 'Full moon', icon: 'i-lucide-circle' },
    { label: 'Waning gibbous', icon: 'i-lucide-moon' },
    { label: 'Last quarter', icon: 'i-lucide-moon' },
    { label: 'Waning crescent', icon: 'i-lucide-moon' }
  ]
  return phases[idx]!
}
