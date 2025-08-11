export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],
  // Configuration for Nuxt I18nm Micro
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix',
    vueI18n: './i18n.config.ts'
  },
  
  // Configuration CSS
  css: [
    '~/assets/main.scss'
  ]
})