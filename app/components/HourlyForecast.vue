<script setup lang="ts">
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { HourlyWeather } from '~/types/weather'

const props = withDefaults(defineProps<{
  hourly: HourlyWeather
  currentTime: string
  hours?: number
  compact?: boolean
}>(), {
  hours: 24,
  compact: false
})

const { tempUnit } = useUnits()

interface HourPoint {
  x: number
  temp: number
  apparent: number
  time: string
  code: number
  precip: number
  isDay: boolean
}

const points = computed<HourPoint[]>(() => {
  const times = props.hourly.time
  const key = props.currentTime.slice(0, 13)
  let start = times.findIndex(t => t.slice(0, 13) === key)
  if (start < 0) start = 0
  const end = Math.min(start + props.hours, times.length)

  const out: HourPoint[] = []
  for (let i = start; i < end; i++) {
    out.push({
      x: i - start,
      temp: props.hourly.temperature_2m[i]!,
      apparent: props.hourly.apparent_temperature[i]!,
      time: times[i]!,
      code: props.hourly.weather_code[i]!,
      precip: props.hourly.precipitation_probability[i] ?? 0,
      isDay: props.hourly.is_day[i] === 1
    })
  }
  return out
})

const x = (d: HourPoint) => d.x
const y = (d: HourPoint) => d.temp

const xTickFormat = (value: number) => {
  const p = points.value[value]
  return p ? formatHourShort(p.time) : ''
}
const yTickFormat = (value: number) => `${Math.round(value)}°`

const tooltip = (d: HourPoint) =>
  `<div style="text-align:center">
     <div style="font-weight:600">${formatHourShort(d.time)}</div>
     <div>${describeWeather(d.code, d.isDay).label}</div>
     <div>${round(d.temp)}${tempUnit.value} · ${d.precip}% rain</div>
   </div>`

const lineColor = '#0ea5e9'
</script>

<template>
  <div>
    <ClientOnly>
      <VisXYContainer
        :data="points"
        :height="compact ? 150 : 190"
        :margin="{ left: 8, right: 8, top: 8, bottom: 8 }"
      >
        <VisArea
          :x="x"
          :y="y"
          :color="lineColor"
          :opacity="0.15"
        />
        <VisLine
          :x="x"
          :y="y"
          :color="lineColor"
          :line-width="2.5"
        />
        <VisAxis
          type="x"
          :tick-format="xTickFormat"
          :num-ticks="6"
          :grid-line="false"
          :domain-line="false"
        />
        <VisAxis
          type="y"
          :tick-format="yTickFormat"
          :num-ticks="4"
          :domain-line="false"
        />
        <VisCrosshair
          :template="tooltip"
          :color="lineColor"
        />
        <VisTooltip />
      </VisXYContainer>
      <template #fallback>
        <div
          class="animate-pulse rounded-xl bg-elevated"
          :style="{ height: compact ? '150px' : '190px' }"
        />
      </template>
    </ClientOnly>

    <UCarousel
      v-slot="{ item: p }"
      :items="points"
      arrows
      wheel-gestures
      :prev="{ size: 'sm', color: 'neutral', variant: 'ghost' }"
      :next="{ size: 'sm', color: 'neutral', variant: 'ghost' }"
      :ui="{
        root: 'flex items-center gap-1',
        viewport: 'min-w-0 flex-1 overflow-hidden',
        container: 'ms-0',
        item: 'basis-[4.5rem] snap-start select-none',
        controls: 'contents',
        arrows: 'contents',
        prev: '!static translate-none shrink-0 order-first',
        next: '!static translate-none shrink-0 order-last'
      }"
      class="mt-2"
    >
      <div class="flex flex-col items-center gap-1.5 rounded-lg px-2 py-2 select-none hover:bg-elevated transition-colors">
        <span class="text-xs text-muted whitespace-nowrap">{{ formatHourShort(p.time) }}</span>
        <WeatherIcon
          :code="p.code"
          :is-day="p.isDay"
          size="size-6 text-primary"
        />
        <span class="text-sm font-semibold">{{ round(p.temp) }}{{ tempUnit }}</span>
        <span
          class="flex items-center gap-0.5 text-xs"
          :class="p.precip > 0 ? 'text-info' : 'text-dimmed'"
        >
          <UIcon
            name="i-lucide-droplet"
            class="size-3"
          />
          {{ p.precip }}%
        </span>
      </div>
    </UCarousel>
  </div>
</template>
