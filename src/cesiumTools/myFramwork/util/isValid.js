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