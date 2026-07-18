<script setup lang="ts">
import type { CurrentWeather, DailyWeather } from '~/types/weather'
import type { WeatherLocation } from '~/composables/useLocation'

const props = defineProps<{
  current: CurrentWeather
  daily: DailyWeather
  location: WeatherLocation | null
}>()

const { tempUnit, windUnit } = useUnits()

const isDay = computed(() => props.current.is_day === 1)
const descriptor = computed(() => describeWeather(props.current.weather_code, isDay.value))

const gradient = computed(() => {
  const stops = TONE_GRADIENTS[descriptor.value.tone][isDay.value ? 'day' : 'night']
  return `linear-gradient(160deg, ${stops[0]} 0%, ${stops[1]} 100%)`
})

const locationLabel = computed(() => {
  const l = props.location
  if (!l) return ''
  return [l.name, l.admin1, l.country].filter(Boolean).slice(0, 2).join(', ')
})

const updatedAt = computed(() => formatClock(props.current.time))

// Greeting derived from the location's local hour (deterministic across SSR/client).
const greeting = computed(() => {
  const hour = Number(props.current.time.slice(11, 13))
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl text-white shadow-lg"
    :style="{ backgroundImage: gradient }"
  >
    <div class="absolute inset-0 bg-black/10" />

    <div class="relative p-6 sm:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-hand text-2xl sm:text-3xl text-white/90 leading-none mb-1.5">
            {{ greeting }}
          </p>
          <h1 class="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <UIcon
              name="i-lucide-map-pin"
              class="size-5"
            />
            {{ locationLabel }}
          </h1>
          <p class="text-sm text-white/80 mt-1">
            Updated {{ updatedAt }}
          </p>
        </div>
        <WeatherIcon
          :code="current.weather_code"
          :is-day="current.is_day"
          size="size-16 sm:size-20 drop-shadow"
        />
      </div>

      <div class="mt-6 flex items-end gap-4">
        <span class="text-7xl sm:text-8xl font-bold leading-none tracking-tighter">
          {{ round(current.temperature_2m) }}<span class="text-4xl align-top">{{ tempUnit }}</span>
        </span>
        <div class="pb-2">
          <p class="text-xl font-medium">
            {{ descriptor.label }}
          </p>
          <p class="text-white/80">
            Feels like {{ round(current.apparent_temperature) }}{{ tempUnit }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-arrow-up"
            class="size-4"
          />
          High {{ round(daily.temperature_2m_max?.[0]) }}{{ tempUnit }}
        </span>
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-arrow-down"
            class="size-4"
          />
          Low {{ round(daily.temperature_2m_min?.[0]) }}{{ tempUnit }}
        </span>
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-droplets"
            class="size-4"
          />
          {{ current.relative_humidity_2m }}%
        </span>
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-wind"
            class="size-4"
          />
          {{ round(current.wind_speed_10m) }} {{ windUnit }} {{ windCompass(current.wind_direction_10m) }}
        </span>
      </div>
    </div>
  </div>
</template>
