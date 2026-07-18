<script setup lang="ts">
import type { Map as LeafletMap, TileLayer } from 'leaflet'

const props = defineProps<{
  lat: number
  lon: number
  name?: string
}>()

interface RadarFrame { time: number, path: string }

const mapEl = ref<HTMLDivElement | null>(null)
const map = shallowRef<LeafletMap | null>(null)
const radarLayer = shallowRef<TileLayer | null>(null)

const frames = ref<RadarFrame[]>([])
const host = ref('')
const index = ref(0)
const playing = ref(true)
const opacity = ref(0.65)
let timer: ReturnType<typeof setInterval> | undefined
let L: typeof import('leaflet')

const currentLabel = computed(() => {
  const f = frames.value[index.value]
  if (!f) return '--'
  const d = new Date(f.time * 1000)
  const now = Date.now() / 1000
  const rel = f.time <= now ? 'Observed' : 'Forecast'
  return `${rel} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
})

async function loadFrames() {
  const data = await $fetch<{
    host: string
    radar: { past: RadarFrame[], nowcast: RadarFrame[] }
  }>('https://api.rainviewer.com/public/weather-maps.json')
  host.value = data.host
  frames.value = [...(data.radar.past ?? []), ...(data.radar.nowcast ?? [])]
  index.value = Math.max(0, (data.radar.past?.length ?? 1) - 1)
}

function frameUrl(frame: RadarFrame) {
  // color scheme 2 (universal), smooth=1, snow=1
  return `${host.value}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`
}

function showFrame(i: number) {
  if (!map.value || !frames.value[i]) return
  const layer = L.tileLayer(frameUrl(frames.value[i]!), {
    opacity: opacity.value,
    zIndex: 5
  })
  layer.addTo(map.value)
  const previous = radarLayer.value
  // fade in the new layer, then drop the old one to avoid flicker
  layer.once('load', () => previous?.remove())
  window.setTimeout(() => previous?.remove(), 500)
  radarLayer.value = layer
}

function step() {
  index.value = (index.value + 1) % frames.value.length
  showFrame(index.value)
}

function play() {
  playing.value = true
  clearInterval(timer)
  timer = setInterval(step, 700)
}

function pause() {
  playing.value = false
  clearInterval(timer)
}

function togglePlay() {
  if (playing.value) pause()
  else play()
}

function onSlider(e: Event) {
  pause()
  index.value = Number((e.target as HTMLInputElement).value)
  showFrame(index.value)
}

watch(opacity, (v) => {
  radarLayer.value?.setOpacity(v)
})

watch(() => [props.lat, props.lon], ([lat, lon]) => {
  map.value?.setView([lat!, lon!], map.value.getZoom())
})

onMounted(async () => {
  L = await import('leaflet')
  if (!mapEl.value) return

  map.value = L.map(mapEl.value, { attributionControl: true }).setView([props.lat, props.lon], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 12
  }).addTo(map.value)

  L.circleMarker([props.lat, props.lon], {
    radius: 6,
    color: '#0ea5e9',
    fillColor: '#0ea5e9',
    fillOpacity: 0.9,
    weight: 2
  }).addTo(map.value)

  await loadFrames()
  showFrame(index.value)
  play()
})

onBeforeUnmount(() => {
  clearInterval(timer)
  map.value?.remove()
})
</script>

<template>
  <div class="rounded-2xl overflow-hidden ring-1 ring-default">
    <div
      ref="mapEl"
      class="h-[420px] w-full z-0"
    />

    <div class="flex flex-wrap items-center gap-3 p-3 bg-default border-t border-default">
      <UButton
        :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'"
        color="primary"
        size="sm"
        square
        @click="togglePlay"
      />
      <span class="text-sm font-medium tabular-nums w-44">{{ currentLabel }}</span>
      <input
        type="range"
        min="0"
        :max="Math.max(frames.length - 1, 0)"
        :value="index"
        class="flex-1 min-w-32 accent-primary"
        @input="onSlider"
      >
      <label class="flex items-center gap-2 text-xs text-muted">
        Opacity
        <input
          v-model.number="opacity"
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          class="w-20 accent-primary"
        >
      </label>
    </div>
  </div>
</template>
