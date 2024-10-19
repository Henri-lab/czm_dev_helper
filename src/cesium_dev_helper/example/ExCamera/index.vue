<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: row;">
            <CzmMap width="1600px" height="1000px">
                <CzmCamera :view="view" :position="position" :animation="animation" :rotation="rotation"
                    :reset="reset" />
            </CzmMap>
        </div>
        <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

    </div>
</template>

<script setup>
import { CzmCamera, CzmMap } from '../../components'

import codeString from './code.js'
import { onMounted, ref } from 'vue'
import { Math as CesiumMath } from 'cesium';
import CodeEditor from '@/components/CodeEditor/index.vue'
const reset = ref(false)
const view = {
    destination: {
        longitude: 17,
        latitude: 23,
        height: 9999999,
    },
    heading: 0,
    pitch: -90,
    roll: 0,
}

const position = {
    longitude: 95.0970,
    latitude: 29.5522,
    height: 2000,
}

const animation = {
    wait: 2500,
    duration: 3,
    orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-90),
        roll: 0,
    }
}

const rotation = {
    wait: 6000,
    enable: true,
    angle: 0,
    speed: 0.5
}


const code = ref(null)


onMounted(() => {

    const timer = setTimeout(() => {
        reset.value = true
        clearTimeout(timer)
    }, 5000)
})

</script>

<style lang="scss" scoped></style>