<script setup>
import * as Cesium from 'cesium'
import { onBeforeUnmount, watch, createVNode, render } from 'vue';
const $bus = inject('$bus')
const $bus_Entity = inject('$bus_Entity')
let _editor_, _viewer_, _eM_
$bus.on('czmEntityEvent@henrifox', ({ viewer, editor, eM }) => {
    _viewer_ = viewer
    _editor_ = editor
    _eM_ = eM
})
// 定义多边形的顶点坐标
const polygonPositions = Cesium.Cartesian3.fromDegreesArray([
    -75.10, 39.57, // 第一个顶点
    -75.10, 39.77, // 第二个顶点
    -75.40, 39.77, // 第三个顶点
    -75.40, 39.57  // 第四个顶点
]);
// 内部孔的顶点坐标
const holePositions = Cesium.Cartesian3.fromDegreesArray([
    -75.25, 39.65,
    -75.25, 39.70,
    -75.35, 39.70,
    -75.35, 39.65
]);
const defHierachy = new Cesium.PolygonHierarchy(polygonPositions, [holePositions]);
const props = defineProps({
    hierarchy: {
        type: Object,
        default: () => null
    },
    extraOpt: {
        type: Object,
        default: () => ({
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.0),
            translucencyByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.0),
            disableDepthTestDistance: 1000 // 在1000米内禁用深度测试
        })
    },
    material: {
        type: Object,
        default: () => Cesium.Color.RED.withAlpha(0.5),
    },
    zoom: {
        type: Boolean,
        default: true
    },
    three: {
        type: Boolean,
        default: false
    },
})

let curSec = 0;
let timer1, timer2
let curEntity

const hierarchyProp = props.hierarchy
const extraOptProp = props.extraOpt
const materialProp = props.material
const zoomProp = props.zoom
const createDynamicPolygon = (_viewer_) => {
    curEntity && _viewer_.entities.remove(curEntity)
    const entity = _viewer_.entities.add({
        name: 'Polygon@henrifox' + Date.now(),
        polygon: {
            hierarchy: hierarchyProp || defHierachy,
            material: materialProp,
            ...extraOptProp
        },
        properties: {
            meta: 'Some additional meta information',
            html: `<p>Polygon</p>`
        },
    });
    curEntity = entity
    $bus_Entity.emit('entityCreatedEvent@henrifox', { entity, type: 'polygon' })
    zoomProp && _viewer_.zoomTo(entity);
}


const bindEvent = (eM, type) => {
    if (type = 'popup') {
        eM.onMouseDoubleClick((e, pickedObjectPos, pickedObject) => {
            if (Cesium.defined(pickedObject)) {
                if (pickedObject.primitive instanceof Cesium.PointPrimitive) {
                    const primitive = pickedObject.primitive;
                    const entity = pickedObject.id;
                    $bus_Entity.emit('popupInfoEvent@henrifox', { entity, primitive, isPicked: true })
                }
            } else {
                $bus_Entity.emit('popupInfoEvent@henrifox', { isPicked: false })
                console.log('No object picked.');
            }
        }
        )
    }
}

onMounted(() => {
    timer1 = setInterval(() => {
        curSec++
    }, 1000)
    timer2 = setTimeout(() => {
        createDynamicPolygon(_viewer_)
        bindEvent(_eM_, 'popup')
    }, 0)
})
watch(() => props, (newV) => {
    curEntity && _viewer_.entities.remove(curEntity)
    createDynamicPolygon(_viewer_)
}, { deep: true })

onBeforeUnmount(() => {
    clearInterval(timer1)
    clearTimeout(timer2)
})
</script>

<style lang="scss" scoped></style>