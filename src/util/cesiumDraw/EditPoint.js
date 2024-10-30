import * as Cesium from "cesium";
class EditPoint {
  constructor(arg) {
    this.viewer = arg.viewer;
    this.entityEdit = arg.entityEdit;
    this.pointIndex = arg.pointIndex;
    this.rectanglePoint = []; //存储活动点位
    this.DrawStartEvent = new Cesium.Event(); //开始绘制事件
    this.DrawEndEvent = new Cesium.Event(); //结束绘制事件
  }
  editPoint() {
    let that = this;
    let handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    this.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      //屏幕坐标转化为笛卡尔坐标
      const ray = that.viewer.camera.getPickRay(position);
      const cartesian3 = that.viewer.scene.globe.pick(
        ray,
        that.viewer.scene
      );
      if (cartesian3 == undefined) return; //如果点位不在球上就不执行以下操作
      //笛卡尔坐标转经纬度
      const radians =
        that.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
      const lat = Cesium.Math.toDegrees(radians.latitude).toFixed(2); //弧度转度
      const lng = Cesium.Math.toDegrees(radians.longitude).toFixed(2);

      handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
      let pick = that.viewer.scene.pick(movement.position);

      if (Cesium.defined(pick)) {
        that.viewer.scene.screenSpaceCameraController.enableInputs = false;
        handlers.setInputAction((move) => {
          // let cartesian = that.viewer.camera.pickEllipsoid(
          //   move.endPosition,
          //   that.viewer.scene.globe.ellipsoid
          // );
          //屏幕坐标转化为笛卡尔坐标
          const ray = that.viewer.camera.getPickRay(move.endPosition);
          const cartesian = that.viewer.scene.globe.pick(ray, that.viewer.scene);
          if (cartesian == undefined) return;
          let cartographic = Cesium.Cartographic.fromCartesian(
            cartesian,
            that.viewer.scene.globe.ellipsoid,
            new Cesium.Cartographic()
          );
          let lng1 = Cesium.Math.toDegrees(cartographic.longitude);
          let lat1 = Cesium.Math.toDegrees(cartographic.latitude);
          // this.pointIndex.position._value = Cesium.Cartesian3.fromDegrees(
          //   lng1,
          //   lat1,
          //   0
          // );
          this.pointIndex.position._value = new Cesium.Cartesian3(
            cartesian.x, cartesian.y, cartesian.z
          );
          this.entityEdit.lon = lng1;
          this.entityEdit.lat = lat1;
          // this.handler.destroy();
          // //结束绘制之后的回调函数
          // this.DrawEndEvent.raiseEvent(this.entityEdit, this.pointIndex);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);




        this.handler.setInputAction((movement) => {
          this.DrawEndEvent.raiseEvent(this.entityEdit, this.pointIndex);
          handlers.destroy();
          handlers = null;
          that.viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

      }



    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    this.handler.setInputAction(() => {
      if (this.handler !== null) {
        this.handler.destroy();
        this.handler = null;
      }
      if (handlers !== null) {
        handlers.destroy();
        handlers = null;
      }
      //结束绘制之后的回调函数
      this.DrawEndEvent.raiseEvent(this.entityEdit, this.pointIndex);
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
  }
  destroys() {
    if (this.handler !== null) {
      this.handler.destroy();
      this.handler = null;
    }
  }
}
export default EditPoint;
