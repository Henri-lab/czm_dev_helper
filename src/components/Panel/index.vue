<template>
    <div class="card">
        <draw v-show="isDraw"></draw>
    </div>
</template>

<script setup>
import draw from './draw.vue';
import bus from '@/util/bus'

const isDraw = ref(false);
bus.on('panel_draw_showToggle', () => {
    isDraw.value = !isDraw.value;
})


</script>

<style lang="scss" scoped></style>