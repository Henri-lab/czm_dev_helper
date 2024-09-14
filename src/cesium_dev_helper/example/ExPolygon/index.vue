<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <div style="display: flex;flex-direction: column;">
                <el-select style="width: 260px;" placeholder="请选择示例材质" v-model="selectValue" @change="changeSel">
                    <el-option label="示例图片" value="images/img1.jpg">.jpg</el-option>
                    <el-option label="示例着色器" value="custom">shader1(需打开高性能)</el-option>
                    <el-option label="示例着色器" value="custom2">shader2(需打开高性能)</el-option>
                </el-select>
                <el-button @click="isPerformance = !isPerformance">高性能{{ isPerformance ? '已开启' : '已关闭' }}</el-button>
                <el-button @click="isTest = !isTest">测试数据{{ isTest ? '已开启' : '已关闭' }}</el-button>
            </div>
            <CzmMap width="800px" height="1000px">
                <Entity>
                    <Polygon zoom :hierarchy="hierarchy1" :performance="isPerformance" :test="isTest"
                        :polygons="polygons1" />
                    <Material :image="imgUrl" :custom="isCustom" :material="customMaterial" :update="updateFn"
                        :shader="customShader" />
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


const selectValue = ref('')
const isCustom = ref(false)
const isPerformance = ref(false)
const isTest = ref(false)
const polygons1 = ref([])
const hierarchy1 = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
    -75.10, 39.57,
    -75.10, 39.77,
    -75.40, 39.77,
    -75.40, 39.57
]))
let customMaterial, updateFn, customShader, imgUrl
const changeSel = (val) => {
    if (val === 'custom') {
        isCustom.value = true
        isPerformance.value = true
        isTest.value = false
        polygons1.value = []
        polygons1.value.push(
            {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    -75.0, 40.0,
                    -75.1, 40.2,
                    -75.15, 40.3,
                    -75.1, 40.4,
                    -75.0, 40.5,
                    -74.9, 40.4,
                    -74.85, 40.3,
                    -74.9, 40.2,
                    -75.0, 40.0,
                ]),
                color: 'purple',
                height: 100,
            },
        )
        customMaterial = new Cesium.Material({//动态颜色
            fabric: {
                type: 'CustomMaterial',
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
                },
                source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                material.diffuse = color.rgb;
                material.alpha = color.a;
                return material;
            }
        `
            }
        });
        let time = 0
        updateFn = () => {
            time += 0.01;
            const red = Math.abs(Math.sin(time));
            const green = Math.abs(Math.sin(time + 1.0));
            const blue = Math.abs(Math.sin(time + 2.0));
            customMaterial.uniforms.color = new Cesium.Color(red, green, blue, 1.0);
        }
    } else if (val === 'custom2') {
        polygons1.value = []
        polygons1.value.push(
            {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    -75.0, 40.0,
                    -75.1, 40.1,
                    -75.2, 40.15,
                    -75.3, 40.2,
                    -75.4, 40.15,
                    -75.5, 40.1,
                    -75.6, 40.0,
                    -75.5, 39.9,
                    -75.4, 39.85,
                    -75.3, 39.8,
                    -75.2, 39.75,
                    -75.1, 39.7,
                    -75.0, 39.6,
                    -74.9, 39.7,
                    -74.8, 39.75,
                    -74.7, 39.8,
                    -74.6, 39.85,
                    -74.5, 39.9,
                    -74.4, 40.0,
                    -74.5, 40.1,
                    -74.6, 40.15,
                    -74.7, 40.2,
                    -74.8, 40.15,
                    -74.9, 40.1,
                    -75.0, 40.0,
                ]),
                color: 'purple',
                height: 100,
            },
        )
        customShader = new Cesium.CustomShader({
            uniforms: {
                time: {
                    type: Cesium.UniformType.FLOAT,
                    value: 0.0
                }
            },
            vertexShaderText: `
              attribute vec3 position;  // 声明顶点位置
              void main() {
              gl_Position = czm_modelViewProjection * czm_model * vec4(position, 1.0);
              }
            `,
            fragmentShaderText: `
              uniform float time;
              void main() {
              float r = 0.5 + 0.5 * sin(time);
              float g = 0.5 + 0.5 * cos(time);
              float b = 0.5 + 0.5 * sin(time + 1.0);
              gl_FragColor = vec4(r, g, b, 1.0);
              }
            `
        });
        let time
        updateFn = () => {
            time += 0.01;
            customShader.uniforms.time.value = time;
        }
    }
    else {
        imgUrl = val
        polygons1.value = []
        isCustom.value = false
        isPerformance.value = false
        isTest.value = false
    }
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

