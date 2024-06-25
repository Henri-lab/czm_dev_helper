import * as turf from '@turf/turf';
import Cesium from 'cesium';
import { typeOf } from "../util/type";
import { DataPrepocesser } from "../Data";

class TurfUser {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.entities = [];
        this.$data = new DataPrepocesser(Cesium);
    }

    _createPoint(position) {
        return this.viewer.entities.add({
            position,
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }

    _createLabel(position, text) {
        return this.viewer.entities.add({
            position,
            label: {
                text,
                font: '14pt sans-serif',
                fillColor: Cesium.Color.YELLOW,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
    }

    _createLine(positions) {
        return this.viewer.entities.add({
            polyline: {
                positions,
                width: 2,
                material: Cesium.Color.BLUE,
                clampToGround: true
            }
        });
    }

    _createPolygon(positions) {
        return this.viewer.entities.add({
            polygon: {
                hierarchy: positions,
                material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.5)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }

    _clearHandler() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    _clearEntities() {
        this.entities.forEach(entity => {
            this.viewer.entities.remove(entity);
        });
        this.entities = [];
    }

    _toGeographicCoordinate(position) {
        if (position.longitude !== undefined && position.latitude !== undefined) {
            return position;
        }
        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        return {
            longitude: Cesium.Math.toDegrees(cartographic.longitude),
            latitude: Cesium.Math.toDegrees(cartographic.latitude)
        };
    }

    _isValidGeographicCoordinate(point) {
        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(point);
        const lon = cartographic.longitude;
        const lat = cartographic.latitude;
        return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
    }

    _isValidPolygonCoordinates(polygonCoordinates) {
        return Array.isArray(polygonCoordinates) && polygonCoordinates.every(coord => {
            return Array.isArray(coord) && coord.length === 2 &&
                coord[0] >= -180 && coord[0] <= 180 &&
                coord[1] >= -90 && coord[1] <= 90;
        });
    }

    /**
     * Method to perform simple measurements based on provided type and coordinates.
     *
     * @param {Array.<Array.<number>>} posArr - Array of coordinates for the measurement.
     * @param {string} type - Type of measurement. Can be 'Point', 'line', 'Polygon', or 'height'.
     *
     * @returns {number} - The result of the measurement. For 'Point' and 'line', it returns 0.
     *                      For 'Polygon', it returns the area of the polygon in square meters.
     *                      For 'height', it returns the absolute difference in height between two points.
     *
     * @throws {Error} - Throws an error if the provided type is not one of the valid types.
     */
    // The turf.polygon function and convertToGeoJSON(positions, 'Polygon') function can achieve similar results when converting an array of positions to a GeoJSON polygon.
    // However, turf.polygon expects the input to be in a specific format, which is a nested array of coordinates.
    measureSimple(type, posArr) {
        let res, geojson;
        switch (type.toLowerCase()) {
            case 'point':
                break;
            case 'line':
                // turf.LineString also works
                geojson = this.$data.convertToGeoJSON(posArr, 'LineString');
                res = turf.length(geojson, { units: 'kilometers' }) || 0;
                break;
            case 'polygon':
                res = turf.area(turf.polygon([posArr])) || 0;
                break;
            case 'height':
                break;
            default:
                throw new Error('Invalid measurement type. Expected one of: Point, line, Polygon, height');;
        }
        return res;
    }

    /**
     * Checks if a given point is inside a polygon.
     *
     * @param {Object} point - The point to check.
     * @param {number} point.longitude - The longitude of the point.
     * @param {number} point.latitude - The latitude of the point.
     * @param {Array.<Array.<number>>} polygonCoordinates - The coordinates of the polygon.
     *
     * @returns {boolean} - True if the point is inside the polygon, false otherwise.
     *
     * @throws {Error} - Throws an error if the provided point or polygon coordinates are invalid.
     */
    isPointInPolygon(point, polygonCoordinates) {
        const coordinates = this._toGeographicCoordinate(point);
        // turf 要求参数是地理坐标
        if (!this._isValidGeographicCoordinate(coordinates) || !this._isValidPolygonCoordinates(polygonCoordinates)) {
            console.error('Invalid input for point or polygon coordinates.');
            return false;
        }
        const turfPoint = turf.point([Cesium.Math.toDegrees(coordinates.longitude), Cesium.Math.toDegrees(coordinates.latitude)]);
        const turfPolygon = turf.polygon([polygonCoordinates]);
        //-polygon参数是一个包含一个或多个环（数组）的数组，其中第一个环表示多边形的外部轮廓，其他环（如果有）表示内部的洞。

        return turf.booleanPointInPolygon(turfPoint, turfPolygon);
    }

    /**
     * Performs a buffer analysis on a given point.
     *
     * @param {Object} point - The point to perform the buffer analysis on.
     * @param {number} point.longitude - The longitude of the point.
     * @param {number} point.latitude - The latitude of the point.
     * @param {number} radius - The radius of the buffer in meters.
     *
     * @returns {undefined} - This method does not return a value.
     *
     * @throws {Error} - Throws an error if the provided geographic coordinate for the point is invalid.
     */
    bufferAnalysis(point, radius) {
        const coordinates = this._toGeographicCoordinate(point);
        if (!this._isValidGeographicCoordinate(coordinates)) {
            console.error('Invalid geographic coordinate for point.');
            return;
        }

        const turfPoint = turf.point([coordinates.longitude, coordinates.latitude]);
        const buffered = turf.buffer(turfPoint, radius, { units: 'meters' });

        const positions = buffered.geometry.coordinates[0].map(coord => {
            return Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
        });

        this._clearEntities();
        this.entities.push(this._createPolygon(positions));
    }

    /**
     * Cuts a polygon along a given line.
     *
     * @param {Object} poly - The polygon to cut. Must be a GeoJSON Feature of type Polygon.
     * @param {Object} line - The line to cut along. Must be a GeoJSON Feature of type LineString.
     * @param {number} [tolerance=0.0002] - The tolerance for point-in-polygon calculations. Default is 0.0002 kilometers.
     * @param {string} [toleranceType="kilometers"] - The unit for the tolerance. Default is "kilometers".
     *
     * @throws {Error} - Throws an error if the input is not a valid GeoJSON Feature of type Polygon or LineString.
     * @throws {Error} - Throws an error if the start and end points of the line are within the polygon.
     *
     * @returns {Object} - A GeoJSON FeatureCollection containing the cut pieces of the polygon.
     *                      Each piece is a Polygon Feature with the same properties as the input polygon.
     *                      The pieces are numbered sequentially, starting from 0.
     */
    polygonCut(poly, line, tolerance = 0.0002, toleranceType = "kilometers") {
        /* 多边形切割函数，传入GeoJSON数据 */
        // 条件判断
        if (!poly.geometry || poly.geometry.type !== "Polygon") {
            throw new Error("传入的必须为polygon");
        }
        if (!line.geometry || !line.geometry.type.toLowerCase().includes("linestring")) {
            throw new Error("传入的必须为linestring");
        }
        if (line.geometry.type === "LineString") {
            const [start, end] = [
                turf.point(line.geometry.coordinates[0]),
                turf.point(line.geometry.coordinates[line.geometry.coordinates.length - 1])
            ];
            if (turf.booleanPointInPolygon(start, poly) || turf.booleanPointInPolygon(end, poly)) {
                throw new Error("起点和终点必须在多边形之外");
            }
        }

        // 计算交点，并把线的点合并
        let lineIntersect = turf.lineIntersect(line, poly);
        const linePoints = turf.explode(line).features;
        linePoints.forEach(point => lineIntersect.features.push(point));

        // 计算线的缓冲区
        const lineBuffer = turf.buffer(line, tolerance, { units: toleranceType });

        // 计算线缓冲和多边形的差异，处理多边形碎片
        const difference = turf.difference(poly, lineBuffer);
        const pieces = difference.geometry.type === "Polygon"
            ? [difference]
            : difference.geometry.coordinates.map(coords => turf.polygon(coords));

        // 处理点数据
        pieces.forEach(piece => {
            const coords = piece.geometry.coordinates[0];
            coords.forEach((coord, index) => {
                const point = turf.point(coord);
                lineIntersect.features.forEach(intersectPoint => {
                    if (turf.distance(intersectPoint, point, { units: toleranceType }) <= tolerance * 2) {
                        coords[index] = intersectPoint.geometry.coordinates;
                    }
                });
            });
        });

        // 赋予属性并处理id
        pieces.forEach((piece, index) => {
            piece.properties = { ...poly.properties, id: `${poly.properties.id}-${index}` };
        });

        return turf.featureCollection(pieces);
    }


}

export default TurfUser;









