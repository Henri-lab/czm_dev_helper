<template>
    <div class="ex1" style="display: flex;flex-direction: column;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>

        <CzmMap name="tx123" :option="tx" width="1600px" height="1000px">
            <CzmCtx></CzmCtx>
        </CzmMap>

        <CodeEditor></CodeEditor>
    </div>
</template>

<script setup>
import CodeEditor from "@/components/CodeEditor/index.vue"
import { marked } from 'marked'
import codeString from './code.js'
import { CzmCtx, CzmMap } from '../../components'
// 武汉 白模 视图 
import { TencentImageryProvider } from '../../lib/Plugin/mapPlugin';


//腾讯底图
const txOpt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);
const tx = {
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
        name: 'wuhan',
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
};
const code = ref(null)

const md = marked(`
\`\`\` js
${codeString}
\`\`\`
`)
onMounted(() => {
})

</script>

<style lang="scss" scoped></style>