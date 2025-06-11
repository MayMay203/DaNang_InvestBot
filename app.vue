<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const { locale } = useTranslation()
const route = useRoute()

const isLocaleReady = ref(false)

const updateLocaleFromStorage = () => {
  const savedLang = localStorage.getItem('lang') || 'vi'
  if (locale.value !== savedLang) {
    locale.value = savedLang
  }
  isLocaleReady.value = true
}

onMounted(() => {
  updateLocaleFromStorage()
})

watch(() => route.path, () => {
  isLocaleReady.value = false
  updateLocaleFromStorage()
})
</script>

<template>
  <div>
    <NuxtLayout v-if="isLocaleReady" :key="$route.path">
      <Toast/>
      <NuxtLoadingIndicator />
      <ConfirmDialog></ConfirmDialog>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
