<template>
    <div>
        input: {{ test }}
    </div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
const test = inject('test');
onMounted(() => {
    console.log('son')
    console.log(test, 'inject')
})

</script>

<style lang="scss" scoped></style>