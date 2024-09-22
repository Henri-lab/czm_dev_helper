<template></template>
<script setup>
import { EventManager } from '../../lib/Manager';
import * as Cesium from 'cesium'
import { onBeforeUnmount, watch, createVNode, render } from 'vue';
const props = defineProps({
    // 单个实体多边形渲染
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
        default: false
    },
    three: {
        type: Boolean,
        default: false
    },
    // 大量多边形图元点渲染
    performance: {
        type: Boolean,
        default: false
    },
    test: {
        type: Boolean,
        default: false
    },
    polygons: {
        type: Array,
        default: () => ([])
    }
})
const hierarchyProp = props.hierarchy
const extraOptProp = props.extraOpt
const materialProp = props.material
const zoomProp = props.zoom

const $bus = inject('$bus')
const $bus_Entity = inject('$bus_Entity')
const layerNameProp = inject('layerNameProp')
let _editor_, _viewer_, _eM_, _lM_, primitiveCollection;
let curEntity
$bus.on('czmEntityEvent@henrifox', ({ viewer, editor, eM, lM }) => {
    _viewer_ = viewer
    _editor_ = editor
    _eM_ = eM
    _lM_ = lM
    primitiveCollection = _viewer_.scene.primitives.add(new Cesium.PrimitiveCollection());
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


let curSec = 0;
let timer1, timer2
const appearance = new Cesium.PerInstanceColorAppearance({
    translucent: true,
    closed: true
});
let curDatasource
const createDynamicPolygon = (_viewer_, layerName) => {
    if (!_viewer_) return
    primitiveCollection.removeAll();
    curDatasource = _lM_.getDatasourceByName(layerName) || _viewer_
    curEntity && curDatasource.entities.remove(curEntity)
    if (props.performance) {
        if (props.test) {
            createTestData(primitiveCollection, 1000)
        } else if (props.polygons[0]) {
            let positionArr = []
            let instances = []
            let instances2 = []
            props.polygons.forEach(poly => {
                positionArr.push(poly.positions)
                const polygonGeometry = new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(poly.positions),
                    height: poly.height || 0,
                    extrudedHeight: poly.extrudedHeight || 0,
                    perPositionHeight: poly.perPositionHeight || false,
                    closeTop: poly.closeTop || true,
                    closeBottom: poly.closeBottom || true,
                    arcType: poly.arcType || Cesium.ArcType.GEODESIC,
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT // 顶点格式
                });
                const geometryInstance = new Cesium.GeometryInstance({
                    geometry: polygonGeometry,
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(parsedColor(poly.color)),
                        batchId: new Cesium.GeometryInstanceAttribute({
                            componentDatatype: Cesium.ComponentDatatype.UNSIGNED_SHORT,
                            componentsPerAttribute: 1,
                            value: [0, 1] // Example batchIds for different instances
                        })
                    }
                });
                instances.push(geometryInstance);
                // const geometryInstance2 = new Cesium.GeometryInstance({
                //     geometry: polygonGeometry,
                //     attributes: {
                //         color: Cesium.ColorGeometryInstanceAttribute.fromColor(parsedColor(poly.color)),
                //         batchId: ?
                //     }
                // });
                // instances2.push(geometryInstance2);

            });
            let pri1 = new Cesium.Primitive({
                geometryInstances: instances,
                appearance: new Cesium.PerInstanceColorAppearance({
                    translucent: true,
                    closed: true
                }),
                asynchronous: true
            })
            // let pri2 = new Cesium.Primitive({
            //     geometryInstances: instances2,
            //     appearance: new Cesium.PerInstanceColorAppearance({
            //         translucent: true,
            //         closed: true
            //     }),
            //     asynchronous: true
            // })
            primitiveCollection.add(pri1);
            // primitiveCollection.add(pri2);
            props.zoom && _viewer_.camera.setView({
                destination: getCenterCart3sArr(positionArr),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0
                }
            });
            $bus_Entity.emit('entityCreatedEvent@henrifox', { target: primitiveCollection, type: 'polygon', isPrimitive: true })
        }
    } else {
        const entity = curDatasource.entities.add({
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
        $bus_Entity.emit('entityCreatedEvent@henrifox', { target: curEntity, type: 'polygon', isPrimitive: false })
        zoomProp && _viewer_.zoomTo(curEntity);
    }
}
const bindEvent = (eM, type) => {
    if (type = 'popup') {
        eM.onMouseDoubleClick((e, pickedObjectPos, pickedObject) => {
            console.log(pickedObject, 'pick')
            if (Cesium.defined(pickedObject)) {
                if (pickedObject.primitive) {
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
    if (type === 'navigation') {
        eM.onMouseClick((e) => {
            console.log(e.position)
        })
    }
}
// 测试数据：批量创建几何体并批处理
function createTestData(primitiveCollection, numPolygons) {
    const instances = [];
    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let base1 = -76, base2 = 37;
    for (let i = 0; i < numPolygons; i++) {
        // 随机生成一些经纬度点来作为多边形的顶点
        const positions = Cesium.Cartesian3.fromDegreesArray([
            base1 + random(0, 1), base2 + random(0, 1),
            base1 + random(1, 2), base2 + random(1, 2),
            base1 + random(2, 3), base2 + random(2, 3),
            base1 + random(3, 4), base2 + random(3, 4),
        ]);
        base1 += random(0, 4);
        base2 += random(0, 4);

        // 创建 PolygonGeometry
        const polygonGeometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            height: 10000,  // 多边形的高度
            extrudedHeight: 10000, // 拉伸形成 3D 多边形
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT // 顶点格式
        });

        // 创建几何体实例
        const geometryInstance = new Cesium.GeometryInstance({
            geometry: polygonGeometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    Cesium.Color.fromRandom({ alpha: 0.5 }) // 随机颜色
                )
            }
        });
        instances.push(geometryInstance); // 将实例存入数组
    }

    // 将几何体批量添加到 Primitive
    primitiveCollection.add(new Cesium.Primitive({
        geometryInstances: instances,
        appearance: appearance, // 使用共享的外观
        asynchronous: true // 异步加载以优化性能
    }));
}
function parsedColor(string) {
    if (!string) return Cesium.Color.BLUE;
    return Cesium.Color.fromCssColorString(string)
}
function getCenterCart3sArr(cart3sArr) {//Primitive没有位置属性 PointPrimitive有 
    let x = 0, y = 0, z = 0;
    let totalPoints = 0;

    cart3sArr.forEach(cart3s => {
        cart3s.forEach(cart => {
            x += cart.x;
            y += cart.y;
            z += cart.z;
            totalPoints++;
        });
    });
    return new Cesium.Cartesian3(x / totalPoints, y / totalPoints, z / totalPoints);
}
onMounted(() => {
    timer1 = setInterval(() => {
        curSec++
    }, 1000)
    timer2 = setTimeout(() => {
        createDynamicPolygon(_viewer_, layerNameProp)
        const eM_Polygon = new EventManager(_viewer_)//polygonVue内部独立维护一个事件管理器
        bindEvent(eM_Polygon, 'popup')
        bindEvent(eM_Polygon, 'navigation')
    }, 0)
})
watch(() => props, (newV) => {
    createDynamicPolygon(_viewer_, layerNameProp)
}, { deep: true })

onBeforeUnmount(() => {
    clearInterval(timer1)
    clearTimeout(timer2)
    primitiveCollection.removeAll();
    curEntity && curDatasource.entities.remove(curEntity)
})
</script>

<style lang="scss" scoped></style>