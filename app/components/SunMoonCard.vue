<script setup lang="ts">
import type { DailyWeather } from '~/types/weather'

const props = defineProps<{
  daily: DailyWeather
  currentTime: string
}>()

const sunrise = computed(() => props.daily.sunrise?.[0] ?? '')
const sunset = computed(() => props.daily.sunset?.[0] ?? '')

function minutesOfDay(iso: string): number {
  const t = iso.slice(11, 16)
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

const progress = computed(() => {
  if (!sunrise.value || !sunset.value) return 0
  const rise = minutesOfDay(sunrise.value)
  const set = minutesOfDay(sunset.value)
  const now = minutesOfDay(props.currentTime)
  return Math.min(1, Math.max(0, (now - rise) / Math.max(set - rise, 1)))
})

const isDaytime = computed(() => progress.value > 0 && progress.value < 1)

const sun = computed(() => {
  const p = progress.value
  const cx = 150
  const cy = 140
  const r = 120
  const theta = Math.PI * (1 - p)
  return {
    x: cx + r * Math.cos(theta),
    y: cy - r * Math.sin(theta)
  }
})

const daylight = computed(() => formatDuration(props.daily.daylight_duration?.[0]))
// Derive the moon phase from the API's current-observation timestamp rather than
// `new Date()` so server and client render identically (no hydration mismatch).
const moon = computed(() => getMoonPhase(new Date(props.currentTime)))
</script>

<template>
  <div class="grid sm:grid-cols-2 gap-4">
    <!-- Sun arc -->
    <UCard>
      <template #header>
        <span class="flex items-center gap-2 font-medium">
          <UIcon
            name="i-lucide-sunrise"
            class="size-5 text-warning"
          />
          Sun
        </span>
      </template>

      <svg
        viewBox="0 0 300 150"
        class="w-full h-auto"
      >
        <path
          d="M 30 140 A 120 120 0 0 1 270 140"
          fill="none"
          stroke="var(--ui-border)"
          stroke-width="2"
          stroke-dasharray="4 5"
        />
        <line
          x1="20"
          y1="140"
          x2="280"
          y2="140"
          stroke="var(--ui-border)"
          stroke-width="1"
        />
        <circle
          :cx="sun.x"
          :cy="sun.y"
          r="8"
          :fill="isDaytime ? '#f59e0b' : 'var(--ui-text-dimmed)'"
        />
      </svg>

      <div class="flex justify-between text-sm mt-2">
        <div>
          <p class="text-muted text-xs">
            Sunrise
          </p>
          <p class="font-medium">
            {{ sunrise ? formatClock(sunrise) : '--' }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-muted text-xs">
            Daylight
          </p>
          <p class="font-medium">
            {{ daylight }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-muted text-xs">
            Sunset
          </p>
          <p class="font-medium">
            {{ sunset ? formatClock(sunset) : '--' }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Moon phase -->
    <UCard>
      <template #header>
        <span class="flex items-center gap-2 font-medium">
          <UIcon
            name="i-lucide-moon"
            class="size-5 text-primary"
          />
          Moon
        </span>
      </template>

      <div class="flex items-center gap-4">
        <div class="relative size-20 rounded-full bg-slate-800 overflow-hidden ring-1 ring-default shrink-0">
          <div
            class="absolute inset-0 bg-slate-200"
            :style="{ clipPath: `inset(0 ${100 - moon.illumination * 100}% 0 0)` }"
          />
        </div>
        <div>
          <p class="font-hand text-xl">
            {{ moon.label }}
          </p>
          <p class="text-sm text-muted">
            {{ Math.round(moon.illumination * 100) }}% illuminated
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
