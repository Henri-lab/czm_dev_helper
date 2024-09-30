<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <CzmMap width="800px" height="1000px">
                <Entity>
                    <!-- <Model :option="option" :tileset="tileset"></Model> -->
                    <Model :option="option"></Model>
                </Entity>
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { Model, CzmMap, Sphere, Label, Entity, Particle } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios, { all } from 'axios'
import { TencentImageryProvider } from '../../lib/Plugin/mapPlugin';

const ids = ref([])
const ids2 = ref([])
const ids3 = ref([])



const option = {
    type: 'gltf',
    model: {
        url: '/static/gltf/fightWarship.glb',
    },
    isZoom: true//加载后自动缩放至模型
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