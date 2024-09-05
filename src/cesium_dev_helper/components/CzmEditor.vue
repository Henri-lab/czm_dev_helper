<template>
    <div class="editor" display="flex">
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { lineOpt as defaultLineOpt } from '../lib/Editor';

const $bus = inject('$bus')
let editor

const props = defineProps({
    draw: {
        type: Object,
        default: () => ({
            line: true,
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
let drawback
defineExpose({
    drawback
})
$bus.on('czmEditorEvent@henrifox', (_editor_) => {
    editor = _editor_
    props.draw.line && editor.startLines(props.lineOpt)
    drawback = editor.drawback
    setTimeout(() => {
        editor.drawback('polyline')
    }, 10000)
})

</script>

<style lang="scss" scoped></style>