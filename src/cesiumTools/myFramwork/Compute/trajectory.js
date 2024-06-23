/**
 * Generates the coordinates of the points on the circumference of a circle.
 * @param {number[]} center - The center of the circle [longitude, latitude].
 * @param {number} radius - The radius of the circle in meters.
 * @returns {number[][]} An array of [longitude, latitude] pairs representing the points on the circumference.
 */
export const generateCirclePoints = (center, radius) => {
    let points = [];
    for (let i = 0; i <= 360; i += 2) {
        points.push(getCirclePoint(center[0], center[1], i, radius));
    }
    return points;
};

/**
 * Computes the coordinates of a point on the circumference of a circle given the angle and radius.
 * @param {number} lon - The longitude of the center of the circle.
 * @param {number} lat - The latitude of the center of the circle.
 * @param {number} angle - The angle in degrees.
 * @param {number} radius - The radius of the circle in meters.
 * @returns {number[]} The [longitude, latitude] coordinates of the point on the circumference.
 */
export const getCirclePoint = (lon, lat, angle, radius) => {
    let dx = radius * Math.sin((angle * Math.PI) / 180.0);
    let dy = radius * Math.cos((angle * Math.PI) / 180.0);
    let ec = 6356725 + ((6378137 - 6356725) * (90.0 - lat)) / 90.0;
    let ed = ec * Math.cos((lat * Math.PI) / 180);
    let newLon = ((dx / ed + (lon * Math.PI) / 180.0) * 180.0) / Math.PI;
    let newLat = ((dy / ec + (lat * Math.PI) / 180.0) * 180.0) / Math.PI;
    return [newLon, newLat];
};

/**
 * Converts 2D points to 3D positions.
 * @param {number[][]} points - An array of [longitude, latitude] pairs.
 * @param {number} height - The height to be applied to each point.
 * @returns {Array<Cesium.Cartesian3>} An array of Cesium.Cartesian3 positions.
 */
export const pointsToPositions = (points, height) => {
    let positions = [];
    points.map((item) => {
        positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], height));
    });
    return positions;
};

/**
 * Flattens an array of objects with lng and lat properties to an array of numbers.
 * @param {Array<{lng: number, lat: number}>} paths - An array of objects with lng and lat properties.
 * @returns {number[]} An array of numbers representing the flattened positions.
 */
export const flattenPositions = (paths) => {
    const result = [];
    paths.forEach((path) => {
        result.push(path.lng, path.lat);
    });
    return result;
};

/**
 * Converts an array of objects with lng and lat properties to an array of Cesium.Cartesian3 positions.
 * @param {Array<{lng: number, lat: number}>} paths - An array of objects with lng and lat properties.
 * @param {number} [defaultHeight=0] - The default height to be applied to each position.
 * @returns {Array<Cesium.Cartesian3>} An array of Cesium.Cartesian3 positions.
 */
export const getPositions = (paths, defaultHeight = 0) => {
    return paths.map(path => {
        const { lng, lat } = path;
        return Cesium.Cartesian3.fromDegrees(lng, lat, defaultHeight);
    });
};

/**
 * Calculates the time and total time for each point in the array based on the given speed.
 * @param {Array<Cesium.Cartesian3>} pArr - An array of Cesium.Cartesian3 points.
 * @param {number} speed - The speed at which to travel between points.
 * @returns {{timeSum: number, siteTimes: number[]}} The total time and an array of times for each point.
 */
export const getSiteTimes = (pArr, speed) => {
    let timeSum = 0, times = [];
    for (var i = 0; i < pArr.length; i++) {
        if (i === 0) {
            times.push(0); // The time for the first point is 0
            continue;
        }
        // Calculate total time
        timeSum += spaceDistance([pArr[i - 1], pArr[i]]) / speed;
        // Collect the time for each segment
        times.push(timeSum);
    }
    return {
        timeSum: timeSum,
        siteTimes: times,
    };
};

/**
 * Calculates the total distance between an array of positions.
 * @param {Array<Cesium.Cartesian3>} positions - An array of Cesium.Cartesian3 positions.
 * @returns {number} The total distance in meters.
 */
export const spaceDistance = (positions) => {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
        let s = Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
        distance += s;
    }
    return distance.toFixed(2);
};
