<script setup lang="ts">
import type { GeoResult } from '~/types/weather'

const { location, setLocation, useMyLocation, locating } = useLocation()

const open = ref(false)
const term = ref('')
const debounced = ref('')
const results = ref<GeoResult[]>([])
const loading = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
let requestId = 0

watch(term, (value) => {
  clearTimeout(timer)
  const q = value.trim()
  debounced.value = q
  if (q.length < 2) {
    results.value = []
    loading.value = false
    return
  }
  timer = setTimeout(async () => {
    const id = ++requestId
    loading.value = true
    try {
      const data = await $fetch<{ results: GeoResult[] }>('/api/geocoding', { query: { q } })
      if (id === requestId) results.value = data.results ?? []
    } catch {
      if (id === requestId) results.value = []
    } finally {
      if (id === requestId) loading.value = false
    }
  }, 250)
})

function subtitle(r: GeoResult): string {
  return [r.admin1, r.country].filter(Boolean).join(', ')
}

function pick(r: GeoResult) {
  setLocation({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone
  })
  open.value = false
  term.value = ''
  debounced.value = ''
}

async function locateMe() {
  await useMyLocation()
  open.value = false
}

const buttonLabel = computed(() => location.value?.name ?? 'Search city')
</script>

<template>
  <div>
    <UButton
      icon="i-lucide-search"
      color="neutral"
      variant="outline"
      :label="buttonLabel"
      @click="open = true"
    />

    <UModal
      v-model:open="open"
      title="Search location"
      description="Find any city worldwide"
    >
      <template #body>
        <UInput
          v-model="term"
          placeholder="Search for a city…"
          icon="i-lucide-search"
          size="lg"
          autofocus
          class="w-full"
          :loading="loading"
        />

        <UButton
          block
          color="neutral"
          variant="soft"
          icon="i-lucide-locate-fixed"
          label="Use my current location"
          :loading="locating"
          class="mt-3"
          @click="locateMe"
        />

        <div class="mt-3 min-h-24">
          <p
            v-if="debounced.length < 2"
            class="text-sm text-muted text-center py-6"
          >
            Type at least 2 characters to search.
          </p>
          <p
            v-else-if="!loading && results.length === 0"
            class="text-sm text-muted text-center py-6"
          >
            No matches for "{{ debounced }}".
          </p>
          <ul
            v-else
            class="divide-y divide-default"
          >
            <li
              v-for="r in results"
              :key="r.id"
            >
              <button
                type="button"
                class="w-full flex items-center gap-3 py-2.5 px-2 rounded-md hover:bg-elevated transition-colors text-left"
                @click="pick(r)"
              >
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-4 text-muted shrink-0"
                />
                <span class="flex-1 min-w-0">
                  <span class="block font-medium truncate">{{ r.name }}</span>
                  <span class="block text-xs text-muted truncate">{{ subtitle(r) }}</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </template>
    </UModal>
  </div>
</template>
