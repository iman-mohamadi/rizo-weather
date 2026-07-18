<script setup lang="ts">
import type { AirQualityResponse } from '~/types/weather'

const props = withDefaults(defineProps<{
  current: AirQualityResponse['current']
  detailed?: boolean
}>(), {
  detailed: false
})

const euValue = computed(() => props.current.european_aqi ?? null)
const usValue = computed(() => props.current.us_aqi ?? null)
const band = computed(() => getAqiBand(euValue.value, 'european'))
const scaleMax = aqiScaleMax('european')

const markerPct = computed(() => {
  if (euValue.value == null) return 0
  return Math.min(100, (euValue.value / scaleMax) * 100)
})

// Rough per-pollutant reference ceilings for the proportional bars.
const REF: Record<string, number> = {
  pm2_5: 75,
  pm10: 100,
  ozone: 180,
  nitrogen_dioxide: 200,
  sulphur_dioxide: 350,
  carbon_monoxide: 15000
}

const pollutants = computed(() =>
  POLLUTANTS.map((p) => {
    const value = props.current[p.key]
    return {
      ...p,
      value,
      pct: value == null ? 0 : Math.min(100, (value / (REF[p.key] ?? 100)) * 100)
    }
  })
)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2 font-medium">
          <UIcon
            name="i-lucide-wind"
            class="size-5 text-primary"
          />
          Air quality
        </span>
        <UBadge
          :style="{ backgroundColor: band.color, color: '#fff' }"
          variant="solid"
        >
          {{ band.category }}
        </UBadge>
      </div>
    </template>

    <div class="flex items-center gap-4">
      <div
        class="flex flex-col items-center justify-center size-20 rounded-full shrink-0 text-white"
        :style="{ backgroundColor: band.color }"
      >
        <span class="text-3xl font-bold leading-none">{{ euValue ?? '--' }}</span>
        <span class="text-[10px] uppercase tracking-wide opacity-90">EU AQI</span>
      </div>
      <div class="flex-1">
        <p class="text-sm">
          {{ band.advice }}
        </p>
        <div class="mt-3 relative h-2 rounded-full overflow-hidden bg-elevated">
          <div
            class="absolute inset-0"
            style="background:linear-gradient(90deg,#22c55e,#84cc16,#eab308,#f97316,#ef4444,#a21caf)"
          />
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full bg-white ring-2 ring-black/30"
            :style="{ left: `${markerPct}%` }"
          />
        </div>
        <p class="text-xs text-muted mt-1">
          US AQI {{ usValue ?? '--' }}
        </p>
      </div>
    </div>

    <div
      v-if="detailed"
      class="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3"
    >
      <div
        v-for="p in pollutants"
        :key="p.key"
      >
        <div class="flex items-baseline justify-between text-sm">
          <span class="font-medium">{{ p.label }}</span>
          <span class="text-muted">
            {{ p.value != null ? round(p.value, 1) : '--' }} {{ p.unit }}
          </span>
        </div>
        <div class="mt-1 h-1.5 rounded-full bg-elevated overflow-hidden">
          <div
            class="h-full rounded-full bg-primary"
            :style="{ width: `${p.pct}%` }"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
