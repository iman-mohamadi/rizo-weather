<script setup lang="ts">
// Rendered by nuxt-og-image (Satori). Keep layout to flexbox + inline styles.
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Rizo Weather',
  description: 'Free, ad-free weather forecasts, air quality & radar'
})
</script>

<template>
  <div
    style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:70px; color:#ffffff; font-family:'Rubik', sans-serif; background-image:linear-gradient(150deg, #38bdf8 0%, #0369a1 55%, #0c2a4d 100%);"
  >
    <!-- Brand row -->
    <div style="display:flex; align-items:center;">
      <div style="display:flex; align-items:center; justify-content:center; width:96px; height:96px; border-radius:24px; background:rgba(255,255,255,0.15);">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24"
            cy="25"
            r="9"
            fill="#fbbf24"
          />
          <circle
            cx="26"
            cy="41"
            r="10"
            fill="#ffffff"
          />
          <circle
            cx="39"
            cy="36"
            r="12"
            fill="#ffffff"
          />
          <circle
            cx="47"
            cy="42"
            r="9"
            fill="#ffffff"
          />
          <rect
            x="24"
            y="43"
            width="26"
            height="10"
            rx="5"
            fill="#ffffff"
          />
        </svg>
      </div>
      <div style="display:flex; font-size:40px; font-weight:600; margin-left:28px; letter-spacing:-1px;">
        Rizo Weather
      </div>
    </div>

    <!-- Headline -->
    <div style="display:flex; flex-direction:column;">
      <div style="display:flex; font-size:82px; font-weight:700; line-height:1.05; letter-spacing:-2px; max-width:960px;">
        {{ title }}
      </div>
      <div style="display:flex; font-size:38px; margin-top:24px; color:rgba(255,255,255,0.85); max-width:900px;">
        {{ description }}
      </div>
    </div>

    <!-- Footer chips -->
    <div style="display:flex; align-items:center; font-size:28px; color:rgba(255,255,255,0.9);">
      <div style="display:flex; padding:10px 22px; border-radius:999px; background:rgba(255,255,255,0.16); margin-right:16px;">
        Hourly · 10-day
      </div>
      <div style="display:flex; padding:10px 22px; border-radius:999px; background:rgba(255,255,255,0.16); margin-right:16px;">
        Air quality
      </div>
      <div style="display:flex; padding:10px 22px; border-radius:999px; background:rgba(255,255,255,0.16);">
        Radar
      </div>
    </div>
  </div>
</template>
