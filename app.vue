<script setup>
import { ref, onMounted } from 'vue'

const isLocaleReady = ref(false)
const layoutName = computed(() => route.meta.layout || 'user-layout')
const route = useRoute()

onMounted(() => {
  isLocaleReady.value = true
})

</script>

<template>
  <div>
    <NuxtLayout v-if="isLocaleReady" :key="layoutName">
      <Toast/>
      <NuxtLoadingIndicator />
      <ConfirmDialog></ConfirmDialog>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
