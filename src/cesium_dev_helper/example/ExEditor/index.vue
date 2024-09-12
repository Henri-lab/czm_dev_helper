<template>
    <div class="ex1" style="display: flex;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>
        <div class="btns" style="width: 10%; height: 20%; display: flex; flex-direction: column;">
            <el-button @click="newLine('default')">新建（默认模式）</el-button>
            <el-button @click="newLine('follow')">新建（跟随模式）</el-button>
            <el-button @click="newLine('straight')">新建（直线模式）</el-button>
            <br>
            <el-button @click="newPoly">新建（多边形）</el-button>
            <br>
            <el-button @click="drawbackLine">撤销</el-button>
            <el-button @click="recoverLine">恢复</el-button>
            <br>
            <div>测量结果为：{{ measureRes }} Km</div>
        </div>
        <CzmMap width="800px" height="1000px">
            <CzmCamera :view="view"></CzmCamera>
            <CzmEditor @edit="getEditor"></CzmEditor>
        </CzmMap>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import { onMounted } from 'vue';
import codeString from './code.js'
import { CzmEditor, CzmMap, CzmCamera } from '../../components'
import * as Cesium from 'cesium'
const view = {
    destination: {
        longitude: 17,
        latitude: 23,
        height: 2000,
    },
    heading: 0,
    pitch: -90,
    roll: 0,
}
let _editor_
const getEditor = (editor) => {
    _editor_ = editor
}
// -----------------------------------------------------------------------------------
const measureRes = ref(0)
const lineOpt = {
    datasource: null,
    t_id: Date.now(),  //timestamp as t_id
    name: 'ex-line', //图形名称
    positions: [],  //预坐标
    material: Cesium.Color.BLUE,  //配置线段材质
    width: 5,  //线宽
    mode: 'default',
    clampToGround: true,  //是否贴地
    measure: true, //开启测量?
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),//缩放
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),//可视距离
    //绘制结束后
    after: ({ entity, value, screenXY, cartXY }) => {
        measureRes.value = value
        console.log(screenXY, cartXY)
    }
}
const polyOpt = {
    datasource: null,
    t_id: Date.now(),
    name: 'ex-poly',
    positions: [],
    material: Cesium.Color.BLUE,
    width: 5,
    mode: 'default',
    clampToGround: true,
    measure: true,
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),
    after: ({ entity, value, screenXY, cartXY }) => {
        measureRes.value = value
        console.log(screenXY, cartXY)
        console.log(entity, 'polygon')
    }
}

const newLine = (mode) => {
    lineOpt.mode = mode
    _editor_.startLines(lineOpt)
}
const drawbackLine = () => {
    _editor_.drawback('polyline')
}
const recoverLine = () => {
    _editor_.recover('polyline')
}
const newPoly = () => {
    _editor_.startPolygons(polyOpt)
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