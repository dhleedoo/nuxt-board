// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  components: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  
  // SSR 관련 설정
  ssr: true,
  
  // Vite 설정 - Leaflet을 서버 사이드에서 제외
  vite: {
    ssr: {
      noExternal: []
    },
    optimizeDeps: {
      include: ['leaflet']
    }
  },
  
  // Nitro 설정
  nitro: {
    esbuild: {
      options: {
        target: 'node18'
      }
    }
  }
})
