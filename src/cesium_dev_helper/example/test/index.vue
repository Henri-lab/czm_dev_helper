<template>
    <div>
        <fu>
            <son></son>
        </fu>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import fu from './fu.vue';
import son from './son.vue';
onMounted(() => {console.log('test')})
</script>

<style lang="scss" scoped></style>