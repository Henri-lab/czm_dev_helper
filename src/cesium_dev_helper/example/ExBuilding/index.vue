<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <el-button @click="handleCollapse">坍塌切换</el-button>
            <CzmMap name="collapseBuildings" :option="tecent" width="800px" height="1000px">
                <!-- <Building :option="option" :tileset="tileset"></Building> -->
                <Building :option="option" :collapse="collapse"></Building>
                <Sphere :options="sphereOpts" fly :center="center"></Sphere>
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { Building, CzmMap, Sphere } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'
import { TencentImageryProvider } from '../../lib/Plugin/mapPlugin';

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
    building: {
        url: '/static/3dtiles/mono/tileset.json',
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

const sphereOpts = []
let center
onMounted(() => {
    axios.get('/static/3dtiles/mono/scenetree.json').then((res) => {
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
            })
        })
        // console.log(sphereOpts, 'sphereOpts')
    })

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