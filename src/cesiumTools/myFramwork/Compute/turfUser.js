import * as turf from '@turf/turf';
import Cesium from 'cesium';

class turfUser {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.entities = [];
    }

    measureDistance(units, precision) {
        this._clearHandler();
        this._clearEntities();
        let positions = [];
        let distance = 0;

        this.handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                positions.push(earthPosition);
                this.entities.push(this._createPoint(earthPosition));
                if (positions.length > 1) {
                    const lastPosition = positions[positions.length - 2];
                    const turfLine = turf.lineString([
                        Cesium.Cartographic.toDegreesArray(lastPosition),
                        Cesium.Cartographic.toDegreesArray(earthPosition)
                    ]);
                    distance += turf.length(turfLine, { units });
                    this.entities.push(this._createLabel(earthPosition, `${distance.toFixed(precision)} ${units}`));
                    this.entities.push(this._createLine([lastPosition, earthPosition]));
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    measureDistance2(units, precision) {
        this._clearHandler();
        this._clearEntities();
        let positions = [];
        let distance = 0;

        this.handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                positions.push(earthPosition);
                this.entities.push(this._createPoint(earthPosition));
                if (positions.length > 1) {
                    const lastPosition = positions[positions.length - 1];
                    const turfLine = turf.lineString([
                        Cesium.Cartographic.toDegreesArray(lastPosition),
                        Cesium.Cartographic.toDegreesArray(earthPosition)
                    ]);
                    distance += turf.length(turfLine, { units });
                    this.entities.push(this._createLabel(earthPosition, `${distance.toFixed(precision)} ${units}`));
                    this.entities.push(this._createLine([lastPosition, earthPosition]));
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    measureArea() {
        this._clearHandler();
        this._clearEntities();
        let positions = [];

        this.handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                positions.push(earthPosition);
                this.entities.push(this._createPoint(earthPosition));
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction((event) => {
            if (positions.length > 2) {
                positions.push(positions[0]);
                const coordinates = positions.map(position => {
                    const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                    return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
                });
                const turfPolygon = turf.polygon([coordinates]);
                const area = turf.area(turfPolygon);
                this.entities.push(this._createLabel(positions[0], `${(area / 1000000).toFixed(2)} sq km`));
                this.entities.push(this._createPolygon(positions));
            }
            positions = [];
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    measureHeight() {
        this._clearHandler();
        this._clearEntities();
        let positions = [];

        this.handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                positions.push(earthPosition);
                this.entities.push(this._createPoint(earthPosition));
                if (positions.length === 2) {
                    const height = Math.abs(positions[0].height - positions[1].height);
                    this.entities.push(this._createLabel(positions[1], `${height.toFixed(2)} meters`));
                    this.entities.push(this._createLine(positions));
                    positions = [];
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

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
}

export default turfUser;









