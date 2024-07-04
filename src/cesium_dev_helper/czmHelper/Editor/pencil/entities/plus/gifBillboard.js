import { gifLoader } from '../../Data';
import * as Cesium from "cesium";
import { CoordTransformer } from "../../../../Compute";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";


export function GifBillboardEntity(extraOption, options, datasource) {
    if (options && options.position) {
        let gif = [],
            url = options.url,
            slow = 6
        const imageProperty = gifLoader(url, gif, slow, '')
        let entity = createGraphics()
        entity.position = options.position
        entity.billboard = {
            verticalOrigin: Cesium.VerticalOrigin.BASELINE,
            image: imageProperty,
            scale: 0.2
        }
        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}