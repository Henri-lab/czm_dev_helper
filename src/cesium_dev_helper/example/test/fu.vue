<template>
    <div>
        <input v-model="input" />
        <slot />
    </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
const input = ref('')
provide('test', input)
onMounted(() => {
    console.log('fu')
})

</script>

<style lang="scss" scoped></style>