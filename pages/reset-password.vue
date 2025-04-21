<template>
<div class="flex justify-center items-center">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.reset_password').toUpperCase() }}</h1>
       <div class="flex flex-col gap-[10px]">
            <BaseInput v-model="resetData.password" :error="resetErrors.password" :label="t('auth.password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.password_placeholder')" @blur="handleBlurInput('password')"/>
            <BaseInput v-model="resetData.confirmPassword" :error="resetErrors.confirmPassword" :label="t('auth.confirm_password')" icon="visibility" cursorIcon="pointer" :placeholder="t('auth.confirm_password_placeholder')" @blur="handleBlurInput('confirmPassword')"/>
       </div>
       <div class="mt-[30px]"><BaseButton :text="t('auth.confirm')" variant="primary" height="40px" width="100%" :disabled="isDisabled"/></div>
    </div>
    <div class="hidden sm:block h-[100vh] flex-1" >
        <img class="w-[100%] h-[100%] object-fit-contain" src="/images/login.png" alt="sign-up"/>
    </div>
    
</div>
</template>
<script setup>
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
import { getResetPassSchema } from '~/schemas/resetPassSchema';

const { t } = useTranslation()
const resetPassSchema = getResetPassSchema(t)

const resetData = ref({
    password: '',
    confirmPassword: '',
})

const resetErrors = ref({
    password: '',
    confirmPassword: ''
})

const isDisabled = computed(() => {
    return  !resetData.value.password || !resetData.value.confirmPassword || resetErrors.value.password || resetErrors.value.confirmPassword
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




</script>
