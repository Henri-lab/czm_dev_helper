<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <el-button @click="handleSize('+')">增加半径</el-button>
            <el-button @click="handleSize('-')">减小半径</el-button>
            <CzmMap width="800px" height="1000px">
                <Point :size="size" :color="fixedColor" :colors="colors" :position="position" :extraOpt="extraOpt"></Point>
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

const size = ref(100)
const handleSize = (type) => {
    size.value += type == '+' ? 10 : -10
}
const fixedColor = ref()//如果指定一个固定颜色 则动态颜色失效
const colors = ref()
const position = ref(new Cesium.Cartesian3.fromDegrees(2.294481, 48.858370, 100))
const extraOpt = ref({
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 3,
    scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.0),
    translucencyByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.5),
    disableDepthTestDistance: 1000 // 在1000米内禁用深度测试
})
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