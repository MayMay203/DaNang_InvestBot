<script setup>
import Header from "~/components/layout/Header.vue";
import Sidebar from "~/components/layout/Sidebar.vue";
import { ROUTES } from "~/constants/routes";

const contentSlot = ref(null)
const mainContent = ref(null)
const sidebarWidth = ref('')
const router = useRouter()

const handleChangeWidth = (value) => {
  sidebarWidth.value = value
  if (contentSlot.value && mainContent.value) {
    contentSlot.value.style.maxWidth = `calc(100vw - ${value})`
    mainContent.value.style.marginLeft = value
  }
}
</script>

<template>
  <div class="flex">
    <Sidebar @width-change="handleChangeWidth"/>
    <div class="flex-1" ref="mainContent">
      <Header :sidebarWidth="sidebarWidth"/>
      <div ref="contentSlot" class="mt-[50px]" :class="{ 'p-[30px]': !router.currentRoute.value.path.includes(ROUTES.CHAT_BOT)}"><slot></slot></div>
    </div>
  </div>
</template>
