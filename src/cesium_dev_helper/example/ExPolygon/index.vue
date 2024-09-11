<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <div style="display: flex;flex-direction: column;">
                <el-select style="width: 260px;" placeholder="请选择示例材质" v-model="imgUrl" @change="changeSel">
                    <el-option label="示例图片" value="images/img1.jpg">.jpg</el-option>
                    <el-option label="示例着色器" value="custom">shader(需打开高性能)</el-option>
                </el-select>
                <el-button @click="isPerformance = !isPerformance">高性能{{ isPerformance ? '已开启' : '已关闭' }}</el-button>
                <el-button @click="isTest = !isTest">测试数据{{ isTest ? '已开启' : '已关闭' }}</el-button>
            </div>
            <CzmMap width="800px" height="1000px">
                <Entity>
                    <Polygon zoom :hierarchy="hierarchy1" :performance="isPerformance" :test="isTest"
                        :polygons="polygons1" />
                    <Material :image="imgUrl" :custom="isCustom" :shader="shader" />
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
const isCustom = ref(false)
const isPerformance = ref(false)
const isTest = ref(false)
const changeSel = (val) => {
    if (val === 'custom') {
        isCustom.value = true
        isPerformance.value = true
        isTest.value = false
        polygons1.value.push(
            {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    -75.10, 39.57,
                    -75.10, 39.77,
                    -75.40, 39.77,
                    -75.40, 39.57
                ]),
                color: 'purple',
                height: 100,
            },
            {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    -75.50, 39.57,
                    -75.50, 39.77,
                    -75.80, 39.77,
                    -75.80, 39.57
                ]),
                color: 'purple',
                height: 100,
            },
        )
    } else {
        isCustom.value = false
        isPerformance.value = false
        isTest.value = false
    }
}
const polygons1 = ref([])
const hierarchy1 = ref(new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
    -75.10, 39.57,
    -75.10, 39.77,
    -75.40, 39.77,
    -75.40, 39.57
])))

const shader = {
    uniforms: {
        u_color: {
            type: Cesium.UniformType.VEC4,
            value: new Cesium.Color(0, 0.0, 1.0, 1.0)
        },
        u_time: {
            type: Cesium.UniformType.FLOAT,
            value: 0.0 // 用于时间动画
        }
    },
    fragmentShaderText: `
            uniform vec4 u_color;
            uniform float u_time;
            void main() {
                vec4 animatedColor = vec4(abs(sin(u_time)), u_color.g, u_color.b, 1.0);
                gl_FragColor = animatedColor; // 动态颜色动画
            }
        `
}





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