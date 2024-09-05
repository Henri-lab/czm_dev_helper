<template>
    <div class="ex1" style="display: flex;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>
        <div class="btns" style="width: 10%; height: 20%; display: flex; flex-direction: column;">
            <el-button @click="newLine">新建线段</el-button>
            <el-button @click="stopLine">停止画线</el-button>
            <el-button @click="drawbackLine">撤销</el-button>
        </div>
        <CzmMap>
            <CzmCamera :view="view"></CzmCamera>
            <CzmEditor ref="__ExEditor_CzmEditor__" @edit="getEditor"></CzmEditor>
        </CzmMap>
    </div>
</template>
import { Editor } from '@/Map';

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

const __ExEditor_CzmEditor__ = ref(null)
let editor
const getEditor = (_editor_) => {
    editor = _editor_
}
// -----------------------------------------------------------------------------------
const lineOpt = {
    t_id: Date.now(),  //timestamp as t_id
    name: 'test-line', //图形名称
    positions: [],  //坐标数组需要交互时添加
    material: Cesium.Color.BLUE,  //配置线段材质
    width: 5,  //线宽
    straight: false, // //两点直线模式
    mouseFollow: false, // 鼠标跟随模式
    clampToGround: true,  //是否贴地
    measure: true, //开启测量?
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),//缩放
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),//可视距离
    //绘制结束后
    after: (entity, pos) => {
        console.log('polyline-entity', entity)
        console.log('polyline-positions', pos)
    },
}

const newLine = () => {
    editor.startLines(lineOpt)
}
const closeLine = () => {
    editor.stopLines(false)
}
const drawbackLine = () => {
    editor.drawback('polyline', true)
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