import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
import { EllipseGraphics } from "../../graphics/index";

export function BlinkCircleEntity(extraOption, options, datasource) {
    if (options && options.position) {
        let entity = createGraphics(),
            alp = options.alp || 1,
            flog = objHasOwnProperty(options, 'flog', true)
        entity.position = options.position
        options.material = options.material || new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(function () {
                if (flog) {
                    alp = alp - 0.05
                    if (alp <= 0) {
                        flog = false // hide
                    }
                } else {
                    alp = alp + 0.05
                    if (alp >= 1) {
                        flog = true // show
                    }
                }
                return Cesium.Color.RED.withAlpha(alp)
            }, false)
        )
        entity.ellipse = EllipseGraphics(options)

        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}