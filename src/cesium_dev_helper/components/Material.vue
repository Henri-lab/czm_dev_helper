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
let defImgMaterial = new Cesium.ImageMaterialProperty({
    image: props.image,
    repeat: new Cesium.Cartesian2(1.0, 1.0), // 重复次数
    transparent: false
})
// 自定义顶点着色器
const vertexShader = `
    attribute vec3 position;
    varying vec3 v_position;

    void main() {
        v_position = position;
        gl_Position = czm_modelViewProjection * vec4(position, 1.0);
    }
`;

// 自定义片段着色器
const fragmentShader = `
    varying vec3 v_position;

    void main() {
        gl_FragColor = vec4(v_position, 1.0); // 简单的颜色输出
    }
`;


let _entity_, _type_
$bus_Entity.on('materialEvent@henrifox', ({ entity, type }) => {
    _entity_ = entity
    _type_ = type
    if (props.custom) {
      
        return
    }
    if (props.img) _entity_[_type_?.toLowerCase()].material = defImgMaterial
})

watch(() => props.image, (newV, oldV) => {
    if (!newV || newV == oldV) return
    _entity_ &&
        (_entity_[_type_?.toLowerCase()].material = new Cesium.ImageMaterialProperty({
            image: newV,
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: false
        }))
})
</script>

<style lang="scss" scoped></style>