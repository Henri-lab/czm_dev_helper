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


let _entity_, _type_
$bus_Entity.on('materialEvent@henrifox', ({ entity, type }) => {
    _entity_ = entity
    _type_ = type
    if (props.custom) {

        return
    }
    if (props.img) _entity_[_type_?.toLowerCase()].material = new Cesium.ImageMaterialProperty({
        image: props.image,
        repeat: new Cesium.Cartesian2(1.0, 1.0), // 重复次数
        transparent: false
    })
})

// image属性生成图片材质 （开启custom则关闭）
watch(() => props.image, (newV, oldV) => {
    if (!_entity_ || !_type_ || newV == oldV) return
    if (props.custom || !newV) {
        _entity_[_type_?.toLowerCase()].material = Cesium.Color.RED.withAlpha(0.5)
        return
    }
    _entity_ &&
        (_entity_[_type_?.toLowerCase()].material = new Cesium.ImageMaterialProperty({
            image: newV,
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: false
        }))
})

//  开启custom
watch(() => props.custom, (newV, oldV) => {
    if (!_entity_ || !_type_ || newV == oldV) return
    if (newV) {
        _entity_[_type_?.toLowerCase()].material = new Cesium.CustomShader({
            uniforms: {
                u_color: {
                    type: Cesium.UniformType.VEC4,
                    value: new Cesium.Color(0, 0.0, 1.0, 1.0) 
                },
                u_time: {
                    type: Cesium.UniformType.FLOAT,
                    value: 0.0 // 用于时间动画
                }
            },
            fragmentShaderText: `
        uniform vec4 u_color;
        uniform float u_time;
        void main() {
            vec4 animatedColor = vec4(abs(sin(u_time)), u_color.g, u_color.b, 1.0);
            gl_FragColor = animatedColor; // 动态颜色动画
        }
    `
        });

    }
})
</script>

<style lang="scss" scoped></style>