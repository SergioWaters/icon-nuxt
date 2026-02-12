export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  nuxtSvgToIcon: {
    iconsDir: 'assets/icons',
    asyncComponent: true,
  },
})
