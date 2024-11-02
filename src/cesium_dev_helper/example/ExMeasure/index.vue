<template>
    <div class="ex1" style="display: flex;flex-direction: column;">

        <CzmMap name="ex-measure" :option="map" width="1600px" height="1000px">
            <Terrian name="world"></Terrian>
        </CzmMap>

        <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

    </div>
</template>

<script setup>
import codeString from './code.js'
import CodeEditor from "@/components/CodeEditor/index.vue"
import { CzmCtx, CzmMap,Terrian } from '../../components'

const map = {
    extraConfig: {
        name: 'map of ex-measure',
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
};
onMounted(() => {
})

</script>

<style lang="scss" scoped></style>