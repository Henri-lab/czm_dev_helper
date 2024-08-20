import { coordinatesByAddress } from "./coordinatesByAddress";

export async function getView_zoomToAddress(address, { zoom, projection, minZoom, maxZoom, rotation }) {
    const coordinates = await coordinatesByAddress(address);
    return new ol.View({
        center: ol.proj.fromLonLat(coordinates),
        zoom: zoom || 5,
        projection: projection || 'EPSG:3857',
        minZoom: minZoom || 0,
        maxZoom: maxZoom || 20,
        rotation: rotation || 0,
    })
}
