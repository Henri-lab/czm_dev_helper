<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <CzmMap width="800px" height="1000px">
                <Point :colors="colors" :position="position"></Point>
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { Point, CzmMap } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'


const colors = ref()
const position = ref(new Cesium.Cartesian3.fromDegrees(2.294481, 48.858370, 100))
onMounted(() => {
    colors.value = {
        type: 'infinate',
        interval: 2,
        data: [
            {
                value: 'red',
                time: 0
            },
            {
                value: 'green',
                time: 2
            },
            {
                value: 'blue',
                time: 4
            },
        ]
    }
})

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