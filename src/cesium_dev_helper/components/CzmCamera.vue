<template></template>
<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { Math as CesiumMath } from 'cesium'
import { watch } from 'vue';

const $bus = inject('$bus')
const props = defineProps({
    position: {
        type: Object,
        default: () => ({})
    },
    animation: {
        type: Object,
        default: () => ({
            wait: 0,
            duration: 2,
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
            wait: 0,
            enable: false,
            angle: null,
            speed: null,
        })
    },
    reset: {
        type: Boolean,
        default: false
    },
    view: {
        type: Object,
        default: () => ({})

    }
})
function empty(value) {
    return value == {}
}
let cM
let timer
let timer2
$bus.on('czmCameraEvent@henrifox', (_cM_) => {
    cM = _cM_
    if (props.reset) {
        cM.resetView();
        // stop rotation

        return
    }
    !empty(props.view) && cM.setView(props.view)//设置view 则初始化视角view
    !empty(props.position) &&
        (timer = setTimeout(() => {//设置position 则在'wait' ms后进行 fly
            cM.flyTo({
                position: props.position,
                effectOptions: props.animation
            })
            clearTimeout(timer)
        }, props.animation.wait));
    timer2 = setTimeout(() => {//设置旋转 'wait' ms 后开始旋转
        cM.isRotationEnabled(props.rotation.enable, props.rotation.angle, props.rotation.speed)
        clearTimeout(timer2)
    }, props.rotation.wait);

})
watch(() => props, () => {
    $bus.emit('czmCameraEvent@henrifox', cM)
}, { deep: true })

onBeforeUnmount(() => {
    clearTimeout(timer)
    clearTimeout(timer2)
})

</script>

<style lang="scss" scoped></style>