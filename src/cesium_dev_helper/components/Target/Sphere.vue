<script setup>
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { inject } from 'vue';
import * as Cesium from 'cesium'

const $bus = inject('$bus')
let _viewer_, collection

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    center: {
        type: Object,
        default: () => ({})
    },
    zoom: {
        type: Boolean,
        default: true
    },
    fly: {
        type: Boolean,
        default: true
    }
})

$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
    collection = new Cesium.PrimitiveCollection()
})


const create = (center, radius) => {
    const sphereGeometry = new Cesium.SphereGeometry({
        center: center,
        radius: radius,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    });
    const sphereInstance = new Cesium.GeometryInstance({
        geometry: sphereGeometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(center),
            new Cesium.Cartesian3(0.0, 0.0, radius / 2.0),
            new Cesium.Matrix4()
        ),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.RED.withAlpha(0.5)
            )
        }
    });
    const primitive = new Cesium.Primitive({
        geometryInstances: sphereInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
            closed: true,
            translucent: true
        })
    });
    collection.add(primitive);
}

let timer
onMounted(() => {
    timer = setTimeout(() => {
        console.log('sphere mounted');
        let timer2 = setInterval(() => {
            if (props.options.length) {
                // console.log(props.options, '=============================');
                // props.options.forEach(item => {
                //     create(item.center, item.radius)
                // })
                _viewer_.scene.primitives.add(collection);
                props.fly && _viewer_.camera.flyTo({
                    destination: props.center,
                    duration: 2
                });
                clearInterval(timer2)
            }
        }, 1)
    }, 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})





</script>