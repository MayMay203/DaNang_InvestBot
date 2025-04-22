<template>
    <div class="flex justify-center items-center">
        <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
            <div>
                <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.forget_password').toUpperCase() }}</h1>
            <div class="mt-[20px]">
                <BaseInput v-model="forgetData.email" :error="forgetErrors.email" :label="t('auth.forget_password_message')" cursorIcon="pointer" :placeholder="t('auth.email_placeholder')" @blur="handleBlurInput('email')"/>
            </div>
           <div class="mt-[30px]">
            <BaseButton :text="t('auth.confirm')" variant="primary" height="40px" width="100%" :disabled="isDisabled" @click="handleForgetPassword"/>
            </div>

            </div>
            <div class="flex flex-col justify-center mt-[30px]">
                <div class="mt-[16px] text-center">
                <span class="text-[14px]">{{ t('auth.already_have_account') }}</span>
                <NuxtLink class="text-[rgba(6,80,118,0.9)] text-[14px] ml-[5px]" :to="ROUTES.LOGIN">{{ t('auth.login') }}</NuxtLink>
            </div>
        <div class="option-text flex items-center gap-[10px] mt-[24px] text-[13px]">{{ t('auth.or') }}</div>
      <div class="mt-[16px]"> <BaseButton :text="t('auth.login_with_google')" variant="outline" radius="0" leftIcon="google" sizeIcon="24px" height="38px"></BaseButton></div>
            </div>
        </div>
        <div class="hidden sm:block h-[100vh] flex-1" >
            <img class="w-[100%] h-[100%] object-fit-contain" src="/images/login.png" alt="sign-up"/>
        </div>
    </div>
</template>
<script setup>
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
import { getForgetPassSchema } from '~/schemas/forgetPassSchema';
import { authService } from '~/service-api/authService';
import { ROUTES } from '~/constants/routes';

const { t } = useTranslation()
const forgetPassSchema = getForgetPassSchema(t)
const toast = useToast()
const router = useRouter()

const forgetData = ref({
  email: ''
})

const forgetErrors = ref({
  email: ''
})

const isDisabled = computed(() => {
  return !forgetData.value.email || !!forgetErrors.value.email
})

const handleBlurInput = (field) => {
    const result = forgetPassSchema.safeParse(forgetData.value)
    if (!result.success) {
        const err = result.error.errors.find(err => err.path[0] === field)
        if (err) {
            forgetErrors.value[field] = err.message
        }
        else {
            forgetErrors.value[field] = ''
        }
    }
    else {
        forgetErrors.value[field] = ''
    }
}

const handleForgetPassword = async () => {
    try {
        await authService.forgetPassword(forgetData.value.email)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Check your email to reset password', life: 3000 })
        router.push(ROUTES.LOGIN)
    }
    catch (error) {
         if (error?.response) {
       toast.add({ severity: 'error', summary: 'Error Login', detail: getMessageError(error), life: 3000 });
      }
      else {
       toast.add({ severity: 'error', summary: 'Error Login', detail: error.message, life: 3000 })
    }
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
