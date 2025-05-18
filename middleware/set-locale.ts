export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp();
  const i18n = nuxtApp.$i18n;

  if (i18n) {
    const lang = localStorage.getItem("lang") || "vi";
    i18n.locale.value = lang;
  } else {
    console.warn("[set-locale.global.ts] i18n chưa được khởi tạo");
  }
});
