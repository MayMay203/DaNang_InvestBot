<script setup>
import BaseButton from '~/components/base-components/BaseButton.vue';
import { ROUTES } from '~/constants/routes';

definePageMeta({ layout: 'user-layout' })

const { t } = useTranslation()

const  scrollToService = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<template>
<div class="flex flex-col">
    <div class="h-[calc(100vh_-_60px)] relative">
      <img src="/images/slider.png" alt="slider" class="h-full w-full" />
      
      <div class="absolute bottom-0 p-[20px] md:p-[50px]">
        <h1 class="text-white text-[25px] font-bold mb-[6px]">DaNang InvestBot</h1>
        <p class="text-white text-[18px] font-medium mb-[50px]" style="text-shadow: 0px 0.5px 0.5px">{{ t('home.sliderDesc') }}</p>
        <BaseButton :text="t('home.viewService')" width="180px" :radius="0" background-color="#065076" @click="scrollToService"></BaseButton>
      </div>
    </div>
    <div class="flex justify-content flex-col md:flex-row px-[50px] py-[60px] gap-[12px] bg-white">
      <div class="flex-1">
        <h2 class="text-[#065076] mb-[16px] font-bold text-[22px]">{{ t('home.investmentGuide') }}</h2>
        <p>{{ t('home.investmentGuide_desc') }}</p>
      </div>
      <div class="flex-1 flex justify-center">
        <img src="/images/guidance.png" class="w-[350px]"/>
      </div>
    </div>
    <div class="px-[20px] py-[20px] md:px-[80px] lg:px-[50px] md:py-[60px] bg-[rgba(217,217,217,0.35)]">
      <h2 id="services" class="text-[#065076] mb-[16px] font-bold text-[22px] text-center lg:text-left scroll-mt-[60px]">{{ t('home.service') }}</h2>
      <div class="flex gap-[16px] flex-col items-center lg:flex-row">
        <Card style="height: 400px; overflow: hidden" class="flex-1 w-full">
          <template #header>
              <img alt="user header" src="/images/potential-project.png" class="w-full h-[250px]" />
          </template>
          <template #title>{{ t('home.potentialProjects') }}</template>
          <template #content>
              <p class="m-0">
                  {{ t('home.potentialProjects_desc') }}
              </p>
          </template>
        </Card>
        <Card style="height: 400px; overflow: hidden" class="flex-1 w-full">
          <template #header>
              <img alt="user header" src="/images/procedure.png" class="w-full h-[250px]"/>
          </template>
          <template #title>{{t('home.legalProcedures')}}</template>
          <template #content>
              <p class="m-0">
                  {{ t('home.legalProcedures_desc') }}
              </p>
          </template>
        </Card>
        <Card style="height: 400px; overflow: hidden" class="flex-1 w-full">
          <template #header>
              <img alt="user header" src="/images/assistance.png" class="w-full h-[250px]"/>
          </template>
          <template #title>{{ t('home.investmentAssistance') }}</template>
          <template #content>
              <p class="m-0">
                  {{ t('home.investmentAssistance_desc') }}
              </p>
          </template>
        </Card>
      </div>
  </div>
  <div class="px-[20px] py-[30px] md:px-[50px] md:py-[60px] bg-white flex justify-between">
    <div class="flex flex-col gap-[40px] lg:gap-[20px]">
      <NuxtLink :to="ROUTES.HOME">
      <img src="/images/logo.png" alt="logo" class="w-[175px]" />
    </NuxtLink>
    <span class="text-[#065076] text-center">{{ t('home.copyright') }}</span>
    </div>
    <div class="flex gap-5 lg:pr-[30px]">
      <NuxtLink to="#services" class="text-[#065076]">{{ t('home.service_footer') }}</NuxtLink>
      <NuxtLink :to="ROUTES.CHAT_BOT" class="text-[#065076] font-medium">{{ t('home.chatbot') }}</NuxtLink>
    </div>
  </div>
</div>
</template>


