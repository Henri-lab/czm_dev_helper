<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: row;">
            <CzmMap width="1600px" height="1000px">
                <Entity>
                    <!-- <Model :option="option" :tileset="tileset"></Model> -->
                    <Model :option="option"></Model>
                </Entity>
            </CzmMap>
            <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

        </div>

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



const option = {
    type: 'gltf',
    model: {
        url: '/static/gltf/fightWarship.glb',
    },
    isZoom: true//加载后自动缩放至模型
}





const code = ref(null)


onMounted(() => {
})

</script>

<style lang="scss" scoped></style>