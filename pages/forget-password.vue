<template>
<div class="flex justify-center items-center h-[100vh]">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.forget_password').toUpperCase() }}</h1>
        <div class="mt-[20px]">
            <BaseInput v-model="forgetData.email" :error="forgetErrors.email" :label="t('auth.forget_password_message')" cursorIcon="pointer" :placeholder="t('auth.email_placeholder')" @blur="handleBlurInput('email')"/>
        </div>
       <div class="mt-[30px]">
        <BaseButton :text="t('auth.confirm')" variant="primary" height="40px" width="100%" :disabled="isDisabled"/>
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

const { t } = useTranslation()
const forgetPassSchema = getForgetPassSchema(t)

const forgetData = ref({
  email: ''
})

const forgetErrors = ref({
  email: ''
})

const isDisabled = computed(() => {
  return !forgetData.value.email || forgetErrors.value.email
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




</script>
