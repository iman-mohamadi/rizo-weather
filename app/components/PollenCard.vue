<script setup lang="ts">
import type { AirQualityResponse } from '~/types/weather'

const props = defineProps<{
  current: AirQualityResponse['current']
}>()

function level(value: number | null | undefined): { label: string, color: string, pct: number } {
  if (value == null) return { label: 'n/a', color: '#94a3b8', pct: 0 }
  if (value < 1) return { label: 'None', color: '#94a3b8', pct: 2 }
  if (value < 20) return { label: 'Low', color: '#22c55e', pct: 25 }
  if (value < 50) return { label: 'Moderate', color: '#eab308', pct: 50 }
  if (value < 200) return { label: 'High', color: '#f97316', pct: 75 }
  return { label: 'Very high', color: '#ef4444', pct: 100 }
}

const items = computed(() =>
  POLLEN_TYPES.map((p) => {
    const value = props.current[p.key]
    return { key: p.key, label: p.label, unit: p.unit, value, lvl: level(value) }
  })
)

const hasData = computed(() => items.value.some(i => i.value != null))
</script>

<template>
  <UCard>
    <template #header>
      <span class="flex items-center gap-2 font-medium">
        <UIcon
          name="i-lucide-flower-2"
          class="size-5 text-primary"
        />
        Pollen
      </span>
    </template>

    <p
      v-if="!hasData"
      class="text-sm text-muted py-4 text-center"
    >
      Pollen forecasts are currently available for European locations only.
    </p>

    <div
      v-else
      class="grid sm:grid-cols-2 gap-x-6 gap-y-3"
    >
      <div
        v-for="p in items"
        :key="p.key"
      >
        <div class="flex items-baseline justify-between text-sm">
          <span class="font-medium">{{ p.label }}</span>
          <span
            class="text-xs font-medium"
            :style="{ color: p.lvl.color }"
          >{{ p.lvl.label }}</span>
        </div>
        <div class="mt-1 h-1.5 rounded-full bg-elevated overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{ width: `${p.lvl.pct}%`, backgroundColor: p.lvl.color }"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
