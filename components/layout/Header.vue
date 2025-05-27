<script setup>
import { ROUTES } from "~/constants/routes";
import BaseIcon from "../base-components/BaseIcon.vue";
import { ref } from "vue";

const { t, locale } = useTranslation()
const confirm = useConfirm();
const op = ref();
const isDetail = ref(false);
const toggle = (event) => {
  op.value.toggle(event);
};
const authStore = useAuthStore()
const userStore = useUserStore()

const props = defineProps({
  sidebarWidth: String
})

const handleShowConfirmLogout = () => {
  confirm.require({
        message: t('toast.message_confirm_logout'),
        header: t('toast.confirm'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('action.cancel'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
          label: t('action.logout')
        },
        accept: () => {
            handleConfirmLogout()
        },
        reject: () => {
            
        }
    });
}

const handleConfirmLogout = () => {
  authStore.reset()
  userStore.reset()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  return navigateTo(ROUTES.LOGIN)
}

const handleChangeLanguage = (langCode) => {
  locale.value = langCode
  const currentLang = localStorage.getItem('lang')
  if (currentLang !== langCode) {
    localStorage.setItem('lang', langCode);
    localStorage.removeItem('activeMenu')
    location.reload()
  }
}
</script>

<template>
  <div
    class="flex justify-end bg-[#eaf2fb] h-[50px] pr-[20px]"
    :style="{
      position: 'fixed',
      zIndex: 99,
      width: `calc(100vw - ${sidebarWidth})`
    }"
  >
    <div
      class="flex items-center justify-center gap-[10px] cursor-pointer"
      @click="toggle"
    >
      <div class="w-[36px] h-[36px]">
        <img
          src="/images/avatar.jpg"
          class="w-[100%] h-[100%] rounded-[50%] object-cover"
        />
      </div>
      <BaseIcon name="arrow_down" sizeIcon="14" cursor="pointer" />
    </div>
    <Popover ref="op">
      <div class="flex flex-col gap-[4px]">
        <div class="p-0 m-0 flex flex-col mb-[4px]">
          <div class="flex items-center gap-[8px]">
            <img
              src="/images/avatar.jpg"
              alt="avatar"
              class="w-[36px] h-[36px] object-cover"
            />
            <div class="flex flex-col">
              <span class="text-[13px] font-medium">{{ userStore.fullName }}</span>
              <span class="text-[11px]">{{ userStore.email }}</span>
            </div>
          </div>
        </div>
        <button
          class="flex justify-between items-center px-[8px] py-[10px] menu-item"
          @click="isDetail = !isDetail"
        >
          <div class="flex gap-[8px]">
            <BaseIcon name="language" sizeIcon="22px"></BaseIcon>
            <span class="text-[14px]">{{t('menu.language')}}</span>
          </div>
          <BaseIcon
            name="arrow_down"
            sizeIcon="11px"
            :class="[
              'filter-black',
              {
                'rotate-180': isDetail,
                'transition-transform duration-300 ease-in-out': true,
              },
            ]"
            @click="toggleDetail"
          />
        </button>
        <div
          class="flex flex-col pl-[30px] text-[14px] gap-[6px]"
          v-if="isDetail"
        >
          <button class="px-[10px] py-[8px] menu-item flex justify-start" @click="handleChangeLanguage('vi')">{{t('menu.vietnamese')}}</button>
          <button class="px-[10px] py-[8px] menu-item flex justify-start" @click="handleChangeLanguage('en')">{{t('menu.english')}}</button>
        </div>
        <div
          class="h-[0.8px] bg-[#000] menu-item"
          :class="{ 'mt-[14px]': isDetail }"
        ></div>
        <button
          class="flex gap-[8px] items-center px-[8px] py-[10px] menu-item"
          @click="handleShowConfirmLogout"
        >
          <BaseIcon name="logout" sizeIcon="22px"></BaseIcon>
          <span class="text-[14px]">{{t('menu.logout')}}</span>
        </button>
      </div>
    </Popover>
  </div>
</template>
<style scoped lang="scss">
.menu-item:hover {
  background-color: rgba(#ccc, 0.15);
  cursor: pointer;
  border-radius: 6px;
}

.filter-black {
  filter: invert(1) brightness(0);
}
</style>
