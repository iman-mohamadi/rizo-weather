<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  unit?: string
  sub?: string
}>()
</script>

<template>
  <div class="rounded-xl bg-default ring-1 ring-default p-4 flex flex-col gap-2">
    <div class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
      <UIcon
        :name="icon"
        class="size-4"
      />
      {{ label }}
    </div>
    <div class="text-2xl font-semibold">
      {{ value }}<span
        v-if="unit"
        class="text-base font-normal text-muted ml-0.5"
      >{{ unit }}</span>
    </div>
    <p
      v-if="sub || $slots.default"
      class="text-xs text-muted mt-auto"
    >
      <slot>{{ sub }}</slot>
    </p>
  </div>
</template>
