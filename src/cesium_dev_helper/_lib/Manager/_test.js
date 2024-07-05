//  // 基本绘图功能
//     /**
//      * Draws a point on the map at the clicked location.
//      *
//      * @param {Object} [option] - An optional object to customize the point's appearance.
//      * @param {Number} [option.pixelSize=10] - The size of the point in pixels.
//      * @param {Cesium.Color} [option.color=Cesium.Color.RED] - The color of the point.
//      * @param {Cesium.Color} [option.outlineColor=Cesium.Color.BLACK] - The color of the point's outline.
//      * @param {Number} [option.outlineWidth=1] - The width of the point's outline in pixels.
//      * @param {Cesium.HeightReference} [option.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND] - The height reference of the point.
//      * @param {Number} [option.disableDepthTestDistance=Number.POSITIVE_INFINITY] - The distance from the camera at which to disable the depth test to, for example, avoid z-fighting.
//      * @param {Cesium.NearFarScalar} [option.scaleByDistance] - A NearFarScalar object that determines how the point's size scales with distance from the camera.
//      * @param {Cesium.NearFarScalar} [option.translucencyByDistance] - A NearFarScalar object that determines how the point's translucency changes with distance from the camera.
//      * @param {Cesium.DistanceDisplayCondition} [option.distanceDisplayCondition] - A DistanceDisplayCondition object that determines if the point is displayed.
//      *
//      * @returns {undefined}
//      */
//     drawPoint(option = {}) {
//         const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

//         const defaultOptions = {
//             pixelSize: 10,
//             color: Cesium.Color.RED,
//             outlineColor: Cesium.Color.BLACK,
//             outlineWidth: 1,
//             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//             disableDepthTestDistance: Number.POSITIVE_INFINITY,
//             scaleByDistance: undefined,
//             translucencyByDistance: undefined,
//             distanceDisplayCondition: undefined
//         };

//         const opt = Object.assign(defaultOptions, option);

//         handler.setInputAction((event) => {
//             const earthPosition = this.viewer.scene.pickPosition(event.position);
//             if (Cesium.defined(earthPosition)) {
//                 this.viewer.entities.add({
//                     position: earthPosition,
//                     point: {
//                         pixelSize: opt.pixelSize,
//                         color: opt.color,
//                         outlineColor: opt.outlineColor,
//                         outlineWidth: opt.outlineWidth,
//                         heightReference: opt.heightReference,
//                         disableDepthTestDistance: opt.disableDepthTestDistance,
//                         scaleByDistance: opt.scaleByDistance,
//                         translucencyByDistance: opt.translucencyByDistance,
//                         distanceDisplayCondition: opt.distanceDisplayCondition
//                     }
//                 });
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//     }

//     /**
//     * Adds a label with distance information at the given position.
//     *
//     * @param {Cartesian3} position - The position where the label should be added.
//     */
//     addInfoPoint(position) {
//         let _labelEntity = new Cesium.Entity();
//         _labelEntity.position = position;
//         _labelEntity.point = {
//             pixelSize: 10,
//             outlineColor: Cesium.Color.BLUE,
//             outlineWidth: 5,
//         };
//         _labelEntity.label = {
//             text:
//                 (this.getPositionDistance(this._transformCartesianToWGS84(positions)) / 1000).toFixed(4) + "公里",
//             show: true,
//             showBackground: true,
//             font: "14px monospace",
//             horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
//             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//             pixelOffset: new Cesium.Cartesian2(-20, -80), //left top
//         };
//         this._drawLayer.entities.add(_labelEntity);
//     };

//     /**
//      * Draws a line on the map at the clicked locations.
//      *
//      * @param {Object} [option] - An optional object to customize the line's appearance.
//      * @param {Number} [option.width=5] - The width of the line in pixels.
//      * @param {Cesium.MaterialProperty} [option.material=Cesium.Color.RED] - The material of the line.
//      * @param {Boolean} [option.clampToGround=true] - Whether the line should be clamped to the ground.
//      *
//      * @returns {undefined}
//      */
//     drawLine(option = {}) {
//         const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
//         let activeShapePoints = [];
//         let activeShape = null;
//         let floatingPoint = null;

//         const defaultOptions = {
//             width: 5,
//             material: Cesium.Color.RED,
//             clampToGround: true,
//         };

//         const opt = Object.assign(defaultOptions, option);

//         handler.setInputAction((event) => {
//             const earthPosition = this.viewer.scene.pickPosition(event.position);
//             if (Cesium.defined(earthPosition)) {
//                 if (activeShapePoints.length === 0) {
//                     floatingPoint = this.viewer.entities.add({
//                         position: earthPosition,
//                         point: {
//                             pixelSize: 5,
//                             color: Cesium.Color.YELLOW,
//                             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//                         }
//                     });
//                     activeShapePoints.push(earthPosition);
//                     const dynamicPositions = new Cesium.CallbackProperty(() => {
//                         return activeShapePoints;
//                     }, false);
//                     activeShape = this.viewer.entities.add({
//                         polyline: {
//                             positions: dynamicPositions,
//                             width: opt.width,
//                             material: opt.material,
//                             clampToGround: opt.clampToGround
//                         }
//                     });
//                 }
//                 activeShapePoints.push(earthPosition);
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//         handler.setInputAction((event) => {
//             if (Cesium.defined(floatingPoint)) {
//                 const newPosition = this.viewer.scene.pickPosition(event.endPosition);
//                 if (Cesium.defined(newPosition)) {
//                     floatingPoint.position = newPosition;
//                     activeShapePoints.pop();
//                     activeShapePoints.push(newPosition);
//                 }
//             }
//         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//         handler.setInputAction(() => {
//             if (Cesium.defined(activeShape)) {
//                 this.viewer.entities.remove(floatingPoint);
//                 this.viewer.entities.remove(activeShape);
//                 this.drawLineShape(activeShapePoints, opt);
//                 activeShapePoints = [];
//                 activeShape = null;
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//     }


//     /**
//      * Draws a polygon on the map at the clicked locations.
//      *
//      * @param {Object} [option] - An optional object to customize the polygon's appearance.
//      * @param {Cesium.MaterialProperty} [option.material=new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.7))] - The material of the polygon.
//      * @param {Cesium.HeightReference} [option.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND] - The height reference of the polygon.
//      *
//      * @returns {undefined}
//      */
//     drawPolygon(option = {}) {
//         const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
//         let activeShapePoints = [];
//         let activeShape = null;
//         let floatingPoint = null;

//         const defaultOptions = {
//             material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.7)),
//             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//         };

//         const opt = Object.assign(defaultOptions, option);

//         handler.setInputAction((event) => {
//             const earthPosition = this.viewer.scene.pickPosition(event.position);
//             if (Cesium.defined(earthPosition)) {
//                 if (activeShapePoints.length === 0) {
//                     floatingPoint = this.viewer.entities.add({
//                         position: earthPosition,
//                         point: {
//                             pixelSize: 5,
//                             color: Cesium.Color.RED,
//                             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//                         }
//                     });
//                     activeShapePoints.push(earthPosition);
//                     const dynamicPositions = new Cesium.CallbackProperty(() => {
//                         return new Cesium.PolygonHierarchy(activeShapePoints);
//                     }, false);
//                     activeShape = this.viewer.entities.add({
//                         polygon: {
//                             hierarchy: dynamicPositions,
//                             material: opt.material,
//                             heightReference: opt.heightReference
//                         }
//                     });
//                 }
//                 activeShapePoints.push(earthPosition);
//                 this.viewer.entities.add({
//                     position: earthPosition,
//                     point: {
//                         pixelSize: 5,
//                         color: Cesium.Color.RED,
//                         heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//                     }
//                 });
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//         handler.setInputAction((event) => {
//             if (Cesium.defined(floatingPoint)) {
//                 const newPosition = this.viewer.scene.pickPosition(event.endPosition);
//                 if (Cesium.defined(newPosition)) {
//                     floatingPoint.position = newPosition;
//                     activeShapePoints.pop();
//                     activeShapePoints.push(newPosition);
//                 }
//             }
//         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//         handler.setInputAction(() => {
//             if (Cesium.defined(activeShape)) {
//                 this.viewer.entities.remove(floatingPoint);
//                 this.viewer.entities.remove(activeShape);
//                 this.drawPolygonShape(activeShapePoints, opt);
//                 activeShapePoints = [];
//                 activeShape = null;
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//     }

//     drawCircle(option = {}) {
//         const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
//         let center = null;
//         let radius = null;
//         let floatingPoint = null;

//         const defaultOptions = {
//             material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)),
//             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//         };

//         const opt = Object.assign(defaultOptions, option);

//         handler.setInputAction((event) => {
//             const earthPosition = this.viewer.scene.pickPosition(event.position);
//             if (Cesium.defined(earthPosition)) {
//                 if (!center) {
//                     center = earthPosition;
//                     floatingPoint = this.viewer.entities.add({
//                         position: center,
//                         point: {
//                             pixelSize: 5,
//                             color: Cesium.Color.RED,
//                             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//                         }
//                     });
//                 } else if (!radius) {
//                     radius = Cesium.Cartesian3.distance(center, earthPosition);
//                     this.viewer.entities.remove(floatingPoint);
//                     this.viewer.entities.add({
//                         position: center,
//                         ellipse: {
//                             semiMinorAxis: radius,
//                             semiMajorAxis: radius,
//                             material: opt.material,
//                             heightReference: opt.heightReference
//                         }
//                     });
//                     center = null;
//                     radius = null;
//                 }
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//         handler.setInputAction((event) => {
//             if (Cesium.defined(center) && !radius) {
//                 const newPosition = this.viewer.scene.pickPosition(event.endPosition);
//                 if (Cesium.defined(newPosition)) {
//                     const newRadius = Cesium.Cartesian3.distance(center, newPosition);
//                     floatingPoint.position = newPosition;
//                 }
//             }
//         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//     }

//     drawLineShape(positions, options) {
//         return this.viewer.entities.add({
//             polyline: {
//                 positions: positions,
//                 width: options.width,
//                 material: options.material,
//                 clampToGround: options.clampToGround
//             }
//         });
//     }

//     drawPolygonShape(positions, options) {
//         return this.viewer.entities.add({
//             polygon: {
//                 hierarchy: new Cesium.PolygonHierarchy(positions),
//                 material: options.material,
//                 heightReference: options.heightReference
//             }
//         });
//     }

//// Usage
// const viewer = new Cesium.Viewer('cesiumContainer');
// const drawingManager = new DrawingManager(viewer);

// // Drawing a point
// drawingManager.drawPoint({
//     pixelSize: 15,
//     color: Cesium.Color.BLUE,
//     outlineColor: Cesium.Color.YELLOW,
//     outlineWidth: 2
// });

// // Drawing a line
// drawingManager.drawLine({
//     width: 8,
//     material: Cesium.Color.GREEN,
//     clampToGround: true
// });

// // Drawing a polygon
// drawingManager.drawPolygon({
//     material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.7)),
//     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
// });

// // Drawing a circle
// drawingManager.drawCircle({
//     material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.5)),
//     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
// });
