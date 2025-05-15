<script setup>
import BaseButton from '~/components/base-components/BaseButton.vue';
import BaseIcon from '~/components/base-components/BaseIcon.vue';

const {t} = useTranslation()
const isExpanded = ref(true) 
const inputValue = ref()

const handleAddNewChat = () => {

}

const handleSearchChat = () => {

}

const adjustHeight = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto'; 
  textarea.style.height = `${textarea.scrollHeight}px`;
  textHeight.value = textarea.scrollHeight; 
};

definePageMeta({ layout: "user-layout" });
</script>
<template>
  <div>
    <!-- Fixed sidebar -->
     <div :class="[
        'transition-all duration-500 ease-in-out',
        isExpanded ? 'w-[250px]' : 'w-0 overflow-hidden',
        'fixed px-[16px] py-[24px] bg-[rgba(74,144,226,0.05)] h-screen'
      ]">
      <div :class="['top-[16px] flex w-full pr-[36px]', 'absolute']">
        <BaseIcon name="right_panel_close" size-icon="24" cursor="pointer" @click="isExpanded = !isExpanded"></BaseIcon>
        <div class="flex gap-[10px] ml-auto">
          <BaseIcon name="search" size-icon="24" cursor="pointer" @click="handleAddNewChat" v-if="isExpanded"></BaseIcon>
          <BaseIcon name="edit_square" size-icon="22" cursor="pointer" @click="handleSearchChat" v-if="isExpanded"></BaseIcon>
        </div>
      </div>
      <div class="mt-[30px] overflow-auto max-h-[80vh] mr-[-16px]">
        <div>
          <span class="text-[13px] font-semibold">Today</span>
          <div class="flex flex-col mt-[4px]">
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
          </div>
        </div>
        <div class="mt-[30px]">
          <span class="text-[13px] font-semibold">Yesterday</span>
          <div class="flex flex-col mt-[4px]">
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
          </div>
        </div>
        <div class="mt-[30px]">
          <span class="text-[13px] font-semibold">Yesterday</span>
          <div class="flex flex-col mt-[4px]">
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
            <div class="flex gap-[8px] items-center px-[10px] py-[8px] hover:bg-[#F4F4F4] cursor-pointer rounded-[8px]">
              <span class="flex-1 text-[13px] max-w-[18] truncate">Chính sách đầu tư các công trình...</span>
              <BaseIcon name="delete" size-icon="20px" cursor="pointer"></BaseIcon>
            </div>
          </div>
        </div>
      </div>
     </div>
     <div :class="['fixed bottom-[35px]',
        isExpanded ? 'left-[calc(50%_+_125px)]' : 'left-[50%]',
        'transform -translate-x-1/2'
        ]">
      <Textarea v-model="inputValue" rows="3" cols="30" :style="{width: '600px', 'border-radius': '20px', 'resize': 'none', 'overflow': 'hidden', 'padding': '8px 16px'}" @input="adjustHeight" :placeholder="t('chatbot.placeholder_chat')"/>
      <div class="flex gap-[8px] absolute bottom-[16px] right-[16px]">
        <button class="w-[36px] h-[36px] rounded-[50%] bg-[#D9D9D9] flex justify-center items-center cursor-pointer">
          <BaseIcon name="plus" cursor="pointer" size-icon="24px"/>
        </button>
        <button class="w-[36px] h-[36px] rounded-[50%] bg-white flex justify-center items-center cursor-pointer border-1 border-[rgba(0,0,0,0.4)]">
          <BaseIcon name="micro" cursor="pointer" size-icon="22px"/>
        </button>
      </div>
    </div>
    <div>
      <div>Chính sách đầu tư ở Đà Nẵng</div>
    </div>
  </div>
</template>
