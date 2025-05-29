export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image','nuxt-i18n-micro'],

  ssr: false,
  nitro: {
    preset: 'static',
    serveStatic: true
  },

  app: {
    baseURL: '/'
  },

  // Configuration I18n
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', dir: 'ltr' },
      { code: 'fr', iso: 'fr-FR', dir: 'ltr' },
    ],
    defaultLocale: 'fr',
    translationDir: 'locales',
    meta: true,
  },

  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/main.scss'
  ],
})