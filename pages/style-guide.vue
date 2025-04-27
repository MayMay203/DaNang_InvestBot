<template>
  <div class="style-guide">
        <div>
            <div class="text-[20px] font-bold mb-[8px]">BaseInput</div>
           <div class="flex gap-4 flex-col">
                <BaseInput v-model="inputValue" label="Name" height="40px" icon="visibility" cursorIcon="pointer"/>
                <BaseInput v-model="inputValue" label="Email" height="40px" typeTag="textarea"/>
           </div>
        </div>
        <div>
            <div class="text-[20px] font-bold">BaseIcon</div>
           <div class="flex gap-6 mt-4">
                <BaseIcon name="visibility" sizeIcon="20" disabled/>
                <BaseIcon name="visibility" sizeIcon="20" cursor="pointer"/>
           </div>
        </div>
        <div>
            <div class="text-[20px] font-bold">Base Button</div>
           <div class="flex gap-6 mt-4">
               <BaseButton text="primary" variant="primary" height="40px" width="200px" cursor="pointer"/>
               <BaseButton text="outline" variant="outline" height="40px" width="100px" color="red" borderColor="red"/>
               <BaseButton text="outline" variant="outline" height="40px" width="100px" color="rgba(6, 80, 118, 0.9)" borderColor="rgba(6, 80, 118, 0.9)" leftIcon="visibility"/>
           </div>
        </div>
  </div>
</template>
<script setup>
import BaseIcon from '~/components/base-components/BaseIcon.vue';
import BaseInput from '~/components/base-components/BaseInput.vue';

const inputValue = ref('')
</script>
<style scoped>
.style-guide{
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 2rem;
    background-color: #f6f7f9;
    border-radius: 1rem;
    height: 100vh;
}
</style>