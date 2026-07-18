<script setup lang="ts">
import { VisAxis, VisCrosshair, VisLine, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { HistoricalResponse } from '~/types/weather'

const props = defineProps<{
  historical: HistoricalResponse
}>()

const { tempUnit, precipUnit } = useUnits()

interface Point {
  x: number
  date: string
  tmax: number
  tmin: number
  tmean: number
  precip: number
}

const points = computed<Point[]>(() => {
  const d = props.historical.daily
  return d.time.map((t, i) => ({
    x: i,
    date: t,
    tmax: d.temperature_2m_max[i]!,
    tmin: d.temperature_2m_min[i]!,
    tmean: d.temperature_2m_mean[i]!,
    precip: d.precipitation_sum[i] ?? 0
  }))
})

const x = (d: Point) => d.x
const yMax = (d: Point) => d.tmax
const yMin = (d: Point) => d.tmin
const yPrecip = (d: Point) => d.precip

const xTickFormat = (v: number) => {
  const p = points.value[Math.round(v)]
  return p ? formatDayMonth(p.date) : ''
}

const tempTooltip = (d: Point) =>
  `<div style="text-align:center">
     <div style="font-weight:600">${formatDayMonth(d.date)}</div>
     <div>High ${round(d.tmax)}${tempUnit.value} · Low ${round(d.tmin)}${tempUnit.value}</div>
   </div>`

const precipTooltip = (d: Point) =>
  `<div style="text-align:center">
     <div style="font-weight:600">${formatDayMonth(d.date)}</div>
     <div>${round(d.precip, 1)} ${precipUnit.value}</div>
   </div>`
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-medium text-muted mb-2">
        Temperature (high / low)
      </h3>
      <ClientOnly>
        <VisXYContainer
          :data="points"
          :height="240"
        >
          <VisLine
            :x="x"
            :y="[yMax, yMin]"
            :color="['#f97316', '#0ea5e9']"
            :line-width="2"
          />
          <VisAxis
            type="x"
            :tick-format="xTickFormat"
            :num-ticks="8"
            :grid-line="false"
          />
          <VisAxis
            type="y"
            :tick-format="(v: number) => `${Math.round(v)}°`"
            :num-ticks="5"
          />
          <VisCrosshair
            :template="tempTooltip"
            color="#f97316"
          />
          <VisTooltip />
        </VisXYContainer>
        <template #fallback>
          <div class="animate-pulse rounded-xl bg-elevated h-[240px]" />
        </template>
      </ClientOnly>
    </div>

    <div>
      <h3 class="text-sm font-medium text-muted mb-2">
        Precipitation
      </h3>
      <ClientOnly>
        <VisXYContainer
          :data="points"
          :height="180"
        >
          <VisStackedBar
            :x="x"
            :y="yPrecip"
            color="#0ea5e9"
            :bar-padding="0.2"
            :rounded-corners="2"
          />
          <VisAxis
            type="x"
            :tick-format="xTickFormat"
            :num-ticks="8"
            :grid-line="false"
          />
          <VisAxis
            type="y"
            :num-ticks="4"
          />
          <VisCrosshair
            :template="precipTooltip"
            color="#0ea5e9"
          />
          <VisTooltip />
        </VisXYContainer>
        <template #fallback>
          <div class="animate-pulse rounded-xl bg-elevated h-[180px]" />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
