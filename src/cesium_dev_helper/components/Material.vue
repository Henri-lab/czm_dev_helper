<script setup>
const $bus_Entity = inject('$bus_Entity')
let material = new Cesium.ImageMaterialProperty({
    image: 'images/img1.jpg',
    repeat: new Cesium.Cartesian2(1.0, 1.0), // 重复次数
    transparent: false
})
let _entity_
$bus_Entity.on('materialEvent@henrifox', (entity) => {
    _entity_ = entity
    _entity_.point.material = material
    console.log(_entity_.point)
})

</script>

<style lang="scss" scoped></style>