export default
    `
<template>
    <CzmMap>
        <CzmCamera :view="view" :position="position" :animation="animation" :rotation="rotation" :reset="reset" />
    </CzmMap>
</template>

<script setup>
import { CzmCamera, CzmMap } from 'cesium_dev_helper/components'
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
onMounted(() => {
    const timer = setTimeout(() => {
        reset.value = true
        clearTimeout(timer)
    }, 5000)
})
</script>
`