import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;

class MeasurementManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.entities = [];
    }

    measureDistance() {
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
                    distance += Cesium.Cartesian3.distance(lastPosition, earthPosition);
                    this.entities.push(this._createLabel(earthPosition, `${distance.toFixed(2)} meters`));
                    this.entities.push(this._createLine([lastPosition, earthPosition]));
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    measureDistance2() {
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
                    distance += Cesium.Cartesian3.distance(lastPosition, earthPosition);
                    this.entities.push(this._createLabel(earthPosition, `${distance.toFixed(2)} meters`));
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
                const area = this._computePolygonArea(positions);
                this.entities.push(this._createLabel(positions[0], `${area.toFixed(2)} meters`));
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
                    const height = Cesium.Cartesian3.distance(positions[0], positions[1]);
                    this.entities.push(this._createLabel(positions[1], `${height.toFixed(2)} meters`));
                    this.entities.push(this._createLine(positions));
                    positions = [];
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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

    _computePolygonArea(positions) {
        const radiansPerDegree = Math.PI / 180.0;
        const degreesPerRadian = 180.0 / Math.PI;
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const geometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            perPositionHeight: false
        });
        const geometryInstance = new Cesium.GeometryInstance({
            geometry: geometry
        });
        const geodesic = new Cesium.EllipsoidGeodesic();
        let surfaceArea = 0;

        for (let i = 0; i < positions.length - 1; i++) {
            const cartoA = ellipsoid.cartesianToCartographic(positions[i]);
            const cartoB = ellipsoid.cartesianToCartographic(positions[i + 1]);

            geodesic.setEndPoints(cartoA, cartoB);
            const s = geodesic.surfaceDistance;
            const l = geodesic.start.height + geodesic.end.height;
            surfaceArea += (s * l);
        }

        return surfaceArea / (radiansPerDegree * radiansPerDegree);
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
}

export default MeasurementManager;
