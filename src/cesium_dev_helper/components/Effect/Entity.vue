<template>
    <div>

    </div>
</template>

<script setup>
import DynamicColorProperty from '../../lib/Custom/Property/DynamicColorProperty';
import * as Cesium from 'cesium'
const $bus = inject('$bus')
let _editor_, _viewer_
$bus.on('czmEntityEvent@henrifox', ({ viewer, editor }) => {
    _editor_ = editor
    _viewer_ = viewer

})

onMounted(() => {
    setTimeout(() => {
        console.log(_viewer_, 'czm-entity')
        // 定义动态颜色变化函数
        const colorDefinition = function (time) {
            const julianDate = Cesium.JulianDate.toDate(time);
            const seconds = julianDate.getSeconds();

            // 根据时间计算颜色（例如，每秒在红、绿、蓝之间切换）
            if (seconds % 3 === 0) {
                return Cesium.Color.RED;
            } else if (seconds % 3 === 1) {
                return Cesium.Color.GREEN;
            } else {
                return Cesium.Color.BLUE;
            }
        };

        // 创建一个动态颜色属性
        const dynamicColorProperty = new DynamicColorProperty(colorDefinition);

        // 添加一个带有动态颜色的实体
        const entity = _viewer_.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            point: {
                pixelSize: 100,
                color: dynamicColorProperty, // 使用动态颜色属性
            }
        });
        // const colorProperty = new Cesium.ColorMaterialProperty(dynamicColorProperty);
        // entity.material = colorProperty;
        // 调整相机位置到实体
        _viewer_.zoomTo(entity);

        // 确保 Cesium 渲染循环正确地更新颜色
        _viewer_.scene.preRender.addEventListener(function (scene, time) {
            // 强制更新属性值
            dynamicColorProperty.getValue(time);
        });
    }, 0)

})

</script>

<style lang="scss" scoped></style>