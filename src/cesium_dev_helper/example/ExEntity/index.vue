<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <CzmMap width="800px" height="1000px">
                <Entity></Entity>
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { Entity, CzmMap } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'







const code = ref(null)
const md = marked(`
\`\`\` js
${codeString}
\`\`\`
`)

onMounted(() => {
    code.value.innerHTML = md
})

</script>

<style lang="scss" scoped></style>