<script setup lang="ts">
import 'primeicons/primeicons.css';
</script>

<template>
  <div>
    <NuxtLayout :key="$route.path">
      <Toast />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
