export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image','nuxt-i18n-micro'],

  plugins: [
    '~/plugins/fontawesome.ts'
  ],
  // Configuration for Nuxt I18nm Micro
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', dir: 'ltr' },
      { code: 'fr', iso: 'fr-FR', dir: 'ltr' },
    ],
    defaultLocale: 'fr',
    translationDir: 'locales',
    meta: true,
  },
  
  // Configuration CSS
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/main.scss'
  ],
})