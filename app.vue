<script setup lang="ts">
</script>
<template>
  <div>
    <NuxtLayout :key="$route.path">
      <Toast/>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>