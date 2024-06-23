
export function isValidCartesian(cartesian) {
    return Array.isArray(cartesian) && cartesian.length === 3 && typeof cartesian.x === 'number' && typeof cartesian.y === 'number' && typeof cartesian.z === 'number';
}