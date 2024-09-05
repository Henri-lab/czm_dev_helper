<template>
    <div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Math as CesiumMath } from 'cesium'

const $bus = inject('$bus')
const props = defineProps({
    position: {
        type: Object,
        default: () => ([
            {
                longitude: 95.0970,
                latitude: 29.5522,
                height: 1000
            }
        ])
    },
    animation: {
        type: Object,
        default: () => ({
            duration: 3,
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-90),
                roll: 0
            }
        })
    },
    rotation: {
        type: Object,
        default: () => ({
            enable: false,
            angle: 0,
            speed: 0.5
        })
    },
})

let cM
$bus.on('cameraManager-done', (_cM_) => {
    cM = _cM_
    console.log(cM)
    cM.isRotationEnabled(props.rotation.enable, props.rotation.angle, props.rotation.speed)
    cM.flyTo({
        position: props.position,
        effectOptions: props.animation
    })
    setTimeout(() => {
        cM.resetView()
        cM.isRotationEnabled(1, props.rotation.angle, props.rotation.speed)
    }, 5000)



})

</script>

<style lang="scss" scoped></style>