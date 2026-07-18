<script setup lang="ts">
const props = withDefaults(defineProps<{
  code: number | null | undefined
  isDay?: boolean | number
  size?: string
}>(), {
  isDay: true,
  size: 'size-6'
})

const descriptor = computed(() => {
  const day = typeof props.isDay === 'number' ? props.isDay === 1 : props.isDay
  return describeWeather(props.code, day)
})
</script>

<template>
  <UIcon
    :name="descriptor.icon"
    :class="size"
    :aria-label="descriptor.label"
  />
</template>
