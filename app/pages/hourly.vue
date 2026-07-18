<script setup lang="ts">
const { location } = useLocation()
const { data, status, error } = useWeather()
const { tempUnit, windUnit } = useUnits()

const hasData = computed(() => !!data.value?.hourly)
const pending = computed(() => status.value === 'pending')

interface HourRow {
  time: string
  code: number
  isDay: boolean
  temp: number
  apparent: number
  precip: number
  wind: number
  windDir: number
  humidity: number
  uv: number
  newDay: boolean
}

const rows = computed<HourRow[]>(() => {
  if (!data.value) return []
  const h = data.value.hourly
  const key = data.value.current.time.slice(0, 13)
  let start = h.time.findIndex(t => t.slice(0, 13) === key)
  if (start < 0) start = 0
  const end = Math.min(start + 48, h.time.length)

  const out: HourRow[] = []
  let lastDay = ''
  for (let i = start; i < end; i++) {
    const day = h.time[i]!.slice(0, 10)
    out.push({
      time: h.time[i]!,
      code: h.weather_code[i]!,
      isDay: h.is_day[i] === 1,
      temp: h.temperature_2m[i]!,
      apparent: h.apparent_temperature[i]!,
      precip: h.precipitation_probability[i] ?? 0,
      wind: h.wind_speed_10m[i]!,
      windDir: h.wind_direction_10m[i]!,
      humidity: h.relative_humidity_2m[i]!,
      uv: h.uv_index[i] ?? 0,
      newDay: day !== lastDay
    })
    lastDay = day
  }
  return out
})

useSeoMeta({
  title: () => (location.value ? `Hourly forecast · ${location.value.name}` : 'Hourly forecast'),
  description: () => (location.value
    ? `Hour-by-hour weather for ${location.value.name} over the next 48 hours: temperature, precipitation chance, wind and conditions.`
    : 'Hour-by-hour weather for the next 48 hours: temperature, precipitation chance, wind and conditions.')
})

defineOgImageComponent('Weather', {
  title: 'Hourly forecast',
  description: '48-hour temperature, precipitation and wind'
})
</script>

<template>
  <UContainer class="py-6">
    <h1 class="text-2xl font-bold mb-4">
      Hourly forecast
    </h1>

    <DataState
      :pending="pending"
      :error="error"
      :has-data="hasData"
    >
      <div
        v-if="data"
        class="space-y-6"
      >
        <UCard>
          <HourlyForecast
            :hourly="data.hourly"
            :current-time="data.current.time"
            :hours="48"
          />
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <div class="divide-y divide-default">
            <template
              v-for="(row, i) in rows"
              :key="row.time"
            >
              <div
                v-if="row.newDay"
                class="px-4 py-2 bg-elevated text-sm font-semibold sticky top-0"
              >
                {{ i === 0 ? 'Today' : formatWeekday(row.time) }} · {{ formatDayMonth(row.time) }}
              </div>
              <div class="grid grid-cols-[3.5rem_2rem_1fr_auto_auto] sm:grid-cols-[4rem_2.5rem_1fr_6rem_7rem] items-center gap-3 px-4 py-2.5">
                <span class="text-sm text-muted">{{ formatHourShort(row.time) }}</span>
                <WeatherIcon
                  :code="row.code"
                  :is-day="row.isDay"
                  size="size-5 text-primary"
                />
                <span class="text-sm truncate hidden sm:block">{{ describeWeather(row.code, row.isDay).label }}</span>
                <span class="text-base font-semibold text-right">{{ round(row.temp) }}{{ tempUnit }}</span>
                <span class="flex items-center justify-end gap-3 text-xs text-muted">
                  <span
                    class="flex items-center gap-1"
                    :class="row.precip > 0 ? 'text-info' : ''"
                  >
                    <UIcon
                      name="i-lucide-droplet"
                      class="size-3"
                    />{{ row.precip }}%
                  </span>
                  <span class="hidden sm:flex items-center gap-1">
                    <UIcon
                      name="i-lucide-wind"
                      class="size-3"
                    />{{ round(row.wind) }} {{ windUnit }}
                  </span>
                </span>
              </div>
            </template>
          </div>
        </UCard>
      </div>
    </DataState>
  </UContainer>
</template>
