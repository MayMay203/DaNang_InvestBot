<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.login').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput v-model="loginForm.email" :label="t('auth.email')" :placeholder="t('auth.email_placeholder')" :error="formErrors.email" @blur="handleBlurInput('email')"/>
            <BaseInput v-model="loginForm.password" :label="t('auth.password')" cursorIcon="pointer" :placeholder="t('auth.password_placeholder')" typeTag="password" :error="formErrors.password" @blur="handleBlurInput('password')"/>
       </div>
       <div class="flex justify-end mt-[12px]">
        <NuxtLink :to="ROUTES.FORGET_PASSWORD" class="text-[14px] text-[rgba(6,80,118,0.9)] italic inline-block">{{ t('auth.forget_password') }}?</NuxtLink>
       </div>
      <div class="mt-[20px]"><BaseButton @click="handleLogin" :text="t('auth.login')" variant="primary" height="40px" width="100%" :disabled="isDisabled"/></div>
       <div class="mt-[24px] text-center">
        <span class="text-[14px]">{{ t("auth.not_yet_have_account") }}</span>
        <NuxtLink class="text-[rgba(6,80,118,0.9)] text-[14px] ml-[5px]" :to="ROUTES.SIGNUP">{{ t('auth.sign_up') }}</NuxtLink>
       </div>
        <div class="option-text flex items-center gap-[10px] mt-[60px] text-[13px]">{{ t('auth.or') }}</div>
      <div class="mt-[24px]"> <BaseButton :text="t('auth.login_with_google')" variant="outline" radius="0" leftIcon="google" sizeIcon="24px" height="38px" @click="handleLoginGoogle"></BaseButton></div>
    </div>
    <div class="hidden sm:block h-[100vh] flex-1" >
        <img class="w-[100%] h-[100%] object-fit-contain" src="/images/login.png" alt="sign-up"/>
    </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import { NuxtLink } from '#components'
import { ROUTES } from '~/constants/routes'
import { getLoginSchema } from '~/schemas/loginSchema'
import BaseButton from '~/components/base-components/BaseButton.vue'
import BaseInput from '~/components/base-components/BaseInput.vue'
import { useToast } from "primevue/usetoast";
import { getMessageError } from '~/utils/getMessageError'

const { t } = useTranslation()
const toast = useToast()
const loginSchema = getLoginSchema(t)
const authStore = useAuthStore()
const isLoading = ref()

const loginForm = ref({
  email: '',
  password: ''
})
const formErrors = ref({
  email: '',
  password: ''
})

const isDisabled = computed(() => {
  return !loginForm.value.email || !loginForm.value.password || !!formErrors.value.email ||
    !!formErrors.value.password
})

// Functions
 const handleLogin = async () => {
   try {
    isLoading.value = true
    isDisabled.value = true
    await authStore.login({ email: loginForm.value.email, password: loginForm.value.password })
  }
   catch (error) {
     if (error?.response) {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: getMessageError(error), life: 3000 });
      }
      else {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: error.message, life: 3000 })
    }
  }
  finally {
      isLoading.value = false
      isDisabled.value = false
  }
}

const handleBlurInput = (field) => {
  const result = loginSchema.safeParse(loginForm.value)
  if (!result.success) {
    const error = result.error.errors.find(err => err.path[0] === field)
    if (error) {
      formErrors.value[field] = error.message
    } else {
      formErrors.value[field] = ''
    }
  } else {
    formErrors.value[field] = ''
  }
}

const handleLoginGoogle = async () => {
  window.location.href = 'http://localhost:3001/auth/login-with-google';
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
