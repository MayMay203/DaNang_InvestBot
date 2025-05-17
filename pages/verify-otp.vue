<template>
<div class="flex justify-center items-center h-[100vh]">
    <div class="flex-1 p-[20px] md:p-[30px] lg:py-[20px] lg:px-[60px]">
        <h1 class="text-[rgba(6,80,118,0.9)] font-bold text-[24px] text-center">{{ t('auth.verify_OTP').toUpperCase() }}</h1>
        <div class="mt-[20px]">
            <BaseInput v-model="verifyData.OTP" :error="verifyError.OTP" :label="t('auth.OTP_message')" cursorIcon="pointer" :placeholder="t('auth.OTP_placeholder')" @blur="handleBlurInput('OTP')"/>
        </div>
        <div class="flex justify-between mt-[12px]">
            <button class="text-[rgba(6,80,118,0.9)] italic p-[4px] cursor-pointer" @click="handleResendOTP">{{ t('auth.resend_OTP') }}</button>
           <span class="text-[red] font-bold italic">{{ formattedTime }}</span>
        </div>
       <div class="mt-[30px]"><BaseButton :text="t('auth.confirm')" variant="primary" height="40px" width="100%" :disabled="isDisabled" @click="handleConfirmOTP"/></div>
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
import { getVerifySchema } from '~/schemas/verifyOTPSchema';
import { authService } from '~/service-api/authService';

const { t } = useTranslation()
const verifySchema = getVerifySchema(t)
const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

const verifyData = ref({
  OTP: ''
})
const verifyError = ref({
  OTP: ''
})
const totalTime = ref(120); 
let timer = null;

const isDisabled = computed(() => {
  return !verifyData.value.OTP || !!verifyError.value.OTP
})

const formattedTime = computed(() => {
  const minutes = String(Math.floor(totalTime.value / 60)).padStart(2, '0');
  const seconds = String(totalTime.value % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const handleBlurInput = (field) => {
    const result = verifySchema.safeParse(verifyData.value)
    if (!result.success) {
        const err = result.error.errors.find(err => err.path[0] === field)
        if (err) {
            verifyError.value[field] = err.message
        }
        else {
            verifyError.value[field] = ''
        }
    }
    else {
        verifyError.value[field] = ''
    }
}

const startCountdown = () => {
  timer = setInterval(() => {
    if (totalTime.value > 0) {
      totalTime.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const handleResendOTP = async() => {
  try {
     clearInterval(timer);         
    totalTime.value = 120;        
    startCountdown();    
    const { data } = await authService.resendOTP(userStore.email || localStorage.getItem('email'))
    toast.add({severity: 'success', summary: 'Register', detail: data.message, life: 3000})
  }
  catch (error) {
     if (error?.response) {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: getMessageError(error), life: 3000 });
      }
      else {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: error.message, life: 3000 })
    }
   }
}

const handleConfirmOTP = async () => {
  try {
   const otpData = {
    email: userStore.email || localStorage.getItem('email'),
    otp: verifyData.value.OTP
    }
    await authService.verifyOTP(otpData)
    router.push(ROUTES.LOGIN)
    toast.add({ severity: 'success', summary: t('toast.success'), detail: 'Your account has been successfully registered!', life: 3000 })
  }
  catch (error) {
    if (error?.response) {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: getMessageError(error), life: 3000 });
      }
      else {
       toast.add({ severity: 'error', summary: t('toast.error'), detail: error.message, life: 3000 })
    }
  }
}

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
