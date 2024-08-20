import { useMapStore } from "@/stores/mapStore";

const mapStore = useMapStore()


// --openLayer objects
let gdXYZ = new ol.source.XYZ({
    title: mapStore.gdXYZ_title,
    url: mapStore.gdXYZ_url,
    wrapX: mapStore.gdXYZ_wrapX
})
let gdTile = new ol.layer.Tile({
    title: mapStore.gdTile_title,
    source: gdXYZ
})
let defaultView = new ol.View({
    center: ol.proj.fromLonLat([mapStore.longtitude, mapStore.latitude]),
    zoom: mapStore.zoom,
    minZoom: mapStore.minZoom
})

let $map
module.exports = $map
exports.loadMap = async function loadMap(title, target) {
    return new Promise((resolve, reject) => {
        try {
            $map = new ol.Map({
                title,
                target,
                view: defaultView,
                layers: [gdTile]
            });
            resolve($map);
        } catch (err) {
            reject('$map is not valid')
            console.error('Failed to create map:', err)
        }
    });
};











