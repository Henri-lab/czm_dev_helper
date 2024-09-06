<template>
    <div class="editor@henrifox"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { lineOpt as defaultLineOpt } from '../lib/Editor';

const $bus = inject('$bus')
let editor

//快速启动画笔 :draw={line=true}
const props = defineProps({
    draw: {
        type: Object,
        default: () => ({
            line: false,
        })
    },
    lineOpt: {
        type: Object,
        default: () => ({
            ...defaultLineOpt,
            mouseFollow: false,
            straight: false,
        })
    }
})


const emits = defineEmits(['edit'])
$bus.on('czmEditorEvent@henrifox', (_editor_) => {
    editor = _editor_
    emits('edit', editor)
    props.draw.line && editor.startLines(props.lineOpt)
})




</script>

<style lang="scss" scoped></style>