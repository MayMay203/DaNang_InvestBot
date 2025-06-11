<template>
  <div class="h-[calc(100vh_-_50px)] flex items-center justify-center bg-white text-gray-500">
    <ChatBotDialog
      :account-id="userStore.id"
      v-model:visible="isVisibleChatbot"
    />

    <Transition name="fade" mode="out-in">
      <div
        v-if="!isVisibleChatbot"
        class="flex flex-col items-center text-center space-y-4 animate-fade-in"
      >
        <i class="pi pi-comments text-[#065076]" style="font-size: 30px;" />
        <div class="text-xl font-semibold">{{ }}</div>
        <p class="text-sm text-gray-400 max-w-sm">
          {{ t('conversation.conversation_message') }}
        </p>
        <button
          @click="isVisibleChatbot = true"
          class="mt-2 px-6 py-2 rounded-full bg-[#065076] text-white font-medium hover:bg-[#054566] transition-all shadow-md cursor-pointer"
        >
         {{ t('conversation.reopen_conversation') }}
        </button>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import ChatBotDialog from '~/components/components/ChatBotDialog.vue'

definePageMeta({ layout: 'admin' })

const isVisibleChatbot = ref(true)
const userStore = useUserStore()
const {t} = useTranslation()
</script>
