<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: row;">
            <div class="btns" style="display: flex;
                flex-direction: column; 
                width: 10%; 
                position: absolute;
                z-index: 100;
                color:cornflowerblue;
                background-color:black;
                font-size: 20px;
                font-weight: 1000;
                border: 5px solid red;">
                <el-button @click="handleCollapse">坍塌切换</el-button>
                <br>
                Sphere聚合阈值
                <el-input v-model="input" placeholder=">=0" />
                <el-button @click="handleThreshold" round>确认</el-button>
                <el-button @click="threshold = -1" round>取消</el-button>
                <br>
                Label聚合阈值
                <el-input v-model="input2" placeholder=">=0" />
                <el-button @click="handleThreshold2" round>确认</el-button>
                <el-button @click="threshold = -1" round>取消</el-button>
                <br>
                <span style="background-color: antiquewhite;">
                    一级损伤：{{ ids }}
                    <br>
                    二级损伤：{{ ids2 }}
                    <br>
                    三级损伤：{{ ids3 }}
                </span>

            </div>
            <CzmMap name="wuhan123" :option="tecent" width="1600px" height="1000px">
                <Entity>
                    <Model :option="option" :tileset="tileset"></Model>
                    <Model :option="option" :collapse="collapse"></Model>
                    <Sphere :options="sphereOpts" :center="center" cluster :threshold="threshold"></Sphere>
                    <Label :options="labelSelOpts" v-show="threshold2 < 0"></Label>
                    <Label :options="labelOpts" cluster :threshold="threshold2"></Label>
                    <Particle group :positions="particlePos" :image="particleImg"></Particle>
                    <Particle group :positions="particlePos2" :image="particleImg2"></Particle>
                    <Particle group :positions="particlePos3" :image="particleImg3"></Particle>
                </Entity>
            </CzmMap>
        </div>
        <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

    </div>
</template>

<script setup>
import { Model, CzmMap, Sphere, Label, Entity, Particle } from '../../components'

import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios, { all } from 'axios'
import { TencentImageryProvider } from '../../lib/Plugin/mapPlugin';
import CodeEditor from '@/components/CodeEditor/index.vue'
const ids = ref([])
const ids2 = ref([])
const ids3 = ref([])

function createIdsBetween(min, max, count) {
    ids.value = [];
    while (count -= 1) {
        let res = Math.floor(Math.random() * (max - min + 1) + min)
        ids.value.push(res)
    }
    ids.value.sort()
}
function createIds2Between(min, max, count) {
    ids2.value = [];
    while (count -= 1) {
        let res = Math.floor(Math.random() * (max - min + 1) + min)
        ids2.value.push(res)
    }
    ids2.value.sort()
}
function createIds3Between(min, max, count) {
    ids3.value = [];
    while (count -= 1) {
        let res = Math.floor(Math.random() * (max - min + 1) + min)
        ids3.value.push(res)
    }
    ids3.value.sort()
}

//腾讯底图
const txOpt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);
const tecent = {
    baseConfig: {
        navigationHelpButton: true,
        navigationInstructionsInitiallyVisible: true,
    },
    providerConfig: {
        terrainProvider: [],
        imageryProvider: [
            {
                type: 'UrlTemplateImageryProvider',
                option: {
                    customProvider: tcip,
                },
            },
        ],
    },
    extraConfig: {
        name: 'cllapseBuildings',
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
};

const option =
{
    type: '3dtiles',
    model: {
        url: '/static/3dtiles/mono/test1/tileset.json',
    },
    extra: {
        transform: true,
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

let sphereOpts = []
let labelOpts = []
let labelSelOpts = []
let particlePos = []
let particleImg = 'images/fire.png'
let particlePos2 = []
let particleImg2 = 'images/fire2.png'
let particlePos3 = []
let particleImg3 = 'images/fire3.png'
let center
let childrenSel = []
onMounted(() => {
    axios.get('/static/3dtiles/mono/test1/scenetree.json').then((res) => {
        // console.log(res.data, 'data')
        // res.data.scenes[0].children.length = 100
        center = new Cesium.Cartesian3(res.data.scenes[0].sphere[0], res.data.scenes[0].sphere[1], res.data.scenes[0].sphere[2])
        res.data.scenes.forEach(area => {
            const childrens = area.children
            childrens.forEach(child => {
                sphereOpts.push({
                    id: child.id,
                    name: child.name,
                    center: new Cesium.Cartesian3(child.sphere[0], child.sphere[1], child.sphere[2]),
                    radius: child.sphere[3],
                    type: child.type || 'element',
                })

                labelOpts.push({
                    id: child.id,
                    name: child.name,
                    position: new Cesium.Cartesian3(child.sphere[0], child.sphere[1], child.sphere[2]),
                    text: child.name,
                    type: child.type || 'element',
                })
            })
            // 模拟请求到的特殊数据
            let childrenSel
            // 一级损伤
            createIdsBetween(0, 3667, 10)
            childrenSel = childrens.filter(item => ids.value.includes(item.id * 1))
            childrenSel.forEach(child => {
                particlePos.push(new Cesium.Cartesian3(child.sphere[0], child.sphere[1], child.sphere[2]))
            })
            // 二级损伤
            createIds2Between(0, 3667, 10)
            childrenSel = childrens.filter(item => ids2.value.includes(item.id * 1))
            childrenSel.forEach(child => {
                particlePos2.push(new Cesium.Cartesian3(child.sphere[0], child.sphere[1], child.sphere[2]))
            })
            // 三级损伤
            createIds3Between(0, 3667, 10)
            childrenSel = childrens.filter(item => ids3.value.includes(item.id * 1))
            childrenSel.forEach(child => {
                particlePos3.push(new Cesium.Cartesian3(child.sphere[0], child.sphere[1], child.sphere[2]))
            })
            let allIds = ids.value.concat(ids2.value).concat(ids3.value)
            childrenSel = childrens.filter(item => allIds.includes(item.id * 1))
            childrenSel.forEach((sel) => {
                labelSelOpts.push({
                    id: sel.id,
                    name: sel.name,
                    position: new Cesium.Cartesian3(sel.sphere[0], sel.sphere[1], sel.sphere[2]),
                    text: sel.name || 'UNKOWN',
                    type: sel.type || 'element',
                })
            })


        })

    })

})

const threshold = ref(-1)
const threshold2 = ref(-1)
const input = ref()
const input2 = ref()
const handleThreshold = (e) => {
    threshold.value = input.value * 1
}
const handleThreshold2 = (e) => {
    threshold2.value = input2.value * 1
}


const code = ref(null)


onMounted(() => {
})

</script>

<style lang="scss" scoped></style>