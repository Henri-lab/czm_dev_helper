import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";

export function EllipsoidGraphics(options = {}) {
        let r = options.radii || 1000000.0 //默认100公里
        return new Cesium.EllipsoidGraphics({
            ...options,
            radii: new Cesium.Cartesian3(r, r, r), //单位 米
            innerRadii: objHasOwnProperty(
                options,
                'innerRadii',
                new Cesium.Cartesian3(r / 1.5, r / 1.5, r / 1.5)
            ),
            maximumCone: options.maximumCone || Cesium.Math.PI_OVER_TWO,
            stackPartitions: options.stackPartitions || 56,
            slicePartitions: options.slicePartitions || 56,
            outlineWidth: options.outlineWidth || 2.0,
            outlineColor: options.outlineColor || Cesium.Color.YELLOW,
            outline: objHasOwnProperty(options, 'outline', true),
            fill: objHasOwnProperty(options, 'fill', true),
            material: options.material || Cesium.Color.RED.withAlpha(0.1)
            //heightReference:Cesium.HeightReference.NONE,
        })
}
