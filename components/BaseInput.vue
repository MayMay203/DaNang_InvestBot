<template>
<div class="base-input">
    <label class="text-[14px]">{{ label }}</label>
   <div class="input-text" :style="inputStyle">
        <input v-model="modelValue" v-if="typeTag === 'input'" :placeholder="placeholder" class="input" @blur="handleBlurInput"/>
        <textarea v-model="modelValue" v-else-if="typeTag === 'textarea'" :placeholder="placeholder" class="input"/>
        <div class="icon-input" v-if="icon"><BaseIcon :name="icon" :sizeIcon="sizeIcon" :width="widthIcon" :height="heightIcon" :cursor="cursorIcon" @click="handleClickIcon"/></div>
   </div>
    <p v-if="error" class="text-red-500 text-[12px]">{{ error }}</p>
</div>
</template>

<script setup>
import BaseIcon from './BaseIcon.vue';
import { formatStyle } from './utils/formatStyle';

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    width: {
        type: [String, Number],
        default: '100%'
    },
    radius: {
        type: [String, Number],
        default: '6px'
    },
    height: {
        type: [String, Number],
        default: '40px'
    },
    placeholder: {
        type: String,
        default: 'Enter your text here'
    },
    typeTag: {
        type: String,
        default: 'input'
    },
    type: {
        type: String,
        default: 'text'
    },
    icon: {
        type: String,
        default: ''
    },
    sizeIcon: {
        type: [String, Number],
        default: '20px'
    },
    widthIcon: {
        type: [String, Number],
        default: '20px'
    },
    heightIcon: {
        type: [String, Number],
        default: '20px'
    },
    cursorIcon: {
        type: String,
        default: 'default'
    },
    error: {
        type: String,
        default: ''
    }
})
const modelValue = defineModel()
const emit = defineEmits(['blur'])

const inputStyle = computed(() => ({ width: formatStyle(props.width), height: formatStyle(props.height), borderRadius: formatStyle(props.radius) }))

const handleClickIcon = () => {
}

const handleBlurInput = () => {
    emit('blur')
}
</script>

<style lang="scss" scoped src="@/assets/styles/components/BaseInput.scss">

</style>