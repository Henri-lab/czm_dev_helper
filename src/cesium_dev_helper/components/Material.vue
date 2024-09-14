<script setup>
import * as Cesium from 'cesium'
import { onMounted } from 'vue';
import test from '../lib/Custom/Materials/test'
const props = defineProps({
    image: {
        type: String,
        default: ''
    },
    custom: {
        type: Boolean,
        default: false
    },
    material: {
        type: Object,
        default: null
    },
    update: {
        type: Function,
        default: null
    },
    shader: {
        type: Object,
        default: null
    },
    extraOpt: {
        type: Object,
        default: () => ({})
    }
})

const $bus_Entity = inject('$bus_Entity')
const $bus = inject('$bus')
let _viewer_
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
})
const handelShaderProp = () => {
    if (props.shader) {
        console.log(_target_)
        // _target_._primitives[0].readyPromise.then(res => console.log(res))
        // _target_._primitives.forEach((pri) => {
        //     pri.appearance = new Cesium.EllipsoidSurfaceAppearance({
        //         fragmentShaderSource: props.shader.fragmentShaderText,
        //         vertexShaderSource: props.shader.vertexShaderText
        //     })
        // })
        // _viewer_.clock.onTick.addEventListener(() => props.update());
        return
    }
}
const handelMaterialProp = () => {
    if (props.material) {
        _target_._primitives.forEach((pri) => {
            pri.appearance = new Cesium.MaterialAppearance({
                material: props.material,
                ...props.extraOpt,
            })
        })
        if (!props.update) return
        _viewer_.clock.onTick.addEventListener(() => props.update(/* sth want */));
        return
    }
}
const handleImgProp = (url) => {
    if (!_target_ || !_type_ || !props.image) return
    _target_[_type_.toLowerCase()].material = new Cesium.ImageMaterialProperty({
        image: url,
        repeat: new Cesium.Cartesian2(1.0, 1.0),
        transparent: false
    })
    return
}

let _target_, _type_, _isPrimitive_
$bus_Entity.on('materialEvent@henrifox', ({ target, type, isPrimitive }) => {
    _target_ = target
    _type_ = type
    _isPrimitive_ = isPrimitive
    if (!_target_ || !_type_) return
    if (_isPrimitive_ && props.custom) {
        handelShaderProp()
        handelMaterialProp()
    }
    handleImgProp(props.image)
})

onMounted(() => {
    console.log(Cesium.Material._materialCache)
})


// image属性生成图片材质 优先级低于custom
watch(() => props.image, (newV, oldV) => {
    if (!_target_ || !_type_ || !newV || newV == oldV) return
    if (props.custom) return
    !_isPrimitive_ && handleImgProp(newV)
})
//  开启custom,并且目标为primitive 时，使用自定义shader材质
watch(() => props.material, (newV, oldV) => {
    if (!_target_ || !_type_ || !newV || newV == oldV) return
    _isPrimitive_ && newV instanceof Cesium.Material && handelMaterialProp()
})
watch(() => props.shader, (newV, oldV) => {
    if (!_target_ || !_type_ || !newV || !newV || newV == oldV) return
    _isPrimitive_ && newV instanceof Cesium.CustomShader && handelShaderProp()
})
</script>

<style lang="scss" scoped></style>