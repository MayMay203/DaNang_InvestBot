<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.sign_up').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput :label="t('auth.email')" :placeholder="t('auth.email_placeholder')"/>
            <BaseInput :label="t('auth.full_name')" :placeholder="t('auth.full_name_placeholder')"/>
            <BaseInput :label="t('auth.password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.password_placeholder')"/>
            <BaseInput :label="t('auth.confirm_password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.confirm_password_placeholder')"/>
       </div>
       <div class="mt-[20px]"><BaseButton :text="t('auth.sign_up')" variant="primary" height="40px" width="100%"/></div>
       <div class="mt-[16px] text-center">
        <span class="text-[14px]">{{ t('auth.already_have_account') }}</span>
        <NuxtLink class="text-[rgba(6,80,118,0.9)] text-[14px] ml-[5px]" to="/login">{{ t('auth.login') }}</NuxtLink>
       </div>
        <div class="option-text flex items-center gap-[10px] mt-[24px] text-[13px]">{{ t('auth.or') }}</div>
      <div class="mt-[16px]"> <BaseButton :text="t('auth.login_with_google')" variant="outline" radius="0" leftIcon="google" sizeIcon="24px" height="38px"></BaseButton></div>
    </div>
    <div class="hidden sm:block h-[100vh] flex-1" >
        <img class="w-[100%] h-[100%] object-fit-contain" src="/images/sign-up.png" alt="sign-up"/>
    </div>
    
</div>
</template>
<script setup>
import { NuxtLink } from '#components';
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
const { t } = useTranslation()
</script>
<style scoped>
.option-text::before {
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
    background-color: #00000033;
}
.option-text::after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
    background-color: #00000033;
}
</style>
