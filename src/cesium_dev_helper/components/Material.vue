<script setup>
import * as Cesium from 'cesium'
const props = defineProps({
    image: {
        type: String,
        default: ''
    },
    custom: {
        type: Boolean,
        default: false
    },
    shader: {
        type: Object,
        default: null
    }
})

const $bus_Entity = inject('$bus_Entity')
const $bus = inject('$bus')
let _viewer_
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
})
// 定义自定义着色器
const customShader = new Cesium.CustomShader({
    uniforms: {
        time: {
            type: Cesium.UniformType.FLOAT,
            value: 0.0,
        },
    },
    // 顶点着色器不修改，保持默认行为
    vertexShaderText: `
        void main() {
            // 可以在这里修改顶点位置（可选）
        }
    `,
    // 片段着色器修改颜色
    fragmentShaderText: `
        uniform float time;
        void main() {
        float r = abs(sin(time));   // 随时间变化的红色分量
        float g = abs(sin(time + 1.0)); // 随时间变化的绿色分量
        float b = abs(sin(time + 2.0)); // 随时间变化的蓝色分量
        gl_FragColor = vec4(r, g, b, 1.0); // 输出颜色
    }
    `
});

let _target_, _type_, _isPrimitive_
$bus_Entity.on('materialEvent@henrifox', ({ target, type, isPrimitive }) => {
    _target_ = target
    _type_ = type
    _isPrimitive_ = isPrimitive

    if (!_target_ || !_type_) return
    if (_isPrimitive_ && props.custom) {
        console.log('custom material', _target_, _type_, props.shader)
        _target_._primitives.forEach((pri) => {
            console.log(pri, 'MaterialVue:primitive')
            pri.appearance = new Cesium.MaterialAppearance({
                materialSupport: Cesium.MaterialAppearance.MaterialSupport.BASIC,
                vertexShaderSource: customShader.vertexShaderText,
                fragmentShaderSource: customShader.fragmentShaderText,
            })
        })
        // 在渲染循环中更新时间
        // _viewer_.clock.onTick.addEventListener(function (clock) {
        //     const timeInSeconds = _viewer_.clock.currentTime.secondsOfDay;
        //     customShader.uniforms.time.value = timeInSeconds % (2 * Math.PI); // 使时间在 0 ~ 2π 范围内循环
        //     _viewer_.scene.requestRender();
        // });
        return
    }
    if (props.img) {
        _target_[_type_?.toLowerCase()].material = new Cesium.ImageMaterialProperty({
            image: props.image,
            repeat: new Cesium.Cartesian2(1.0, 1.0), // 重复次数
            transparent: false
        })
    }
})

// image属性生成图片材质 （开启custom则关闭）
watch(() => props.image, (newV, oldV) => {
    if (!_target_ || !_type_ || newV == oldV) return
    if (props.custom || !newV) return
    _target_ &&
        (_target_[_type_?.toLowerCase()].material = new Cesium.ImageMaterialProperty({
            image: newV,
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: false
        }))
})

//  开启custom,并且目标为primitive 时，使用自定义shader材质
watch(() => props.custom, (newV, oldV) => {
    // if (!_target_ || !_type_ || !newV || newV == oldV || !_isPrimitive_ || props.shader) return
    // _target_._primitives.forEach((pri) => {
        
    // })
})
watch(() => props.shader, (newV, oldV) => {
    // if (!_target_ || !_type_ || !newV || newV == oldV || !_isPrimitive_ || !props.custom) return
    // _target_._primitives.forEach((pri) => {

    // })
})
</script>

<style lang="scss" scoped></style>