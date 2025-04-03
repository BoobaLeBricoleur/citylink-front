export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
  
  // Configuration CSS
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/main.scss'
  ],
})