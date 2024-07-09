import * as Cesium from "cesium";
import { isValidCartesian3, isValidCartographic } from '../util/isValid';

class CoordTransformer {
    constructor() {
        this.BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
        this.PI = 3.1415926535897932384626;
        this.RADIUS = 6378245.0;
        this.EE = 0.00669342162296594323;
    }

    /**
     * BD-09 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    BD09ToGCJ02(lng, lat) {
        let x = +lng - 0.0065;
        let y = +lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.BD_FACTOR);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.BD_FACTOR);
        let gg_lng = z * Math.cos(theta);
        let gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    /**
     * GCJ-02 To BD-09
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    GCJ02ToBD09(lng, lat) {
        lat = +lat;
        lng = +lng;
        let z =
            Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.BD_FACTOR);
        let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.BD_FACTOR);
        let bd_lng = z * Math.cos(theta) + 0.0065;
        let bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }

    /**
     * WGS-84 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    WGS84ToGCJ02(lng, lat) {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d = this.delta(lng, lat);
            return [lng + d[0], lat + d[1]];
        }
    }

    /**
     * GCJ-02 To WGS-84
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    GCJ02ToWGS84(lng, lat) {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d = this.delta(lng, lat);
            let mgLng = lng + d[0];
            let mgLat = lat + d[1];
            return [lng * 2 - mgLng, lat * 2 - mgLat];
        }
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    delta(lng, lat) {
        let dLng = this.transformLng(lng - 105, lat - 35);
        let dLat = this.transformLat(lng - 105, lat - 35);
        const radLat = (lat / 180) * this.PI;
        let magic = Math.sin(radLat);
        magic = 1 - this.EE * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLng = (dLng * 180) / ((this.RADIUS / sqrtMagic) * Math.cos(radLat) * this.PI);
        dLat = (dLat * 180) / (((this.RADIUS * (1 - this.EE)) / (magic * sqrtMagic)) * this.PI);
        return [dLng, dLat];
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    transformLng(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret =
            300.0 +
            lng +
            2.0 * lat +
            0.1 * lng * lng +
            0.1 * lng * lat +
            0.1 * Math.sqrt(Math.abs(lng));
        ret +=
            ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin((lng / 3.0) * this.PI)) * 2.0) /
            3.0;
        ret +=
            ((150.0 * Math.sin((lng / 12.0) * this.PI) +
                300.0 * Math.sin((lng / 30.0) * this.PI)) *
                2.0) /
            3.0;
        return ret;
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    transformLat(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret =
            -100.0 +
            2.0 * lng +
            3.0 * lat +
            0.2 * lat * lat +
            0.1 * lng * lat +
            0.2 * Math.sqrt(Math.abs(lng));
        ret +=
            ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin((lat / 3.0) * this.PI)) * 2.0) /
            3.0;
        ret +=
            ((160.0 * Math.sin((lat / 12.0) * this.PI) +
                320 * Math.sin((lat * this.PI) / 30.0)) *
                2.0) /
            3.0;
        return ret;
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    out_of_china(lng, lat) {
        lat = +lat;
        lng = +lng;
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }



    /**
     * Gets the Cartesian coordinates from a screen position using the provided Cesium viewer.
     *
     * @param {Cartesian2} screenPosition - The screen position to convert.
     * @param {Viewer} viewer - The Cesium viewer instance.
     * @returns {Cartesian3|null} The Cartesian coordinates corresponding to the screen position, or null if the conversion failed.
     */
    getCartesianFromScreenPosition(screenPosition, viewer) {
        let scene = viewer.scene;
        let ellipsoid = scene.globe.ellipsoid;

        // Convert the screen position to Cartesian coordinates
        let cartesian = viewer.camera.pickEllipsoid(screenPosition, ellipsoid);
        if (cartesian) {
            return cartesian;
        }

        return null;
    }


    /**
     * Transforms a Cartesian position to WGS84 coordinates.
     *
     * @param {Cartesian3} cartesianPosition - The Cartesian position to transform.
     * @returns {Cartesian3} The WGS84 coordinates.
     */
    static transformCartesianToWGS84(cartesianPosition) {
        if (!isValidCartesian3(cartesianPosition)) return null;
        const cartographic = Cesium.Cartographic.fromCartesian(cartesianPosition);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        return {
            longitude: longitude,
            latitude: latitude,
            height: height
        };
    }

    /**
     * Transforms a WGS84 position to Cartesian coordinates.
     *
     * @param {Object} wgs84Position - The WGS84 position to transform.
     * @param {number} wgs84Position.longitude - The longitude in degrees.
     * @param {number} wgs84Position.latitude - The latitude in degrees.
     * @param {number} wgs84Position.height - The height in meters.
     * @returns {Cartesian3} The Cartesian coordinates.
     */
    static transformWGS84ToCartesian(wgs84Position) {
        if (!isValidCartographic(wgs84Position)) return null;
        const longitude = wgs84Position.longitude;
        const latitude = wgs84Position.latitude;
        const height = wgs84Position.height;
        return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    }

    /**
     * 将Cartesian3位置转换为WGS84坐标
     * 可以输入数组
     * @function
     * @param {Array|Cesium.Cartesian3} cartesianPosition - Cartesian3位置
     * @returns {Array|Cesium.Cartesian3} WGS84坐标
     */
    static transformCartesian3ToCartographic(cartesianPosition) {
        if (!Array.isArray(cartesianPosition))
            return CoordTransformer.transformCartesianToWGS84(cartesianPosition);
        else {
            let result = []
            cartesianPosition.forEach(cartesian => result.push(this.transformCartesianToWGS84(cartesian)))
            return result
        }
    }


    /**
    * 将WGS84坐标转换Cartesian3位置
    * 可以输入数组
    * @function
    * @param {Array|Cesium.Cartesian3} wgs84Position - WGS84坐标
    * @returns {Array|Cesium.Cartesian3} Cartesian3位置
    */
    static transformCartographicToCartesian3(wgs84Position) {
        if (!Array.isArray(wgs84Position))
            return CoordTransformer.transformWGS84ToCartesian(wgs84Position);
        else {
            let result = []
            wgs84Position.forEach(wgs84 => result.push(this.transformWGS84ToCartesian(wgs84)))
            return result
        }
    }

   
}

export default CoordTransformer;
