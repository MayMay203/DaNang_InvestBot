<script setup lang="ts">
const { locale } = useTranslation()
const isReady = ref(false)

onMounted(() => {
  const codeLang = localStorage.getItem('lang') || 'vi'
  locale.value = codeLang
  isReady.value = true
})
</script>

<template>
  <div class="flex w-full h-[100vh] justify-center items-center" v-if="!isReady">Loading...</div>
  <div v-else>
    <NuxtLayout>
      <Toast/>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>