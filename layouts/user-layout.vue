<script setup>
import HeaderUser from "~/components/layout/HeaderUser.vue";
</script>

<template>
  <div class="flex flex-col">
    <header-user> </header-user>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
