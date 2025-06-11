<template>
  <div class="p-4 text-center text-gray-500">
    <i class="pi pi-inbox" style="font-size: 24px; margin-bottom: 0.7rem" />
    <div class="text-[15px]">{{ messageToShow }}</div>
  </div>
</template>

<script setup>
const {t} = useTranslation()
const props = defineProps({
  message: {
    type: String,
  }
})

const messageToShow = computed(() => props.message || t('common.no_data'))
</script>