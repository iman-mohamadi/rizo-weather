<script setup lang="ts">
import type { DailyWeather } from '~/types/weather'

const props = withDefaults(defineProps<{
  daily: DailyWeather
  days?: number
}>(), {
  days: 10
})

interface DayRow {
  index: number
  time: string
  code: number
  min: number
  max: number
  precipProb: number
  precipSum: number
}

const rows = computed<DayRow[]>(() => {
  const n = Math.min(props.days, props.daily.time.length)
  const out: DayRow[] = []
  for (let i = 0; i < n; i++) {
    out.push({
      index: i,
      time: props.daily.time[i]!,
      code: props.daily.weather_code[i]!,
      min: props.daily.temperature_2m_min[i]!,
      max: props.daily.temperature_2m_max[i]!,
      precipProb: props.daily.precipitation_probability_max[i] ?? 0,
      precipSum: props.daily.precipitation_sum[i] ?? 0
    })
  }
  return out
})

const bounds = computed(() => {
  const mins = rows.value.map(r => r.min)
  const maxs = rows.value.map(r => r.max)
  const lo = Math.min(...mins)
  const hi = Math.max(...maxs)
  return { lo, hi, span: Math.max(hi - lo, 1) }
})

function barStyle(row: DayRow) {
  const { lo, span } = bounds.value
  const left = ((row.min - lo) / span) * 100
  const width = ((row.max - row.min) / span) * 100
  return { left: `${left}%`, width: `${Math.max(width, 4)}%` }
}

// Open-Meteo's daily series always starts on the location's current day, so the
// first row is "Today" — deterministic across SSR/client (no `new Date()`).
function dayLabel(iso: string, index: number): string {
  return index === 0 ? 'Today' : formatWeekday(iso, { short: true })
}
</script>

<template>
  <ul class="divide-y divide-default">
    <li
      v-for="row in rows"
      :key="row.index"
      class="grid grid-cols-[3.5rem_2rem_auto_1fr_auto] sm:grid-cols-[5rem_2.5rem_4rem_1fr_auto] items-center gap-2 sm:gap-4 py-3"
    >
      <span class="font-medium text-sm">{{ dayLabel(row.time, row.index) }}</span>

      <WeatherIcon
        :code="row.code"
        :is-day="true"
        size="size-6 text-primary"
      />

      <span
        class="flex items-center gap-1 text-xs"
        :class="row.precipProb > 0 ? 'text-info' : 'text-transparent'"
      >
        <UIcon
          name="i-lucide-droplet"
          class="size-3"
        />
        {{ row.precipProb }}%
      </span>

      <div class="flex items-center gap-3">
        <span class="text-sm text-muted w-8 text-right tabular-nums">{{ round(row.min) }}°</span>
        <div class="relative h-1.5 flex-1 rounded-full bg-elevated">
          <div
            class="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
            :style="barStyle(row)"
          />
        </div>
        <span class="text-sm font-semibold w-8 tabular-nums">{{ round(row.max) }}°</span>
      </div>

      <span class="text-xs text-muted hidden sm:block w-14 text-right">{{ describeWeather(row.code, true).label }}</span>
    </li>
  </ul>
</template>
