<div align="center">

# 🌤️ Rizo Weather

**A fast, free, ad‑free weather app** — current conditions, hourly & 10‑day forecasts, air quality, animated radar and historical trends. Inspired by MSN Weather, built entirely on **free, key‑less APIs**.

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&labelColor=020420)](https://nuxt.com)
[![Nuxt UI](https://img.shields.io/badge/Nuxt%20UI-4-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

</div>

## ✨ Features

- **Today** — current conditions with a condition‑aware gradient hero, feels‑like, and a live "good morning/afternoon/evening" greeting.
- **Detail tiles** — wind (with compass), humidity, dew point, pressure, visibility, UV index, cloud cover, precipitation.
- **Hourly** — 48‑hour interactive temperature chart plus a per‑hour breakdown.
- **10‑day** — high/low range bars and detailed daily cards.
- **Air quality** — European & US AQI gauges with a full PM2.5 / PM10 / O₃ / NO₂ / SO₂ / CO breakdown, plus pollen (where available).
- **Radar** — animated precipitation radar with play/pause and opacity controls.
- **Historical** — temperature and precipitation trends over 30 / 90 / 365 days.
- **Sun & moon** — sunrise/sunset arc, daylight length and moon phase.
- **Anywhere** — worldwide city search, "use my location", shareable `?lat&lon` URLs, °C/°F toggle (remembered), light/dark, responsive.

## 🧰 Tech stack

- [Nuxt 4](https://nuxt.com) · [Nuxt UI 4](https://ui.nuxt.com) · [Tailwind CSS 4](https://tailwindcss.com)
- [Unovis](https://unovis.dev) for charts, [Leaflet](https://leafletjs.com) for the radar map
- [Nuxt SEO](https://nuxtseo.com) — sitemap, robots, Schema.org, OG images
- Fonts: **Rubik** (UI, via `@nuxt/fonts`) and **Virgil** (handwritten accents, self‑hosted)

## 🌐 Data sources (all free, no API key)

| Feature | Provider |
| --- | --- |
| Forecast (current / hourly / 16‑day), UV, sun times | [Open‑Meteo](https://open-meteo.com) |
| Air quality & pollen (CAMS) | [Open‑Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) |
| City search / geocoding | [Open‑Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) |
| Reverse geocoding ("use my location") | [BigDataCloud](https://www.bigdatacloud.com) |
| Historical / archive | [Open‑Meteo Archive](https://open-meteo.com/en/docs/historical-weather-api) |
| Precipitation radar tiles | [RainViewer](https://www.rainviewer.com) |
| Base map tiles | [OpenStreetMap](https://www.openstreetmap.org) |

All upstream calls are proxied and cached through Nitro server routes (`server/api/*`), so the browser only ever talks to this app.

## 🚀 Getting started

Install dependencies (this repo uses **pnpm**):

```bash
pnpm install
```

Start the dev server on `http://localhost:3000`:

```bash
pnpm dev
```

Build for production and preview:

```bash
pnpm build
pnpm preview
```

Lint and type‑check:

```bash
pnpm lint
pnpm typecheck
```

## ⚙️ Configuration

Set your production URL so canonical tags, the sitemap and OG images resolve correctly:

```bash
# .env
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📁 Project structure

```
app/
  components/   # CurrentConditions, HourlyForecast, RadarMap, AirQualityCard, …
  composables/  # useLocation, useUnits, useWeather
  pages/        # index, hourly, daily, air-quality, maps, historical
  utils/        # weatherCodes, moonPhase, aqi, format
server/api/     # weather, air-quality, geocoding, historical (cached proxies)
```

## 🙏 Attribution

Weather data by [Open‑Meteo](https://open-meteo.com) (CC BY 4.0). Radar imagery © [RainViewer](https://www.rainviewer.com). Base map © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Handwritten font [Virgil](https://github.com/excalidraw/virgil) by Excalidraw (MIT).

## 📄 License

[MIT](./LICENSE) © 2026 Rizo Weather
