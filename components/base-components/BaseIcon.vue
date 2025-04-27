<template>
  <div
    class="base-icon"
    :style="iconStyle"
    :class="[props.class, { disabled: disabled }]"
    @click="handleClick"
  >
    <img :src="iconPath" class="icon" />
  </div>
</template>
<script setup>
import { formatStyle } from "../../utils/formatStyle";

const props = defineProps({
  name: {
    type: String,
  },
  sizeIcon: {
    type: [String, Number],
    default: "32px",
  },
  width: {
    type: [String, Number],
  },
  height: {
    type: [String, Number],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  cursor: {
    type: String,
    default: "default",
  },
  class: {
    type: String,
    default: "",
  },
});

const iconPath = computed(() => `/icons/${props.name}.svg`);
const iconStyle = computed(() => ({
  width: formatStyle(props.width) || formatStyle(props.sizeIcon),
  height: formatStyle(props.height) || formatStyle(props.sizeIcon),
  cursor: props.disabled ? "not-allowed" : props.cursor,
}));

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};
</script>
<style
  lang="scss"
  scoped
  src="@/assets/styles/components/BaseIcon.scss"
></style>
