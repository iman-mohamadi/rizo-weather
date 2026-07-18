<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal'
})

const items: NavigationMenuItem[] = [
  { label: 'Today', icon: 'i-lucide-sun', to: '/' },
  { label: 'Hourly', icon: 'i-lucide-clock', to: '/hourly' },
  { label: '10 Day', icon: 'i-lucide-calendar-days', to: '/daily' },
  { label: 'Air Quality', icon: 'i-lucide-wind', to: '/air-quality' },
  { label: 'Maps', icon: 'i-lucide-map', to: '/maps' },
  { label: 'Historical', icon: 'i-lucide-history', to: '/historical' }
]
</script>

<template>
  <UNavigationMenu
    :items="items"
    :orientation="orientation"
    highlight
  />
</template>
