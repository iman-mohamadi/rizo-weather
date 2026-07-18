<script setup lang="ts">
const props = defineProps<{
  pending: boolean
  error?: unknown
  hasData: boolean
}>()

const message = computed(() => {
  const e = props.error as { statusMessage?: string, message?: string } | undefined
  return e?.statusMessage || e?.message || 'Something went wrong while loading weather data.'
})
</script>

<template>
  <div>
    <div
      v-if="pending && !hasData"
      class="flex flex-col items-center justify-center py-24 text-muted gap-3"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin"
      />
      <p>Loading weather…</p>
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Couldn't load data"
      :description="message"
      class="my-8"
    />

    <slot v-else-if="hasData" />

    <div
      v-else
      class="flex flex-col items-center justify-center py-24 text-muted gap-3"
    >
      <UIcon
        name="i-lucide-map-pin-off"
        class="size-8"
      />
      <p class="font-hand text-xl">
        Search for a city to see the forecast.
      </p>
    </div>
  </div>
</template>
