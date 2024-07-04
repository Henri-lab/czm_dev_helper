import * as Cesium from "cesium";
import { CoordTransformer } from "../../../../Compute";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";

export function ShadeWallEntity(extraOption, options, datasource) {
    if (options && options.positions) {
        let alp = options.alp || 1,
            num = options.num || 20,
            color = options.color || Cesium.Color.RED,
            speed = options.speed || 0.003

        let wallEntity = createGraphics()
        wallEntity.wall = {
            positions: options.positions,
            material: new Cesium.ImageMaterialProperty({
                image: options.img || "",// 空串 --最终导致材质显示为透明或不可见
                transparent: true,
                color: new Cesium.CallbackProperty(function () {
                    if (num % 2 === 0) {
                        alp -= speed
                    } else {
                        alp += speed
                    }

                    if (alp <= 0.1) {
                        num++
                    } else if (alp >= 1) {
                        num++
                    }
                    return color.withAlpha(alp)
                }, false)
            })
        }


        const finalEntity = {
            ...extraOption,
            ...wallEntity,
        };
        return datasource.entities.add(finalEntity)
    }
}

