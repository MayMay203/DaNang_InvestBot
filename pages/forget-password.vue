<template>
<div class="flex justify-center items-center h-[100vh]">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.forget_password').toUpperCase() }}</h1>
        <div class="mt-[20px]">
            <BaseInput :label="t('auth.forget_password_message')" cursorIcon="pointer" :placeholder="t('auth.email_placeholder')"/>
        </div>
       <div class="mt-[30px]"><BaseButton :text="t('auth.confirm')" variant="primary" height="40px" width="100%"/></div>
    </div>
    <div class="hidden sm:block h-[100vh] flex-1" >
        <img class="w-[100%] h-[100%] object-fit-contain" src="/images/login.png" alt="sign-up"/>
    </div>
</div>
</template>
<script setup>
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
const { t } = useTranslation()
</script>
