<script setup lang="ts">
const { location } = useLocation()
const { tempUnit, precipUnit } = useUnits()

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10)
}

const start = ref('')
const end = ref('')
const activeRange = ref(30)

const ranges = [
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: '1 year', days: 365 }
]

function setRange(days: number) {
  activeRange.value = days
  // Archive data lags a few days; end the window ~6 days ago to stay in range.
  const e = new Date()
  e.setDate(e.getDate() - 6)
  const s = new Date(e)
  s.setDate(s.getDate() - days)
  end.value = fmt(e)
  start.value = fmt(s)
}

const { data, status, error, refresh } = useHistorical(start, end)

const hasData = computed(() => !!data.value?.daily?.time?.length)
const pending = computed(() => status.value === 'pending')

const summary = computed(() => {
  if (!data.value) return null
  const d = data.value.daily
  const maxs = d.temperature_2m_max.filter(v => v != null)
  const mins = d.temperature_2m_min.filter(v => v != null)
  const precip = d.precipitation_sum.reduce((a, b) => a + (b ?? 0), 0)
  return {
    warmest: Math.max(...maxs),
    coldest: Math.min(...mins),
    avg: maxs.reduce((a, b) => a + b, 0) / (maxs.length || 1),
    totalPrecip: precip
  }
})

onMounted(() => setRange(30))

watch([() => location.value, start, end], () => {
  if (location.value && start.value && end.value) refresh()
}, { immediate: true })

useSeoMeta({
  title: () => (location.value ? `Historical weather · ${location.value.name}` : 'Historical weather'),
  description: () => (location.value
    ? `Historical weather trends for ${location.value.name}: temperature and precipitation over the last 30, 90 or 365 days.`
    : 'Historical weather trends: temperature and precipitation over the last 30, 90 or 365 days.')
})

defineOgImageComponent('Weather', {
  title: 'Historical weather',
  description: 'Temperature & precipitation trends'
})
</script>

<template>
  <UContainer class="py-6">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h1 class="text-2xl font-bold">
        Historical weather
      </h1>
      <div class="flex gap-1 rounded-full bg-elevated p-0.5">
        <button
          v-for="r in ranges"
          :key="r.days"
          type="button"
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          :class="activeRange === r.days ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
          @click="setRange(r.days)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <DataState
      :pending="pending"
      :error="error"
      :has-data="hasData"
    >
      <div
        v-if="data"
        class="space-y-6"
      >
        <div
          v-if="summary"
          class="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <DetailTile
            icon="i-lucide-thermometer-sun"
            label="Warmest"
            :value="round(summary.warmest) ?? '--'"
            :unit="tempUnit"
          />
          <DetailTile
            icon="i-lucide-thermometer-snowflake"
            label="Coldest"
            :value="round(summary.coldest) ?? '--'"
            :unit="tempUnit"
          />
          <DetailTile
            icon="i-lucide-thermometer"
            label="Average high"
            :value="round(summary.avg) ?? '--'"
            :unit="tempUnit"
          />
          <DetailTile
            icon="i-lucide-umbrella"
            label="Total precip"
            :value="round(summary.totalPrecip, 1) ?? '--'"
            :unit="precipUnit"
          />
        </div>

        <UCard>
          <TrendChart :historical="data" />
        </UCard>
      </div>
    </DataState>
  </UContainer>
</template>
