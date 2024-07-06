import {
    gifLoader,
    Cesium,
    CoordTransformer,
    objHasOwnProperty,
    setProperties,
    createGraphics,
} from './index';

/**
 * Creates a GIF billboard entity in the Cesium 3D globe.
 *
 * @param {Object} extraOption - Additional options to be merged with the entity.
 * @param {Object} options - Options for the GIF billboard entity.
 * @param {Cesium.Cartesian3} options.position - The position of the billboard.
 * @param {string} options.url - The URL of the GIF image.
 * @param {Cesium.DataSource} datasource - The Cesium data source to add the entity to.
 *
 * @returns {Cesium.Entity} The created GIF billboard entity.
 */
export function GifBillboardEntity(extraOption, options, datasource) {
    if (options && options.position) {
        let gif = [],
            url = options.url,
            slow = 6
        const imageProperty = gifLoader(url, gif, slow, '')
        let entity = {}
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