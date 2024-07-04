import { providerTypes, terrainProviderTypes, imageryProviderTypes, viewerProperties } from "./CONST";

// 加速查找操作，因为 Set 的查找时间复杂度为 O(1)
const _providerTypes = new Set(providerTypes);
const _viewerProperties = new Set(viewerProperties);
const _terrainProviderTypes = new Set(terrainProviderTypes);
const _imageryProviderTypes = new Set(imageryProviderTypes);


/**
 * Validates if the given input is a valid 3D Cartesian coordinate.
 *
 * @param {Array} cartesian - The input to be validated.
 * @returns {boolean} - Returns true if the input is a valid 3D Cartesian coordinate, false otherwise.
 *
 * @throws Will throw an error if the input is not an array or does not contain exactly three elements.
 * @throws Will throw an error if any of the elements in the array are not numbers.
 *
 */
export function isValidCartesian3(cartesian) {
    return typeof cartesian.x === 'number' && typeof cartesian.y === 'number' && typeof cartesian.z === 'number';
}

/**
 * 判断对象是否为Cesium地理坐标
 * @param {object} coord - 要检查的对象
 * @returns {boolean} 如果对象是Cesium地理坐标则返回true，否则返回false
 */
export function isValidCartographic(coord) {
    if (typeof coord !== 'object' || coord === null) {
        return false;
    }

    const hasLongitude = typeof coord.longitude === 'number';
    const hasLatitude = typeof coord.latitude === 'number';
    const hasOptionalHeight = typeof coord.height === 'undefined' || typeof coord.height === 'number';

    return hasLongitude && hasLatitude && hasOptionalHeight;
}







/**
 * Validates if the given input is a valid Cesium provider.
 *
 * @param {Object} provider - The Cesium provider to be validated.
 * @returns {boolean} - Returns true if the input is a valid Cesium provider, false otherwise.
 *
 * @throws Will throw an error if the input is not an object.
 *
 * @example
 * // Example usage:
 * const provider = new Cesium.ArcGisMapServerImageryProvider({
 *   url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
 * });
 *
 * if (isValidProvider(provider)) {
 *   console.log('The provider is valid.');
 * } else {
 *   console.log('The provider is not valid.');
 * }
 */
export function isValidProvider(provider) {
    return _providerTypes.has(provider.constructor.name);
}



/**
 * Validates if the given input is a valid Cesium terrain provider.
 *
 * @param {string} string - The string representing the terrain provider to be validated.
 * @returns {boolean} - Returns true if the input is a valid Cesium terrain provider, false otherwise.
 *
 * @throws Will throw an error if the input is not a string.
 *
 * @example
 * // Example usage:
 * const terrainProvider = 'CesiumTerrainProvider';
 *
 * if (isValidTerrianProvider(terrainProvider)) {
 *   console.log('The terrain provider is valid.');
 * } else {
 *   console.log('The terrain provider is not valid.');
TypeType
 */
export function isValidTerrianProviderType(string) {
    return _terrainProviderTypes.has(string);
}


/**
 * Validates if the given input is a valid viewer property.
 *
 * @param {string} string - The string representing the viewer property to be validated.
 * @returns {boolean} - Returns true if the input is a valid viewer property, false otherwise.
 *
 * @throws Will throw an error if the input is not a string.
 *
 * @example
 * // Example usage:
 * const viewerProperty = 'sceneMode';
 *
 * if (isValidViewerProperty(viewerProperty)) {
 *   console.log('The viewer property is valid.');
 * } else {
 *   console.log('The viewer property is not valid.');
 * }
 */
export function isValidViewerProperty(string) {
    return _viewerProperties.has(string);
}


/**
 * Validates if the given input is a valid Cesium imagery provider.
 *
 * @param {string} string - The string representing the imagery provider to be validated.
 * @returns {boolean} - Returns true if the input is a valid Cesium imagery provider, false otherwise.
 *
 * @throws Will throw an error if the input is not a string.
 *
 * @example
 * // Example usage:
 * const imageryProvider = 'ArcGisMapServerImageryProvider';
 *
 * if (isValidImageryProvider(imageryProvider)) {
 *   console.log('The imagery provider is valid.');
 * } else {
 *   console.log('The imagery provider is not valid.');
 * }
 */
export function isValidImageryProviderType(string) {
    return _imageryProviderTypes.has(string);
}
