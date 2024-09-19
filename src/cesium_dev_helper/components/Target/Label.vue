<script setup>
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { inject } from 'vue';
import * as Cesium from 'cesium'

const $bus = inject('$bus')
const layerNameProp = inject('layerNameProp')
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
    },
    collection: {
        type: Cesium.PrimitiveCollection,
        default: null
    }
})

$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
    collection = new Cesium.LabelCollection()
})


const create = (info) => {
    // Add a label to the collection
    const label = collection.add({
        position: info.position,
        text: info.text,  // The text to display
        font: '10px sans-serif', // Font size and type
        fillColor: Cesium.Color.WHITE,  // Text color
        outlineColor: Cesium.Color.BLACK,  // Outline color for better readability
        outlineWidth: 2,  // Outline width
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,  // Style to use both fill and outline
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,  // Anchor point at the bottom
        pixelOffset: new Cesium.Cartesian2(0, -50)  // Offset to adjust position in screen space
    });
}

let timer
onMounted(() => {
    timer = setTimeout(() => {
        let timer2 = setInterval(() => {
            if (props.options.length) {
                // console.log(props.options, '=============================');
                props.options.forEach(item => {
                    create(item)
                })
                _viewer_.scene.primitives.add(collection);
                //     destination: props.center,
                //     duration: 2
                // });
                clearInterval(timer2)
            }
        }, 1)
    }, 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})





</script>