<script setup>
import { ref, onMounted } from 'vue'

const isLocaleReady = ref(false)

onMounted(() => {
  isLocaleReady.value = true
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
