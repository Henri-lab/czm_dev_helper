<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <el-button @click="handleCollapse">坍塌切换</el-button>
            <CzmMap width="100%" height="80%">
                <!-- <Building :option="option" :tileset="tileset"></Building> -->
                <Building :option="option" :collapse="collapse"></Building>
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { Building, CzmMap } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'

const option =
{
    type: '3dtiles',
    building: {
        url: '/static/3dtiles/Tile_+002_+005/tileset.json',
    },
    extra: {
        matrix: {
            tx: 0,
            ty: 0,
            tz: -70,
            rx: 0,
            ry: 0,
            rz: 0,
            scale: 1.3,
        },
        isZoom: true//加载后自动缩放至模型
    },
}

const collapse = ref(false)
const handleCollapse = () => {
    collapse.value = !collapse.value
}






// const tileset = ref()
// onMounted(async () => {
//     await axios.get('/static/3dtiles/Tile_+000_+000/tileset.json').then(res => {
//         tileset.value = res.data
//     })
// })


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