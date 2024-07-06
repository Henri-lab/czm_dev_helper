import {
    gifLoader,
    Cesium,
    CoordTransformer,
    objHasOwnProperty,
    setProperties,
    createGraphics,
} from './index';

/**
 * Creates a blinking circle entity in Cesium.
 *
 * @param {Object} extraOption - Additional options to be merged with the final entity.
 * @param {Object} options - Options for the circle entity.
 * @param {Cesium.Cartesian3} options.position - The position of the circle.
 * @param {Number} [options.alp=1] - Initial alpha value for the circle.
 * @param {Boolean} [options.flog=true] - Flag to control the blinking behavior.
 * @param {Cesium.MaterialProperty} [options.material] - Material property for the circle.
 * @param {Object} datasource - The Cesium datasource to add the entity to.
 *
 * @returns {Cesium.Entity} The created circle entity.
 */
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