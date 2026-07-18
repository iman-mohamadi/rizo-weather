<script setup lang="ts">
const { location } = useLocation()
const { data, status, error } = useAirQuality()

const hasData = computed(() => !!data.value?.current)
const pending = computed(() => status.value === 'pending')

useSeoMeta({
  title: () => (location.value ? `Air quality · ${location.value.name}` : 'Air quality'),
  description: () => (location.value
    ? `Air quality in ${location.value.name}: European and US AQI with PM2.5, PM10, ozone, NO₂, SO₂, CO levels and pollen.`
    : 'Air quality index with PM2.5, PM10, ozone, NO₂, SO₂ and CO pollutant levels and pollen.')
})

defineOgImageComponent('Weather', {
  title: 'Air quality',
  description: 'AQI, pollutants (PM2.5, PM10, O₃, NO₂…) and pollen'
})
</script>

<template>
  <UContainer class="py-6">
    <h1 class="text-2xl font-bold mb-4">
      Air quality
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
        <AirQualityCard
          :current="data.current"
          detailed
        />

        <PollenCard :current="data.current" />

        <p class="text-xs text-muted">
          European AQI and pollen data are provided by the Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo.
        </p>
      </div>
    </DataState>
  </UContainer>
</template>
