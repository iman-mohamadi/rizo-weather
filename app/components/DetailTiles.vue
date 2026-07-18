<script setup lang="ts">
import type { CurrentWeather, DailyWeather } from '~/types/weather'

const props = defineProps<{
  current: CurrentWeather
  daily: DailyWeather
}>()

const { tempUnit, windUnit, precipUnit, formatVisibility } = useUnits()

const uv = computed(() => getUvBand(props.daily.uv_index_max?.[0] ?? props.current.uv_index))
const windDir = computed(() => windCompass(props.current.wind_direction_10m))
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <DetailTile
      icon="i-lucide-thermometer"
      label="Feels like"
      :value="round(current.apparent_temperature) ?? '--'"
      :unit="tempUnit"
      :sub="`Actual ${round(current.temperature_2m)}${tempUnit}`"
    />

    <DetailTile
      icon="i-lucide-wind"
      label="Wind"
      :value="round(current.wind_speed_10m) ?? '--'"
      :unit="windUnit"
    >
      <span class="flex items-center gap-1">
        <UIcon
          name="i-lucide-navigation"
          class="size-3"
          :style="{ transform: `rotate(${current.wind_direction_10m + 180}deg)` }"
        />
        {{ windDir }} · gusts {{ round(current.wind_gusts_10m) }} {{ windUnit }}
      </span>
    </DetailTile>

    <DetailTile
      icon="i-lucide-droplets"
      label="Humidity"
      :value="current.relative_humidity_2m"
      unit="%"
      :sub="`Dew point ${round(current.dew_point_2m)}${tempUnit}`"
    />

    <DetailTile
      icon="i-lucide-sun"
      label="UV index"
      :value="round(daily.uv_index_max?.[0] ?? current.uv_index) ?? '--'"
    >
      <span
        class="inline-flex items-center gap-1.5"
        :style="{ color: uv.color }"
      >
        <span
          class="size-2 rounded-full"
          :style="{ backgroundColor: uv.color }"
        />
        {{ uv.category }}
      </span>
    </DetailTile>

    <DetailTile
      icon="i-lucide-gauge"
      label="Pressure"
      :value="round(current.pressure_msl) ?? '--'"
      unit="hPa"
    />

    <DetailTile
      icon="i-lucide-eye"
      label="Visibility"
      :value="formatVisibility(current.visibility)"
    />

    <DetailTile
      icon="i-lucide-cloud"
      label="Cloud cover"
      :value="current.cloud_cover"
      unit="%"
    />

    <DetailTile
      icon="i-lucide-umbrella"
      label="Precipitation"
      :value="round(daily.precipitation_sum?.[0], 1) ?? 0"
      :unit="precipUnit"
      :sub="`${daily.precipitation_probability_max?.[0] ?? 0}% chance today`"
    />
  </div>
</template>
