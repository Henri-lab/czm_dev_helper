import { providerTypes } from "./CONST";

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

// 加速查找操作，因为 Set 的查找时间复杂度为 O(1)
const providerAllTypes = new Set(providerTypes);


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
    return providerAllTypes.has(provider.constructor.name);
}