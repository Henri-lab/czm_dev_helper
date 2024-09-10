<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <el-select style="width: 260px;" v-model="imgUrl">
                <el-option label=" 示例图片" value="images/img1.jpg">img1</el-option>
            </el-select>
            <CzmMap width="800px" height="1000px">
                <Entity>
                    <Polygon zoom :hierarchy="hierarchy1" />
                    <Material :image="imgUrl" />
                </Entity>
            </CzmMap>
        </div>
    </div>
</template>

<script setup>
import { Polygon, CzmMap, Entity, Material } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'

const imgUrl = ref('')
const hierarchy1 = ref(new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
    -75.10, 39.57, // 第一个顶点
    -75.10, 39.77, // 第二个顶点
    -75.40, 39.77, // 第三个顶点
    -75.40, 39.57  // 第四个顶点
])))
const hierarchy2 = ref(new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
    -76.10, 39.57, // 第一个顶点
    -76.10, 39.77, // 第二个顶点
    -76.40, 39.77, // 第三个顶点
    -76.40, 39.57  // 第四个顶点
])))


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