<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.reset_password').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput :label="t('auth.password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.password_placeholder')"/>
            <BaseInput :label="t('auth.confirm_password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.confirm_password_placeholder')"/>
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
