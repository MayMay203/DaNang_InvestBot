<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.sign_up').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput v-model="signUpForm.email" :label="t('auth.email')" :placeholder="t('auth.email_placeholder')" :error="signUpErrors.email" @blur="handleBlurInput('email')"/>
            <BaseInput v-model="signUpForm.fullname" :label="t('auth.full_name')" :placeholder="t('auth.full_name_placeholder')" :error="signUpErrors.fullname" @blur="handleBlurInput('fullname')"/>
            <BaseInput v-model="signUpForm.password" :label="t('auth.password')" icon="visibility" cursorIcon="pointer" :error="signUpErrors.password" :placeholder="t('auth.password_placeholder')" @blur="handleBlurInput('password')"/>
            <BaseInput v-model="signUpForm.confirmPassword" :label="t('auth.confirm_password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.confirm_password_placeholder')" :error="signUpErrors.confirmPassword" @blur="handleBlurInput('confirmPassword')"/>
       </div>
       <div class="mt-[20px]">
        <BaseButton :text="t('auth.sign_up')" variant="primary" height="40px" width="100%" :disabled="isDisabled"/>
    </div>
       <div class="mt-[16px] text-center">
        <span class="text-[14px]">{{ t('auth.already_have_account') }}</span>
        <NuxtLink class="text-[rgba(6,80,118,0.9)] text-[14px] ml-[5px]" :to="ROUTES.LOGIN">{{ t('auth.login') }}</NuxtLink>
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
import { ROUTES } from '~/constants/routes';
import { getSignUpSchema } from '~/schemas/signUpSchema';

const { t } = useTranslation()
const signUpSchema = getSignUpSchema(t)

const signUpForm = ref({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
})

const signUpErrors = ref({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
})

const isDisabled = computed(() => {
    return !signUpForm.value.email || !signUpForm.value.password || !signUpForm.value.confirmPassword || !signUpForm.value.fullname || signUpErrors.value.email || signUpErrors.value.password || signUpErrors.value.fullname || signUpErrors.value.confirmPassword
})

const handleBlurInput = (field) => {
    const result = signUpSchema.safeParse(signUpForm.value)
  if (!result.success) {
    const error = result.error.errors.find(err => err.path[0] === field)
    if (error) {
      signUpErrors.value[field] = error.message
    } else {
      signUpErrors.value[field] = ''
    }
  } else {
    signUpErrors.value[field] = ''
  }
}




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
