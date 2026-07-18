<script setup lang="ts">
const { resolveFromQuery, initLocation } = useLocation()

// Resolve a ?lat&lon link synchronously (same on server + client), then fall back
// to stored/geolocated location after mount to avoid hydration mismatches.
resolveFromQuery()
onMounted(initLocation)

const title = 'Rizo Weather'
const description = 'Free, ad-free weather — current conditions, hourly and 10-day forecasts, air quality, radar maps and historical trends, powered by Open-Meteo.'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#0ea5e9' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  title,
  titleTemplate: t => (t && t !== title ? `${t} · ${title}` : title),
  description,
  ogTitle: title,
  ogDescription: description,
  ogSiteName: title,
  twitterCard: 'summary_large_image'
})

// Structured data for GEO/AEO — tells answer & generative engines this is a
// free weather web app. WebSite/WebPage/Organization are added by @nuxtjs/seo.
useSchemaOrg([
  defineSoftwareApp({
    name: title,
    description,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    featureList: [
      'Current conditions',
      'Hourly forecast',
      '10-day forecast',
      'Air quality index',
      'Precipitation radar',
      'Historical weather'
    ]
  })
])

// Site-wide default social share image (per-route title overrides in pages).
defineOgImageComponent('Weather', { title, description })
</script>

<template>
  <UApp>
    <UHeader
      :ui="{ center: 'hidden lg:flex' }"
      title="Rizo Weather"
    >
      <template #title>
        <span class="flex items-center gap-2 font-bold text-lg">
          <UIcon
            name="i-lucide-cloud-sun"
            class="size-7 text-primary"
          />
          Rizo Weather
        </span>
      </template>

      <AppNav />

      <template #right>
        <LocationSearch />
        <UnitToggle />
        <UColorModeButton />
      </template>

      <template #body>
        <AppNav orientation="vertical" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Weather data by
          <ULink
            to="https://open-meteo.com/"
            target="_blank"
            class="text-primary"
          >Open-Meteo</ULink>
          · Radar by
          <ULink
            to="https://www.rainviewer.com/"
            target="_blank"
            class="text-primary"
          >RainViewer</ULink>
        </p>
      </template>

      <template #right>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Rizo Weather
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
