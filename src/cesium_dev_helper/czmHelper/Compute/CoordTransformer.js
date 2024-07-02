import * as Cesium from "cesium";

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
    transformCartesianToWGS84(cartesianPosition) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesianPosition);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
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
    transformWGS84ToCartesian(wgs84Position) {
        const longitude = wgs84Position.longitude;
        const latitude = wgs84Position.latitude;
        const height = wgs84Position.height;
        return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    }
    /**
     * Retrieves the center of a 3D Tiles tileset.
     *
     * @param {Object} tileset - The 3D Tiles tileset.
     * @returns {Object} - The center of the tileset.
     */
    static getCenterFrom3dTiles(tileset) {

        // 要获取 3D Tiles 的中心坐标，推荐的做法是通过 root 节点的 boundingVolume 获取。
        // root 节点是 3D Tiles 集的根节点，它通常会包含 boundingVolume 属性。
        // --获取 boundingVolume
        const boundingVolume = tileset.root.boundingVolume;

        // 如果是 BoundingSphere
        if (boundingVolume.boundingVolume instanceof Cesium.BoundingSphere) {
            const center = boundingVolume.boundingVolume.center;
            const cartographic = Cesium.Cartographic.fromCartesian(center);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const height = cartographic.height;

            return {
                longitude,
                latitude,
                height,
            }
            // console.log('BoundingSphere Center:');
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Height: ${height}`);
        }
        // 如果是 OrientedBoundingBox
        else if (boundingVolume.boundingVolume instanceof Cesium.OrientedBoundingBox) {
            const center = boundingVolume.boundingVolume.center;
            const cartographic = Cesium.Cartographic.fromCartesian(center);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const height = cartographic.height;

            // console.log('OrientedBoundingBox Center:');
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Height: ${height}`);
            return {
                longitude,
                latitude,
                height,
            }
        }
    }
}

export default CoordTransformer;
