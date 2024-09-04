import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function LineGraphics(options = {}) {

    // test
    // const opt = {
    //     ...options,
    //     show: true,
    //     positions: options.positions,
    //     material: options.material || Cesium.Color.YELLOW,
    //     width: options.width || 1,
    //     clampToGround: objHasOwnProperty(options, 'clampToGround', false)
    // }
    // const lg = new Cesium.PolylineGraphics(opt)
    // console.log('lineGraphics', lg, opt)

    return new Cesium.PolylineGraphics({
        ...options,
        show: true,
        positions: options.positions || [],
        material: options.material || Cesium.Color.YELLOW,
        width: options.width || 1,
        clampToGround: objHasOwnProperty(options, 'clampToGround', false)
    })
}

// polyline options
// {
//     show ?: Property | boolean;
//     positions ?: Property | Cartesian3[];
//     width ?: Property | number;
//     granularity ?: Property | number;
//     material ?: MaterialProperty | Color;
//     depthFailMaterial ?: MaterialProperty | Color;
//     arcType ?: Property | ArcType;
//     clampToGround ?: Property | boolean;
//     shadows ?: Property | ShadowMode;
//     distanceDisplayCondition ?: Property | DistanceDisplayCondition;
//     classificationType ?: Property | ClassificationType;
//     zIndex ?: Property | number;
// }