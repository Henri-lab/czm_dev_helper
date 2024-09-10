<script setup>
const props = defineProps({
    image: {
        type: String,
        default: ''
    },
    custom: {
        type: Object,
        default: () => ({})
    }
})
const imgProp = props.image
const $bus_Entity = inject('$bus_Entity')
let imgMaterial = new Cesium.ImageMaterialProperty({
    image: imgProp,
    repeat: new Cesium.Cartesian2(1.0, 1.0), // 重复次数
    transparent: false
})
let _entity_
$bus_Entity.on('materialEvent@henrifox', ({ entity, type }) => {
    _entity_ = entity
    imgProp &&
        (_entity_[type?.toLowerCase()].material = imgMaterial)
})

</script>

<style lang="scss" scoped></style>