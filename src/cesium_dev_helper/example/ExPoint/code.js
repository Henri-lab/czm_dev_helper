export default
    `
<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: column;">
            <div class="btns" style="display: flex;flex-direction:column;">
                <el-button @click="handleSize('+')">增加半径</el-button>
                <el-button @click="handleSize('-')">减小半径</el-button>
                <el-button @click="handlePerformance">高性能切换</el-button>
                <el-button @click="generateJSON">生成静态GeoJSON</el-button>
            </div>
            <CzmMap width="1600px" height="1000px">
                <Entity layerName="point123" draggable>
                     <Point 
                      :size="size" 
                      :color="fixedColor" 
                      :colors="colors" 
                      :position="position" 
                      :extraOpt="extraOpt"
                      zoom 
                      :performance="isPerformance"
                      test          
                      />
                    <template #popup="scope">
                        <div class="custom-popup"
                            style="background-color: rgb(86, 86, 86); width: 400px;height: 360px; font-size: 20px;"
                            v-if="scope.isPicked" v-mouse-follow>
                            <span style="color: blanchedalmond;">entity name :</span> <br> {{ scope.entity.name }}<br>
                            <span style="color: blanchedalmond;">entity id :</span><br>{{ scope.entity.id }}<br>
                            <span style="color: blanchedalmond;">entity color :</span><br>{{ scope.primitive.color }}<br>
                            <span style="color: blanchedalmond;">entity position :</span><br> {{
                                scope.primitive.position }}<br>
                        </div>
                    </template>
                    <template #data="scope">
                        <div class="geojson"
                            style="background-color: yellow;position: absolute;right: 0; z-index: 100;width: 260px;"
                            v-show="isJSON">
                            {{ scope.geojson }}
                        </div>
                    </template>
                </Entity>
            </CzmMap>
        </div>
    </div>
</template>

<script setup>
import { Point, CzmMap, Entity, Material } from '../../components'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
const size = ref(100)
const handleSize = (type) => {
    size.value += type == '+' ? 10 : -10
}
const isPerformance = ref(false)
const handlePerformance = () => {
    isPerformance.value = !isPerformance.value
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
let isJSON = ref(false)
const generateJSON = () => {
    isJSON.value = !isJSON.value
}
`