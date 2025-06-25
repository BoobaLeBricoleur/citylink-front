export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

  plugins: [
    '~/plugins/fontawesome.ts'
  ],
  // Configuration for Nuxt I18nm Micro
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
    // translationDir: 'locales',
    // meta: true,
  },
  
  // Configuration CSS
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/main.scss'
  ],
})