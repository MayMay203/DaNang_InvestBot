// Route thay đổi thì nhận lại locale hiện tại
export default defineNuxtRouteMiddleware((to, from) => {
    const locale = useTranslation().locale
    const codeLang = localStorage.getItem('lang') || 'vi'
    locale.value = codeLang
})