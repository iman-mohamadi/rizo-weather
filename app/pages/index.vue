<script setup lang="ts">
const { location } = useLocation()
const { data, status, error } = useWeather()
const { data: aq } = useAirQuality()

const hasData = computed(() => !!data.value?.current)
const pending = computed(() => status.value === 'pending')

useSeoMeta({
  title: () => (location.value ? `Weather in ${location.value.name}` : 'Today'),
  description: () => (location.value
    ? `Current weather in ${location.value.name}: temperature, feels-like, wind, humidity, UV, sunrise/sunset, air quality plus an hourly and 10-day forecast.`
    : 'Free, ad-free weather — current conditions, hourly and 10-day forecasts, air quality, radar maps and historical trends.')
})

defineOgImageComponent('Weather', {
  title: 'Weather forecast',
  description: 'Current conditions, hourly & 10-day forecast, air quality & radar'
})
</script>

<template>
  <UContainer class="py-6">
    <DataState
      :pending="pending"
      :error="error"
      :has-data="hasData"
    >
      <div
        v-if="data"
        class="space-y-6"
      >
        <CurrentConditions
          :current="data.current"
          :daily="data.daily"
          :location="location"
        />

        <DetailTiles
          :current="data.current"
          :daily="data.daily"
        />

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 font-medium">
                <UIcon
                  name="i-lucide-clock"
                  class="size-5 text-primary"
                />
                Hourly forecast
              </span>
              <UButton
                to="/hourly"
                variant="link"
                color="primary"
                trailing-icon="i-lucide-arrow-right"
                label="48 hours"
              />
            </div>
          </template>
          <HourlyForecast
            :hourly="data.hourly"
            :current-time="data.current.time"
            :hours="24"
            compact
          />
        </UCard>

        <SunMoonCard
          :daily="data.daily"
          :current-time="data.current.time"
        />

        <div class="grid lg:grid-cols-2 gap-6">
          <AirQualityCard
            v-if="aq?.current"
            :current="aq.current"
          />

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2 font-medium">
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="size-5 text-primary"
                  />
                  10-day outlook
                </span>
                <UButton
                  to="/daily"
                  variant="link"
                  color="primary"
                  trailing-icon="i-lucide-arrow-right"
                  label="Full forecast"
                />
              </div>
            </template>
            <DailyForecast
              :daily="data.daily"
              :days="6"
            />
          </UCard>
        </div>
      </div>
    </DataState>

    <AppFaq class="mt-10" />
  </UContainer>
</template>
