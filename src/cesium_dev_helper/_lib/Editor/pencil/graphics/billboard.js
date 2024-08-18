import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createEntity } from "./index";
export function BillboardGraphics(options = {}) {
    if (options.img) {
        return new Cesium.BillboardGraphics({
            ...options,
            image: options.img,
            width: options.width || 35,
            height: options.height || 35,
            clampToGround: options.clampToGround || true,
            scale: options.scale || 1,
            // eyeOffset :new Cesium.Cartesian2(0, -20),
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -20),
            scaleByDistance: options.scaleByDistance || undefined
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}