<template>
    <div class="base-button" :style="{...buttonStyle}" :variant="variant">
        <div class="icon-input" v-if="leftIcon"><BaseIcon :name="leftIcon" :sizeIcon="sizeIcon" :width="widthIcon" :height="heightIcon" :cursor="cursorIcon"/></div>
        <button :disabled="disabled" :type="type" @click="handleClick" class="button">
            {{text}}
        </button>
        <div class="icon-input" v-if="rightIcon"><BaseIcon :name="rightIcon" :sizeIcon="sizeIcon" :width="widthIcon" :height="heightIcon" :cursor="cursorIcon"/></div>
    </div>
</template>
<script setup>
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => {
            return ['primary', 'outline'].includes(value)
        }
    },
    text: {
        type: String,
        default: 'Text'
    },
    type: {
        type: String,
        default: 'button'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    width: {
        type: [String, Number],
        default: '100%'
    },
    height: {
        type: [String, Number],
        default: '100%'
    },
    cursor: {
        type: String,
        default: 'default'
    },
    radius: {
        type: [String, Number],
    },
    backgroundColor: {
        type: String,
    },
    color: {
        type: String,
    },
    borderColor: {
        type: String,
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
    leftIcon: {
        type: String,
    },
    rightIcon: {
        type: String,
    }
})

const buttonStyle = computed(() => ({
    width: props.width,
    height: props.height,
    cursor: props.disabled ? 'not-allowed' : props.cursor,
    backgroundColor: props.backgroundColor,
    color: props.color,
    borderColor: props.borderColor,
    borderRadius: props.radius
}))

const emit = defineEmits(['click'])

const handleClick = () => {
    if(!props.disabled) {
        emit('click')
    }
}
</script>
<style scoped src="@/assets/styles/BaseButton.scss">

</style>