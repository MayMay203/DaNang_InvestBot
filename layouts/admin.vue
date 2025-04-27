<script setup>
import Header from "~/components/layout/Header.vue";
import Sidebar from "~/components/layout/Sidebar.vue";
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="p-[40px]"><slot></slot></div>
    </div>
  </div>
</template>
