<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;">
            <div class="code" ref="code"
                style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
            </div>
            <CzmMap width="800px" height="1000px">
                <CzmCamera :view="view" :position="position" :animation="animation" :rotation="rotation" :reset="reset" />
            </CzmMap>
        </div>

    </div>
</template>

<script setup>
import { CzmCamera, CzmMap } from '../../components'
import { marked } from 'marked'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import { Math as CesiumMath } from 'cesium';
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
const md = marked(`
\`\`\` js
${codeString}
\`\`\`
`)

onMounted(() => {
    code.value.innerHTML = md

    const timer = setTimeout(() => {
        reset.value = true
        clearTimeout(timer)
    }, 5000)
})

</script>

<style lang="scss" scoped></style>