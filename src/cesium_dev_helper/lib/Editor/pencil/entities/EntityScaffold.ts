import { CoordTransformer } from '../../../../lib/Compute';
import {
  EntityOption,
  ParsedEntityOptions,
  EditorPluginFunction,
  EventManager,
  CzmLayer
} from '../../../../type';

import * as Cesium from 'cesium';

export default class EntityScaffold {
  $eM: EventManager;
  tool: any;
  layer: CzmLayer;
  $coords: CoordTransformer;
  viewer: Cesium.Viewer;
  constructor(arg: { eM: EventManager; layer: CzmLayer; tool?: any; }) {
    this.$coords = new CoordTransformer();
    this.$eM = arg.eM;
    this.viewer = arg.eM.getViewer();
    this.layer = arg.layer;
    this.tool = arg.tool;
  }
  _getCartesian3FromPX(position: Cesium.Cartesian2): Cesium.Cartesian3 {
    /*pixel*/
    return this.$coords.getCartesianFromScreenPosition(position, this.viewer);
  }
  // 获得屏幕位置的cartesian

  fakeDraw(
    type: string,
    priority: number,
    getPos?: Function | null,
    option?: EntityOption
  ) {
    const _type = type.toLowerCase();
    if (_type === 'polygon') this.fakeDrawPolyLine(getPos, option, priority);
  }

  fakeDrawPolyLine(
    getPos: Function | null,
    option: EntityOption,
    priority: number
  ) {
    let that = this;
    let index = 0;
    let $eM = that.$eM;
    // console.log('events map',$eM.eventHandlers)
    let polylines = [];
    let getStart: () => Cesium.Cartesian3, getCurrent: () => Cesium.Cartesian3;
    let startPointOfStraightLine: any;
    let isDrawing = false;
    let alreadyCreatePolyline = false;
    let points = [];
    let afterClick = (
      movement: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ) => {
      //优先级更高
      isDrawing = true;
      alreadyCreatePolyline = false;
      getStart = () => that._getCartesian3FromPX(movement.position);
      startPointOfStraightLine = getStart();
      console.log(getStart(), '--->');
      let point = that.layer.entities.add(
        new Cesium.Entity({
          position: startPointOfStraightLine,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 15,
            scaleByDistance: new Cesium.NearFarScalar(
              1.5e2 /*150m*/,
              2.0,
              1.5e7,
              0.5
            ), //缩放
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              1.5e7
            ), //可视距离
          },
        })
      );
      points.push(point);
    };
    let afterMouseMove = (
      movement: Cesium.ScreenSpaceEventHandler.MotionEvent
    ) => {
      getCurrent = () =>
        that._getCartesian3FromPX(movement.endPosition);
      // console.log(getCurrent().x - startPointOfStraightLine.x)
      if (isDrawing && !alreadyCreatePolyline && startPointOfStraightLine) {
        let polyline = that.layer.entities.add(
          new Cesium.Entity({
            name: 'fakeline' + index++,
            polyline: {
              //   positions: this._CallBack([startPointOfStraightLine, getCurrent() || startPointOfStraightLine]),
              positions: new Cesium.CallbackProperty(
                () => [
                  startPointOfStraightLine,
                  getCurrent() || points[0].position,
                ],
                false
              ),
              width: 2,
              material: Cesium.Color.RED,
              clampToGround: true,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0.0,
                1.5e7
              ), //可视距离
            },
          })
        );
        alreadyCreatePolyline = true;
        // console.log(polylines)
        polylines.push(polyline);
      }
    };
    const afterRightClick = () => {
      isDrawing = false;
      const last = polylines.pop();
      last.polyline.show = false;
      that.layer.entities.remove(last);
    };
    $eM.onMouseClick(afterClick, priority || 2);
    $eM.onMouseMove(afterMouseMove, priority || 2);
    $eM.onMouseRightClick(afterRightClick, priority || 2);
  }
}
