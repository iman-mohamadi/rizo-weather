// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: [
    '~/assets/css/main.css',
    'leaflet/dist/leaflet.css'
  ],

  // Canonical site identity — used by sitemap, robots, canonical tags, OG images
  // and Schema.org. Override the URL per environment with NUXT_PUBLIC_SITE_URL.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://rizo-weather.app',
    name: 'Rizo Weather',
    description: 'Free, ad-free weather — current conditions, hourly and 10-day forecasts, air quality, radar maps and historical trends, powered by Open-Meteo.',
    defaultLocale: 'en'
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Organization/site-level structured data for GEO/AEO (answer & generative engines).
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Rizo Weather',
      logo: '/icon-512.png'
    }
  }
})
