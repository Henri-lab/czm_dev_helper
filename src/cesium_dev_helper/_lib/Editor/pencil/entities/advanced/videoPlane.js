import {
    gifLoader,
    Cesium,
    CoordTransformer,
    objHasOwnProperty,
    setProperties,
    createGraphics,
} from './index';

export function VideoPlaneEntity(extraOption, options, datasource) {
    if (options && options.position) {
        let entity = {}
        entity.position = options.position
        entity.plane = {
            plane: new Cesium.Plane(
                options.normal || Cesium.Cartesian3.UNIT_Y,
                0.0
            ),
            dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
            material: new Cesium.ImageMaterialProperty({
                image: options.videoElement
            })
        }
        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}