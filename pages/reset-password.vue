<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.reset_password').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput v-model="resetData.password" :error="resetErrors.password" :label="t('auth.password')" typeTag="password" :placeholder="t('auth.password_placeholder')" @blur="handleBlurInput('password')"/>
            <BaseInput v-model="resetData.confirmPassword" :error="resetErrors.confirmPassword" :label="t('auth.confirm_password')" typeTag="password" :placeholder="t('auth.confirm_password_placeholder')" @blur="handleBlurInput('confirmPassword')" @keyup.enter="handleEnter"/>
       </div>
       <div class="mt-[30px]"><BaseButton :isLoading="isLoading" :text="t('auth.confirm')" variant="primary" height="40px" width="100%" :disabled="isDisabled" @click="handleResetPassword"/></div>
    </div>
    <div class="hidden sm:block h-[100vh] flex-1" >
        <img class="w-[100%] h-[100%] object-fit-contain" src="/images/login.png" alt="sign-up"/>
    </div>
    
</div>
</template>
<script setup>
import BaseButton from '~/components/base-components/BaseButton.vue';
import BaseInput from '~/components/base-components/BaseInput.vue';
import { getMessageError } from '~/utils/getMessageError';
import { ROUTES } from '~/constants/routes';
import { getResetPassSchema } from '~/schemas/resetPassSchema';
import { authService } from '~/service-api/authService';

const { t } = useTranslation()
const resetPassSchema = getResetPassSchema(t)
const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()
const isLoading = ref()

const resetData = ref({
    password: '',
    confirmPassword: '',
})
const resetErrors = ref({
    password: '',
    confirmPassword: ''
})

const isDisabled = computed(() => {
    return  !resetData.value.password || !resetData.value.confirmPassword || !!resetErrors.value.password || !!resetErrors.value.confirmPassword
})
const secretParam = computed(() => {
    return route.query.secret
})


const handleBlurInput = (field) => {
    const result = resetPassSchema.safeParse(resetData.value)
    if (!result.success) {
        const err = result.error.errors.find(err => err.path[0] === field)
        if (err) {
            resetErrors.value[field] = err.message
        }
        else {
            resetErrors.value[field] = ''
        }
    }
    else {
        resetErrors.value[field] = ''
    }
}

const handleResetPassword = async () => {
    try {
        isLoading.value = true
        isDisabled.value = true
        authStore.setToken({refreshToken: '', accessToken: secretParam.value})
        const { data } = await authService.resetPassword({ newPassword: resetData.value.password, confirmPassword: resetData.value.confirmPassword })
        isLoading.value = false
        isDisabled.value = false
        authStore.reset()
         toast.add({
            severity: 'success',
            summary: t('toast.success'),
            detail: data.message,
            life: 3000
        })
        
        setTimeout(() => {
            navigateTo(ROUTES.LOGIN)
        }, 3000)
    }
    catch (error) {
        isDisabled.value = false
        isLoading.value = false
        if (error?.response) {
            toast.add({ severity: 'error', summary: t('toast.error'), detail: getMessageError(error), life: 3000 });
        }
        else {
            toast.add({ severity: 'error', summary: t('toast.error'), detail: error.message, life: 3000 })
        }
    }
}

const handleEnter = async() => {
    const {password, confirmPassword} = resetData.value
    if(password && confirmPassword && !resetErrors.value.password && !resetErrors.value.confirmPasswor){
        await handleResetPassword()
    }
}

</script>
