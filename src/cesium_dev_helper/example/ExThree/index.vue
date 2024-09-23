<template>
    <div class="ex1" style="display: flex;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>

        <!-- <CzmMap width="800px" height="1000px">
            <CzmCtx></CzmCtx>
            <Three></Three>
        </CzmMap> -->

        <CzmMap name='threeSync123' :option="opt" width="800px" height="1000px">
            <CzmCtx></CzmCtx>
            <Three></Three>
        </CzmMap>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import codeString from './code.js'
import { CzmCtx, CzmMap, Three } from '../../components'
const opt = {
    extraConfig: {
        name: 'threeSync123',
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
    baseConfig: {
        contextOptions: {
            requestWebgl2: true,
            webgl: {
                antialias: true,
                preserveDrawingBuffer: true,
                stencil: true,
                logarithmicDepthBuffer: true,
                alpha: true,
            }
        },
        useDefaultRenderLoop: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animate: false,
        timeline: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false,
        allowTextureFilterAnisotropic: false,
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        baseLayerPicker: true,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: Cesium.ShadowMode.DISABLED
    },
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