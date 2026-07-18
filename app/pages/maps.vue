<script setup lang="ts">
const { location } = useLocation()

useSeoMeta({
  title: () => (location.value ? `Radar · ${location.value.name}` : 'Weather radar'),
  description: () => (location.value
    ? `Animated precipitation radar for ${location.value.name} — live rain and snow for the past two hours plus a short-term nowcast.`
    : 'Animated precipitation radar — live rain and snow for the past two hours plus a short-term nowcast.')
})

defineOgImageComponent('Weather', {
  title: 'Precipitation radar',
  description: 'Animated live rain and snow radar'
})
</script>

<template>
  <UContainer class="py-6">
    <h1 class="text-2xl font-bold mb-1">
      Precipitation radar
    </h1>
    <p class="text-muted mb-4">
      Animated rain and snow radar for the past two hours plus a short-term nowcast.
    </p>

    <div v-if="location">
      <RadarMap
        :lat="location.lat"
        :lon="location.lon"
        :name="location.name"
      />
      <p class="text-xs text-muted mt-3">
        Radar imagery © <ULink
          to="https://www.rainviewer.com/"
          target="_blank"
          class="text-primary"
        >RainViewer</ULink> · Base map © OpenStreetMap contributors.
      </p>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center py-24 text-muted gap-3"
    >
      <UIcon
        name="i-lucide-map-pin-off"
        class="size-8"
      />
      <p>Search for a city to view its radar.</p>
    </div>
  </UContainer>
</template>
