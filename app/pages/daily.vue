<script setup lang="ts">
const { location } = useLocation()
const { data, status, error } = useWeather()
const { tempUnit, windUnit, precipUnit } = useUnits()

const hasData = computed(() => !!data.value?.daily)
const pending = computed(() => status.value === 'pending')

const days = computed(() => {
  if (!data.value) return []
  const d = data.value.daily
  return d.time.slice(0, 10).map((t, i) => ({
    time: t,
    label: i === 0 ? 'Today' : formatWeekday(t, { short: true }),
    date: formatDayMonth(t),
    code: d.weather_code[i]!,
    max: d.temperature_2m_max[i]!,
    min: d.temperature_2m_min[i]!,
    precipProb: d.precipitation_probability_max[i] ?? 0,
    precipSum: d.precipitation_sum[i] ?? 0,
    wind: d.wind_speed_10m_max[i]!,
    uv: d.uv_index_max[i] ?? 0,
    sunrise: d.sunrise[i]!,
    sunset: d.sunset[i]!
  }))
})

useSeoMeta({
  title: () => (location.value ? `10-day forecast · ${location.value.name}` : '10-day forecast'),
  description: () => (location.value
    ? `10-day weather forecast for ${location.value.name}: daily high and low temperatures, precipitation, wind, UV index and sunrise times.`
    : '10-day weather forecast: daily highs and lows, precipitation, wind, UV index and sunrise times.')
})

defineOgImageComponent('Weather', {
  title: '10-day forecast',
  description: 'Daily highs, lows, precipitation and UV'
})
</script>

<template>
  <UContainer class="py-6">
    <h1 class="text-2xl font-bold mb-4">
      10-day forecast
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
          <DailyForecast
            :daily="data.daily"
            :days="10"
          />
        </UCard>

        <div class="grid sm:grid-cols-2 gap-4">
          <div
            v-for="day in days"
            :key="day.time"
            class="rounded-xl bg-default ring-1 ring-default p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold">
                  {{ day.label }}
                </p>
                <p class="text-xs text-muted">
                  {{ day.date }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <WeatherIcon
                  :code="day.code"
                  :is-day="true"
                  size="size-10 text-primary"
                />
                <div class="text-right">
                  <span class="text-xl font-bold">{{ round(day.max) }}{{ tempUnit }}</span>
                  <span class="text-muted ml-1">{{ round(day.min) }}°</span>
                </div>
              </div>
            </div>
            <p class="text-sm text-muted mt-1">
              {{ describeWeather(day.code, true).label }}
            </p>

            <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-sm">
              <span class="flex items-center gap-1.5 text-muted">
                <UIcon
                  name="i-lucide-droplet"
                  class="size-4 text-info"
                />
                {{ day.precipProb }}% · {{ round(day.precipSum, 1) }} {{ precipUnit }}
              </span>
              <span class="flex items-center gap-1.5 text-muted">
                <UIcon
                  name="i-lucide-wind"
                  class="size-4"
                />
                {{ round(day.wind) }} {{ windUnit }}
              </span>
              <span class="flex items-center gap-1.5 text-muted">
                <UIcon
                  name="i-lucide-sun"
                  class="size-4 text-warning"
                />
                UV {{ round(day.uv) }}
              </span>
              <span class="flex items-center gap-1.5 text-muted">
                <UIcon
                  name="i-lucide-sunrise"
                  class="size-4"
                />
                {{ formatClock(day.sunrise) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DataState>
  </UContainer>
</template>
