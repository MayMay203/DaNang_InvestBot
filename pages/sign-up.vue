<template>
<div class="d-flex justify-content-center align-items-center">
    <div>
        <h1 class="title">SIGN UP</h1>
        <BaseInput :label="t('auth.password')" />
    </div>
    <div>

    </div>
</div>
</template>
<script setup>
import BaseInput from '~/components/BaseInput.vue';
const { t } = useTranslation()
</script>
<style scoped src="@/assets/styles/pages/sign-up.scss"></style>
