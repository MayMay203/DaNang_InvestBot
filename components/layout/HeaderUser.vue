<script setup>
import { ROUTES } from "~/constants/routes";
import BaseIcon from "../base-components/BaseIcon.vue";
import { ref } from "vue";

const { t } = useTranslation();
const route = useRoute();
const op = ref();
const isDetail = ref(false);
const toggle = (event) => {
  op.value.toggle(event);
};
const authStore = useAuthStore()
const userStore = useUserStore()

const menuList = [
  {
    label: t("menu.home"),
    path: ROUTES.HOME,
  },
  {
    label: t("menu.service"),
    path: "#services",
  },
  {
    label: t("menu.chatbot"),
    path: ROUTES.CHAT_BOT,
  },
];
const isActive = ref(false);

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  authStore.reset()
  userStore.reset()
  return navigateTo(ROUTES.LOGIN)
}
</script>

<template>
  <div
    class="flex justify-between items-center bg-[rgba(74,144,226,0.1)] h-[60px] w-[100%] px-[20px] md:px-[40px]"
  >
    <NuxtLink :to="ROUTES.HOME" class="hidden md:inline-block">
      <img src="/images/logo.png" alt="logo" class="w-[175px]" />
    </NuxtLink>
    <div class="flex gap-[30px] items-center justify-between lg:justify-start flex-1 md:flex-initial">
      <div class="flex gap-4 lg:gap-2">
        <template v-for="(item, index) in menuList" :key="index">
          <NuxtLink
            v-if="item.label !== t('menu.service')"
            :to="item.path"
            class="px-[4px] py-[11px] md:px-[20px] flex items-center gap-[10px]"
            :class="{ active: route.path.startsWith(item.path) && !isActive }"
            @click="isActive = false"
          >
            {{ item.label }}
          </NuxtLink>
          <a
            v-else
            href="#services"
            class="px-[4px] py-[11px] md:px-[20px] flex items-center gap-[10px] cursor-pointer"
            :class="{ active: isActive }"
            @click="isActive = true"
          >
            {{ item.label }}
          </a>
        </template>
      </div>
      <div>
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
                  <span class="text-[13px] font-medium">Lê Thị Hồng Nhung</span>
                  <span class="text-[11px]">lethihongnhung2021n@gmail.com</span>
                </div>
              </div>
            </div>
            <button
              class="flex justify-between items-center px-[8px] py-[10px] menu-item"
              @click="isDetail = !isDetail"
            >
              <div class="flex gap-[8px]">
                <BaseIcon name="language" sizeIcon="22px"></BaseIcon>
                <span class="text-[14px]">{{ t("menu.language") }}</span>
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
              <span class="px-[10px] py-[8px] menu-item">{{
                t("menu.vietnamese")
              }}</span>
              <span class="px-[10px] py-[8px] menu-item">{{
                t("menu.english")
              }}</span>
            </div>
            <div
              class="h-[0.8px] bg-[#000] menu-item"
              :class="{ 'mt-[14px]': isDetail }"
            ></div>
            <button
              class="flex gap-[8px] items-center px-[8px] py-[10px] menu-item"
              @click="handleLogout"
            >
              <BaseIcon name="logout" sizeIcon="22px"></BaseIcon>
              <span class="text-[14px]">{{ t("menu.logout") }}</span>
            </button>
          </div>
        </Popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active {
  position: relative;
  color: rgba(6, 80, 118, 0.8);
  text-shadow: 0.2px 0.3px 0;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    width: 100%;
    height: 2px;
    background-color: rgba(6, 80, 118, 0.8);
    left: 50%;
    transform: translateX(-50%);
  }
}

.menu-item:hover {
  background-color: rgba(#ccc, 0.15);
  cursor: pointer;
  border-radius: 6px;
}

.filter-black {
  filter: invert(1) brightness(0);
}
</style>
