<script setup lang="ts">
// Visible FAQ + FAQPage structured data. Answer/generative engines (AEO/GEO)
// read the Q&A markup; the accordion presents the same content to visitors.
const faqs = [
  {
    label: 'Is Rizo Weather free to use?',
    content: 'Yes. Rizo Weather is completely free and ad-free. There is no account, sign-up or API key required — just open it and search for a city.'
  },
  {
    label: 'How accurate is the forecast?',
    content: 'Forecasts come from Open-Meteo, which blends numerical weather models from national services such as ECMWF, NOAA, DWD and Météo-France. Data is refreshed throughout the day for reliable short- and medium-range accuracy.'
  },
  {
    label: 'How often is the weather updated?',
    content: 'Current conditions update roughly every 10 minutes, hourly forecasts refresh multiple times per day, and the 10-day outlook updates as new model runs become available.'
  },
  {
    label: 'Which data sources does Rizo Weather use?',
    content: 'Forecasts, air quality and historical data come from Open-Meteo, animated precipitation radar from RainViewer, and base maps from OpenStreetMap. All sources are free and open.'
  },
  {
    label: 'Does it work anywhere in the world?',
    content: 'Yes. You can search for any city worldwide or use your device location. Times and conditions are shown in the selected location’s local timezone.'
  },
  {
    label: 'Can I check air quality and pollen?',
    content: 'Yes. Rizo Weather shows both the European and US Air Quality Index with a full pollutant breakdown (PM2.5, PM10, ozone, NO₂, SO₂, CO). Pollen forecasts are available for European locations.'
  }
]

useSchemaOrg(
  faqs.map(f => defineQuestion({ name: f.label, acceptedAnswer: f.content }))
)
</script>

<template>
  <section class="mt-4">
    <h2 class="text-xl font-semibold mb-4">
      Frequently asked questions
    </h2>
    <UAccordion :items="faqs" />
  </section>
</template>
