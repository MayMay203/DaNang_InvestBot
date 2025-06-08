<script setup lang="ts">
</script>
<template>
  <div>
    <NuxtLayout :key="$route.path">
      <Toast/>
      <NuxtLoadingIndicator />
      <ConfirmDialog></ConfirmDialog>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>