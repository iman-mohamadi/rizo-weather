<script setup lang="ts">
const { isImperial, setUnits } = useUnits()
</script>

<template>
  <div class="inline-flex items-center rounded-full bg-elevated p-0.5 text-sm font-medium">
    <button
      type="button"
      class="px-2.5 py-1 rounded-full transition-colors"
      :class="!isImperial ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
      @click="setUnits('metric')"
    >
      °C
    </button>
    <button
      type="button"
      class="px-2.5 py-1 rounded-full transition-colors"
      :class="isImperial ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
      @click="setUnits('imperial')"
    >
      °F
    </button>
  </div>
</template>
