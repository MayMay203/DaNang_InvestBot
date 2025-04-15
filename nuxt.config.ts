import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["@/assets/css/global.css"],
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
  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "vi", language: "vi-VN", file: "vi.json" },
    ],
    defaultLocale: "en",
    lazy: true,
    langDir: "locales",
    strategy: "no_prefix",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BASE_URL,
    },
  },
});
