<script setup>
import BaseIcon from '~/components/base-components/BaseIcon.vue';
import EmptyState from '~/components/components/EmptyState.vue';
import { conversationService } from '~/service-api/conversationService';
import dayjs from 'dayjs'

definePageMeta({layout: 'user-layout'})

const {t} = useTranslation()
const isExpanded = ref(true) 
const groupedConversations = ref({})
const conversations = ref([])
const detailConversation = ref([])
const selectedConvers = ref()
const confirm = useConfirm()
const toast = useToast()
const userStore = useUserStore()
const selectedFiles = ref([]);
const isLoading = ref(false)
const isLoadingVoice = ref(false)
const chatContainer = ref(null);
const inputValue = ref('')
const isVisibleSearch = ref(false)
const searchResult = ref([])
const searchText = ref('')
let recognition = null
const showPreview = ref(false)
const previewFile = ref(null)
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();

const openPreview = (file) => {

  if (!file) {
    console.warn('openPreview: file is undefined or null');
    return;
  }

  if (file.url) {
    window.open(file.url, '_blank');
  } else {
    console.warn('openPreview: file has no url', file);
  }
};

const checkEmptyNewChat = async () => {
  for (const { id } of conversations.value) {
    const { data } = await conversationService.getDetailConversation(id);
    if (!data.data || data.data?.length === 0) {
      return true;
    }
  }
  return false;
};

const handleAddNewChat = async () => {
  try {
    const isEmpty = await checkEmptyNewChat()
    if (!isEmpty) {
      const {data} = await conversationService.addNewConversation(userStore.id)
      await getAllConversations()
      selectedConvers.value =  data.data.id
      await getDetailConversation(selectedConvers.value)
    }
  }
  catch (error) {
    toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: t("toast.message_error"),
        life: 3000,
  });
  }
}

const getAllConversations = async () => {
  try {
    const { data } = await conversationService.getAllConversations()
    const rawList = data.data
    conversations.value = rawList

    const tempGroup = rawList.reduce((acc, conver) => {
      const date = dayjs(conver.createdAt).startOf('day') 
      const timestamp = date.valueOf() 

      if (!acc[timestamp]) acc[timestamp] = { date, items: [] }
      acc[timestamp].items.unshift(conver)

      return acc
    }, {})

    // Sort by timestamp descending
    const sortedGrouped = Object.keys(tempGroup)
      .sort((a, b) => Number(b) - Number(a))
      .reduce((acc, timestamp) => {
        const { date, items } = tempGroup[timestamp]
        const formattedDate = date.format('DD-MM-YYYY')
        acc[formattedDate] = items
        return acc
      }, {})

    groupedConversations.value = sortedGrouped
    searchResult.value = sortedGrouped
  } catch (error) {
    console.error(error)
  }
}

const getDetailConversation = async (id, isSearch) => {
  try {
    if(selectedConvers.id !== id){
      const { data } = await conversationService.getDetailConversation(id)
      selectedConvers.value = id

      detailConversation.value = data.data.map((item) => ({
        ...item,
        files: item.materials || [], 
        materials: undefined 
      }))
    }
    if(isSearch) isVisibleSearch.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleDeleteConvers = async (id) => {
  confirm.require({
    message: t('conversation.delete_conversation'),
    header: t('toast.confirm'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('action.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('action.delete')
    },
    accept: async () => {
      try {
        await conversationService.deleteConversation(id)
        await getAllConversations();
        selectedConvers.value = conversations.value[conversations.value.length - 1]?.id;
        await getDetailConversation(selectedConvers.value)
        
        toast.add({
          severity: "success",
          summary: t("toast.success"),
          detail: t("toast.message_success"),
          life: 3000,
        });
      }
      catch (error) {
        toast.add({
          severity: "error",
          summary: t("toast.error"),
          detail: t("toast.message_error"),
          life: 3000,
        });
      }
    },
    reject: () => {
    }
  });
}

const handleSendMessage = async () => {
  try {
    isLoading.value = true
    const query = inputValue.value
    inputValue.value = ''
    const { data } = await conversationService.sendMessage({conversationId: selectedConvers.value, query})
    if (data.statusCode === 429){
      toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: data.message,
        life: 3000,
      });
      isLoading.value = false;
      return
    }
    const item = detailConversation.value[detailConversation.value.length - 1];
    item.answerContent = data.data;
    if(!selectedConvers.value) {
      await getAllConversations()
      selectedConvers.value = conversations.value[conversations.value.length - 1]?.id;
      await getDetailConversation(selectedConvers.value)
    }
    isLoading.value = false
    if(detailConversation.value.length === 1) await getAllConversations()
    inputValue.value = ''
  }
  catch (error) {
    console.error(error)
    const item = detailConversation.value[detailConversation.value.length - 1];
    item.answerContent = t('toast.message_error');
    isLoading.value = false
    toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: t("toast.message_error"),
        life: 3000,
  });
  }
}

function onFileSelect(event) {
  const files = event.files || [];

  for (const file of files) {
    const isDuplicate = selectedFiles.value.some(
      (f) => {
        return f.name === file.name && f.size === file.size && f.type === file.type;
      }
    );

    if (isDuplicate) {
      toast.add({
        severity: "warn",
        summary: t("toast.warn"),
        detail: t("toast.existed_file"),
        life: 3000,
      });
      continue;
    }

    // Maximum 100MB = 104857600 bytes -> 99MB
    if (file.size > 103809024) {
      toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: t("toast.file_too_large"), 
        life: 3000,
      });
      continue;
    }

    if (selectedFiles.value.length >= 3) {
      toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: t("toast.over_upload_file"),
        life: 3000,
      });
      return;
    }

    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      preview: null
    };

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.preview = e.target.result;
        selectedFiles.value.push(fileData);
      };
      reader.readAsDataURL(file);
    } else {
      selectedFiles.value.push(fileData);
    }
  }
}

const getFriendlyFileType = (type) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type === 'application/pdf') return 'PDF';
  if (type.includes('spreadsheet')) return 'Excel';
  if (type.includes('wordprocessingml')) return 'Word';
  return 'File';
}

const handleSendFileMessage = async() => {
  try {
    isLoading.value = true
    const formDataToSend = new FormData()
    formDataToSend.append("query", inputValue.value);
    formDataToSend.append("conversationId", selectedConvers.value);
    selectedFiles.value.forEach((item) => {
      formDataToSend.append("files", item.file);
    });
    inputValue.value = ''
    const { data } = await conversationService.sendFileMessage(formDataToSend)
    const item = detailConversation.value[detailConversation.value.length - 1];
    item.answerContent = data.data;
    if(!selectedConvers.value) {
      await getAllConversations()
      selectedConvers.value = conversations.value[conversations.value.length - 1]?.id;
      await getDetailConversation(selectedConvers.value)
    }
    isLoading.value = false
    if(detailConversation.value.length === 1) await getAllConversations()
    inputValue.value = ''
  }
  catch (error) {
    isLoading.value = false
    const item = detailConversation.value[detailConversation.value.length - 1];
    item.answerContent = t('toast.message_error');
    toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: t("toast.message_error"),
        life: 3000,
  });
  }
}

const handleSendQuery = async (event) => {
  detailConversation.value.push({
      id: Date.now(),
      questionContent: inputValue.value,
      files: selectedFiles.value.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        preview: file.preview,
        url: URL.createObjectURL(file.file),
      }))
    });

  if (selectedFiles.value.length > 0) {
    handleSendFileMessage();
  } else {
    handleSendMessage();
  }

  event.target.value = ''
  selectedFiles.value = []
  await nextTick();
    scrollToBottom();

  if(detailConversation.value.length === 1) await getAllConversations()
}

const splitAnswerContent = (content) => {
  if (!content) return {};

const [main, sourcePart] = content.split(new RegExp(`${t('common.source')}:`, 'i'));
  const sourceText = sourcePart?.trim() || null;

  // Bắt tất cả link, bỏ các ký tự dư như ) hoặc ]
  const links = sourceText
    ? Array.from(sourceText.matchAll(/https?:\/\/[^\s\])]+/g)).map((m) =>
        m[0].replace(/[\])]+$/, '') // loại bỏ ký tự dư cuối
      )
    : [];

  return {
    content: main?.trim() || '',
    source: sourceText,
    links,
  };
};

const handleSearchChat = async() => {
  const searchVal = searchText.value.trim()
  if(!searchVal){
    searchResult = [...groupedConversations.value]
    return
  }
  try {
    const { data } = await conversationService.searchChat(searchVal, userStore.id)
    const rawList = data.data

    const tempGroup = rawList.reduce((acc, conver) => {
      const date = dayjs(conver.createdAt).startOf('day') 
      const timestamp = date.valueOf() 

      if (!acc[timestamp]) acc[timestamp] = { date, items: [] }
      acc[timestamp].items.push(conver)

      return acc
    }, {})

    // Sort by timestamp descending
    const sortedGrouped = Object.keys(tempGroup)
      .sort((a, b) => Number(b) - Number(a))
      .reduce((acc, timestamp) => {
        const { date, items } = tempGroup[timestamp]
        const formattedDate = date.format('DD-MM-YYYY')
        acc[formattedDate] = items
        return acc
      }, {})
    
    searchResult.value = sortedGrouped
  }
  catch(error){
    console.error(error)
  }
}

const highlightSearch = (text) => {
 if (!searchText.value || !text) return text;

  const escaped = searchText.value?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<span class="font-bold text-black">$1</span>');
}

const handleVoice = () => {
  if (!recognition) return

  if (isLoadingVoice.value) {
    recognition.stop() 
  } else {
    recognition.start() 
  }
}

onMounted(async() => {
  await getAllConversations()
  selectedConvers.value = conversations.value[conversations.value.length - 1]?.id;
  await getDetailConversation(selectedConvers.value)

  await nextTick();
    scrollToBottom();

  if (process.client) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognition = new SpeechRecognition()
      recognition.lang = 'vi-VN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        isLoadingVoice.value = true
      }

      recognition.onresult = (event) => {
        inputValue.value = event.results[0][0].transcript
      }

      recognition.onend = () => {
        isLoadingVoice.value = false
      }

      recognition.onerror = (event) => {
        console.error('Error voice:', event.error)
      }
    } else {
      alert(t('common.voice_error'))
    }
  }
})
</script>
<template>
  <div>
    <!-- Fixed sidebar -->
    <div class="fixed z-1 flex gap-4 top-[76px] left-[16px] items-center" v-if="!isExpanded">
      <BaseIcon name="right_panel_close" size-icon="24" cursor="pointer" @click="isExpanded = !isExpanded"></BaseIcon>
      <BaseIcon name="edit_square" size-icon="22" cursor="pointer" @click="handleAddNewChat"></BaseIcon>
    </div>

    <div :class="[
      'transition-all duration-500 ease-in-out z-1',
      isExpanded ? 'w-[250px]' : 'w-0 overflow-hidden',
      'fixed px-[8px] py-[24px] bg-[#F7FAFE] h-screen'
    ]"
    v-if="isExpanded"
    >
      <div :class="['top-[16px] flex w-full pr-[36px]', 'absolute']">
        <BaseIcon name="right_panel_close" size-icon="24" cursor="pointer" @click="isExpanded = !isExpanded"></BaseIcon>
        <div class="flex gap-[10px] ml-auto">
          <BaseIcon name="search" size-icon="24" cursor="pointer" @click="isVisibleSearch = true"></BaseIcon>
          <BaseIcon name="edit_square" size-icon="22" cursor="pointer" @click="handleAddNewChat"></BaseIcon>
        </div>
      </div>
      <div class="mt-[30px] overflow-auto max-h-[80vh]">
        <div v-for="[date, conversations] in Object.entries(groupedConversations)" :key="date" class="mt-[16px]">
          <span class="text-[12px] font-medium text-[rgb(143,143,143)]">{{ date }}</span>
          <div class="flex flex-col mt-[4px]">
            <div class="flex gap-[8px] mt-[2px] items-center px-[10px] py-[8px] hover:bg-[#0d0d0d0d] cursor-pointer rounded-[8px]" :class="{'bg-[#0d0d0d0d]':selectedConvers === convers.id}" v-for="convers in conversations" :key="convers.id" @click="getDetailConversation(convers.id)">
              <span class="flex-1 text-[13px] block truncate">{{ convers.name }}</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer" @click="handleDeleteConvers(convers.id)"></BaseIcon>
            </div>
          </div>
        </div>
      </div>
     </div>
     <div ref="chatContainer" :class="['fixed pt-[30px] top-[100px] lg:top-[60px] bottom-[160px] overflow-y-auto w-full']">
        <div :class="['h-full w-[350px] md:w-[500px] lg:w-[640px] flex flex-col gap-[36px] absolute', isExpanded ? 'left-[calc(50%_+_125px)]' : 'left-[50%]',
        'transform -translate-x-1/2']">
          <div class="flex flex-col gap-[20px]" v-for="item in detailConversation" :key="item.id">
                <div class="flex flex-col gap-3">
                  <div
                    v-if="item.files && item.files.length"
                    class="flex flex-wrap gap-3 mt-3 ml-auto"
                  >
                    <div
                      v-for="(file, index) in item.files"
                      :key="index"
                      @click="openPreview(file)"
                      class="w-[170px] h-[50px] rounded-md border border-gray-300 flex items-center gap-3 px-3 py-2 cursor-pointer bg-white hover:shadow-md hover:border-blue-400 transition duration-200 overflow-hidden"
                    >
                      <template v-if="file.type?.startsWith('image/')">
                        <img
                          :src="file.preview || file.url"
                          alt="preview"
                          class="w-[40px] h-[40px] object-cover rounded-md"
                        />
                        <span class="truncate text-sm font-medium text-gray-700">
                          {{ file.name }}
                        </span>
                      </template>
                      <template v-else>
                        <div class="text-2xl">📄</div>
                        <span class="truncate text-sm font-medium text-gray-700">
                          {{ file.name }}
                        </span>
                      </template>
                    </div>

                     <!-- modal preview image -->
                    <div
                      v-if="showPreview"
                      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                      @click.self="closePreview"
                    >
                      <img
                        :src="previewFile?.preview || previewFile?.url"
                        class="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  <div class="text-right  max-w-[90%] text-[14px] ml-auto p-[10px] rounded-[12px] bg-[rgba(0,0,0,0.05)]">{{ item.questionContent }}</div>
                </div>
                <div class="text-left max-w-[90%] text-[14px]">
                    <template v-if="isLoading && !item.answerContent">
                      <Skeleton width="100%" height="1.2rem" class="mb-2" />
                      <Skeleton width="80%" height="1.2rem" />
                    </template>
                    <div
                      v-html="md.render(splitAnswerContent(item.answerContent).content || '')"
                      class="prose text-left max-w-[90%] text-[14px]"
                    ></div>
                    <div v-if="splitAnswerContent(item.answerContent).source" class="mt-1 text-gray-500 italic">
                      <template v-if="splitAnswerContent(item.answerContent).links.length">
                        <span v-for="(link, index) in splitAnswerContent(item.answerContent).links" :key="index" class="block">
                          <template v-if="splitAnswerContent(item.answerContent).links.length === 1">
                            {{ t('common.source') }}:
                          </template>
                          <template v-else>
                            {{ t('common.source') + ' ' + (index + 1) + ':' }}
                          </template>
                          <a
                            :href="link"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#1a0dab] hover:underline font-medium break-words"
                          >
                            {{ link }}
                          </a>
                        </span>
                      </template>
                      <template v-else>
                        {{ splitAnswerContent(item.answerContent).source }}
                      </template>
                    </div>
                </div>
              </div>
        </div>
      </div>
     <div :class="['fixed bottom-[25px] w-[350px] md:w-[520px] lg:w-[660px] rounded-[20px] px-[16px] py-[12px] overflow-hidden bg-white',
        isExpanded ? 'left-[calc(50%_+_125px)]' : 'left-[50%]', selectedFiles.length > 0 ? 'h-[180px]' : 'h-[130px]',
        'transform -translate-x-1/2 border-1 border-[#ccc]'
        ]">
        <div class="top-[8px] left-[8px] flex flex-wrap gap-2 max-w-full mb-2" v-if="selectedFiles.length > 0">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="relative flex gap-2 items-center w-[150px] p-[6px] rounded-md border border-gray-300 bg-white"
          >
            <div class="flex flex-col text-xs flex-1">
              <span class="font-medium truncate max-w-[130px]">{{ file.name }}</span>
              <span class="text-gray-500">{{ getFriendlyFileType(file.type) || 'Unknown type' }}</span>
            </div>
            <button
              @click="selectedFiles.splice(index, 1)"
              class="bg-black text-white text-xs rounded-full w-[16px] h-[16px] flex items-center justify-center absolute top-[-6px] right-[-6px] cursor-pointer"
            >
              X
            </button>
          </div>
      </div>
      <div class="text-area-wrap">
        <Textarea id="queryInput" v-model="inputValue" @keydown.enter.exact.prevent="handleSendQuery" cols="30" class="w-[100%] h-[68px]" :style="{ 'resize': 'none', 'overflow-y': 'auto', 'font-size': '14px' }" :placeholder="t('chatbot.placeholder_chat')"/>
        </div>
      <div class="absolute bottom-[8px] left-[16px]">
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined my-upload-button" chooseLabel=" "/>
      </div>
      <div class="flex gap-[8px] absolute bottom-[8px] right-[16px]">
       <button
          class="w-[36px] h-[36px] rounded-full bg-white flex justify-center items-center cursor-pointer border border-[rgba(0,0,0,0.4)]"
          @click="handleVoice"
        >
          <span
            v-if="isLoadingVoice"
            class="w-[12px] h-[12px] bg-red-500 rounded-full animate-ping"
          ></span>
          <i v-else class="pi pi-microphone text-[22px]"></i>
        </button>
        <button class="w-[36px] h-[36px] rounded-[50%] bg-white flex justify-center items-center cursor-pointer border-1 border-[rgba(0,0,0,0.4)]" :disabled="!inputValue.length" @click="handleSendQuery">
          <BaseIcon name="arrow_upward" cursor="pointer" size-icon="22px" :disabled="!inputValue.length || isLoading"/>
        </button>
      </div>
    </div>
     <Dialog 
    v-model:visible="isVisibleSearch" 
    :modal="true" 
    :style="{ width: '50vw', height: '60vh'}" 
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    pt:root:class="search-dialog"
    >
      <!-- Header với border-bottom -->
      <template #header>
        <div class="w-100 flex-1">
          <InputText 
            v-model="searchText" 
            :placeholder="t('chatbot.search_chat_placeholder')" 
            class="w-full border-none shadow-none focus:ring-0 focus:border-transparent bg-transparent text-[15px]"
            :style="{ border: 'none', outline: 'none', background: 'transparent', 'box-shadow': 'none'}"
            @keydown.enter="handleSearchChat"
          />
        </div>
      </template>
      <div v-if="Object.keys(searchResult).length > 0" v-for="[date, conversations] in Object.entries(searchResult)" :key="date" class="mt-[16px]">
        <span class="text-[13px] font-medium text-[rgb(143,143,143)] px-[8px]">{{ date }}</span>
        <div class="flex flex-col mt-[6px]">
          <div class="flex gap-[10px] items-center px-[10px] py-[10px] hover:bg-[#0d0d0d0d] cursor-pointer rounded-[8px]" v-for="convers in conversations" :key="convers.id" @click="getDetailConversation(convers.id, true)">
            <i class="pi pi-comments"></i>
            <div class="flex flex-col overflow-hidden w-full">
              <span class="text-[14px] truncate inline-block">{{ convers.name }}</span>
              <span
                class="text-[13px] text-gray-500 truncate inline-block"
                v-html="highlightSearch(convers.resultSearch?.join(', '))"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-[30px]">
        <EmptyState :message="t('conversation.no_conversation')"/>
      </div>
  </Dialog>
  </div>
</template>

<style lang="scss">
.my-upload-button{
  width: 36px;
  height: 36px;
  padding: 4px;
  gap: 0;
  border: 1px solid rgba(0,0,0,0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .p-button-outlined {
    color: rgba(0,0,0,0.4)
  }

  .p-button-label {
    width: 0;
    padding: 0;
    overflow: hidden;
  }
}
</style>