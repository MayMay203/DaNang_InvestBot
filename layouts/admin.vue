<script setup>
import { ref } from 'vue'
import Header from "~/components/layout/Header.vue";
import Sidebar from "~/components/layout/Sidebar.vue";
import { ROUTES } from "~/constants/routes";
import { nextTick } from 'vue'

const contentSlot = ref(null)
const mainContent = ref(null)
const sidebarWidth = ref('')
const isSidebarReady = ref(false) 
const router = useRouter()

const handleChangeWidth = async (value) => {
  sidebarWidth.value = value

  await nextTick() 

  if (contentSlot.value && mainContent.value) {
    contentSlot.value.style.maxWidth = `calc(100vw - ${value})`
    mainContent.value.style.marginLeft = value
  }

  isSidebarReady.value = true
}
</script>

<template>
  <div class="flex">
    <Sidebar @width-change="handleChangeWidth"/>
    <div class="flex-1" ref="mainContent" v-show="isSidebarReady">
      <Header :sidebarWidth="sidebarWidth"/>
      <div
        ref="contentSlot" 
        class="mt-[50px]" 
        :class="{ 'p-[30px]': !router.currentRoute.value.path.includes(ROUTES.CHAT_BOT)}"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
