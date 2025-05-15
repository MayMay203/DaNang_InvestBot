<script setup>
const router = useRouter()

onMounted(() => {
  router.push('/login')
})
</script>

<template>
  <!-- Optional fallback -->
  <div>Redirecting to login...</div>
</template>
