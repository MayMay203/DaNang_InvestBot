<template>
  <div
    class="w-[36px] h-[36px] flex justify-center items-center rounded-[50%] object-cover text-white bg-[#065076]"
  >
    <span class="medium">{{ name }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String
})
</script>
