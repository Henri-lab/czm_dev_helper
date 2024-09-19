<template></template>
<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import { watch } from 'vue';
import { onBeforeUnmount } from 'vue';
let _viewer_
const $bus = inject('$bus')
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
})
const props = defineProps({
    image: {
        type: String,
        default: ''
    },
    position: {
        type: Object,
        default: () => Cesium.Cartesian3.fromDegrees(0, 0, 0)
    },
    positions: {
        type: Array,
        default: () => []
    },
    group: {
        type: Boolean,
        default: false
    },
    single: {
        type: Boolean,
        default: false
    }
})

let particleSystem
function createParticles(image, position) {
    if (!_viewer_) return
    particleSystem = new Cesium.ParticleSystem({
        image: image, // 粒子的图像文件
        startColor: Cesium.Color.WHITE.withAlpha(0.7), // 粒子开始时的颜色
        endColor: Cesium.Color.WHITE.withAlpha(0.0), // 粒子结束时的颜色
        startScale: 1.0, // 粒子的初始缩放
        endScale: 5.0, // 粒子的结束缩放
        minimumParticleLife: 1.0, // 粒子的最短生命时长
        maximumParticleLife: 5.0, // 粒子的最长生命时长
        speed: 5.0, // 粒子的速度
        imageSize: new Cesium.Cartesian2(10.0, 10.0), // 粒子图像的大小
        emissionRate: 5.0, // 每秒发射的粒子数量
        lifetime: 16.0, // 整个粒子系统的生命周期
        emitter: new Cesium.CircleEmitter(5.0), // 粒子发射器的形状，这里是圆形
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position) // 确定粒子系统的位置
    });
    _viewer_.scene.primitives.add(particleSystem);


}
function createParticlesGroup(positions) {
    positions.forEach((position) => {
        createParticles(props.image, position)
    })
}

function emissionRateEvent() {
    _viewer_.scene.preUpdate.addEventListener((scene, time) => {
        const distance = Cesium.Cartesian3.distance(_viewer_.camera.position, particleSystem.modelMatrix[12]);
        if (distance > 100000) {
            particleSystem.emissionRate = 5; // Lower particle count when far away
        } else {
            particleSystem.emissionRate = 50; // Higher particle count when close
        }
    });
}

function scaleEvent() {
    _viewer_.scene.preUpdate.addEventListener((scene, time) => {// 监听每帧更新 根据距离调整粒子的缩放比例
        const cameraPosition = _viewer_.camera.position;
        const particlePosition = new Cesium.Cartesian3(); // 使用 Matrix4.getTranslation 获取粒子的世界坐标
        Cesium.Matrix4.getTranslation(particleSystem.modelMatrix, particlePosition);
        const distance = Cesium.Cartesian3.distance(cameraPosition, particlePosition);// 计算相机和粒子之间的距离
        const scaleFactor = 1.0 / distance;  // 距离越远，缩放比例越小
        particleSystem.startScale = Math.max(1.0, scaleFactor * 100);
        particleSystem.endScale = Math.max(4.0, scaleFactor * 50);
    });
}
function main() {
    if (props.single) {
        createParticles(props.image, props.position)
        // emissionRateEvent()
        scaleEvent()

    }
    else if (props.group) {
        // console.log('group particles', props.positions)
        createParticlesGroup(props.positions)
        // emissionRateEvent()
        scaleEvent()
    }
    else {
        console.error('Please set single or group when using Particles')
    }
}

let timer, timer2
onMounted(() => {
    timer = setTimeout(() => {
        timer2 = setInterval(() => {
            if (props.positions || props.position) {
                main()
                clearInterval(timer2)
            }
        }, 1);

    }, 0)


})
watch(() => props, () => {
    main()
}, { deep: true })

onBeforeUnmount(() => {
    clearTimeout(timer)
})




</script>
