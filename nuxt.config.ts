import tailwindcss from "@tailwindcss/vite";
import Nova from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: ["primeicons/primeicons.css", "@/assets/css/global.css"],
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/variables/variables.scss" as *;',
        },
      },
    },
  },
  modules: ["@nuxtjs/i18n", "@pinia/nuxt", "@primevue/nuxt-module"],
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "vi", language: "vi-VN", file: "vi.json" },
    ],
    defaultLocale: "vi",
    lazy: true,
    langDir: "locales",
    strategy: "no_prefix",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BASE_URL,
    },
  },
  primevue: {
    options: {
      theme: {
        preset: Nova,
      },
    },
  },
});
