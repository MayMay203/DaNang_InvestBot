<script setup>
import { NuxtLink } from "#components";
import { ROUTES } from "~/constants/routes";
import BaseIcon from "~/components/base-components/BaseIcon.vue";

const route = useRoute();
const {t} = useTranslation()
const menuList = [
  { label: t('menu.manage_account'), path: ROUTES.MANAGE_ACCOUNT, icon: "dashboard" },
  { label: t('menu.manage_material'), path: ROUTES.MANAGE_MATERIALS, icon: "material" },
  {
    label: t('menu.manage_knowlege'),
    path: ROUTES.MANAGE_KNOWLEDGE_STORE,
    icon: "store",
  },
  { label: t('menu.chatbot'), path: ROUTES.CHAT_BOT, icon: "chatbot" },
];
const isVisible = ref(false);
</script>
<template>
  <div
    class="sidebar bg-[rgba(74,144,226,0.1)] h-[100vh] border-r border-[rgba(6,80,118,0.1)]"
    :style="{
      width: isVisible ? '250px' : '70px',
    }"
  >
    <div
      class="flex items-center p-[20px]"
      :class="{ 'gap-[12px]': isVisible }"
    >
      <BaseIcon
        name="menu"
        sizeIcon="30"
        cursor="pointer"
        @click="isVisible = !isVisible"
      />
      <NuxtLink :to="ROUTES.HOME" v-if="isVisible">
        <img src="/images/logo.png" alt="logo" class="w-[150px]" />
      </NuxtLink>
    </div>
    <div class="mt-[40px]">
      <div class="flex flex-col">
        <NuxtLink
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.path"
          class="py-[11px] px-[20px] flex items-center gap-[10px]"
          :class="{
            'bg-[rgba(6,80,118,0.8)] text-white': route.path.startsWith(
              item.path
            ),
          }"
        >
          <BaseIcon
            :name="item.icon"
            sizeIcon="26px"
            :class="{
              'filter-white': route.path.startsWith(item.path),
              'filter-blue': !route.path.startsWith(item.path),
            }"
          />
          <span
            v-if="isVisible"
            class="flex-1 text-left leading-[20px]"
            :class="{
              'text-white': route.path.startsWith(item.path),
              'text-[#065076]': !route.path.startsWith(item.path),
            }"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .sidebar {
//   transition: width 0.3s ease, opacity 0.3s ease;
// }

.filter-white {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(9%)
    hue-rotate(202deg) brightness(105%) contrast(102%);
  transition: filter 0.3s;
}

.filter-blue {
  filter: brightness(0) saturate(100%) invert(22%) sepia(19%) saturate(5013%)
    hue-rotate(174deg) brightness(94%) contrast(95%);
}

.sidebar-transition {
  transition: 0.5s ease width;
}
</style>
