<script setup>
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
let _viewer_
const $bus = inject('$bus')
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
})
const props = defineProps({
    image: {
        type: String,
        default: 'images/texture1.jpg'
    },
    position: {
        type: Object,
        default: () => Cesium.Cartesian3.fromDegrees(0, 0, 0)
    }
})

onMounted(() => {
    setTimeout(
        () => {
            const particleSystem = new Cesium.ParticleSystem({
                image: props.image, // 粒子的图像文件
                startColor: Cesium.Color.WHITE.withAlpha(0.7), // 粒子开始时的颜色
                endColor: Cesium.Color.WHITE.withAlpha(0.0), // 粒子结束时的颜色
                startScale: 1.0, // 粒子的初始缩放
                endScale: 4.0, // 粒子的结束缩放
                minimumParticleLife: 1.0, // 粒子的最短生命时长
                maximumParticleLife: 3.0, // 粒子的最长生命时长
                speed: 5.0, // 粒子的速度
                imageSize: new Cesium.Cartesian2(10.0, 10.0), // 粒子图像的大小
                emissionRate: 5.0, // 每秒发射的粒子数量
                lifetime: 16.0, // 整个粒子系统的生命周期
                emitter: new Cesium.CircleEmitter(5.0), // 粒子发射器的形状，这里是圆形
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(props.position) // 确定粒子系统的位置
            });
            _viewer_.scene.primitives.add(particleSystem);
            _viewer_.scene.preUpdate.addEventListener((scene, time) => {// 监听每帧更新 根据距离调整粒子的缩放比例
                const cameraPosition = _viewer_.camera.position;
                const particlePosition = new Cesium.Cartesian3(); // 使用 Matrix4.getTranslation 获取粒子的世界坐标
                Cesium.Matrix4.getTranslation(particleSystem.modelMatrix, particlePosition);
                const distance = Cesium.Cartesian3.distance(cameraPosition, particlePosition);// 计算相机和粒子之间的距离
                const scaleFactor = 1.0 / distance;  // 距离越远，缩放比例越小
                particleSystem.startScale = Math.max(1.0, scaleFactor * 100);
                particleSystem.endScale = Math.max(4.0, scaleFactor * 50);
            });
        },
        0)


})






</script>
