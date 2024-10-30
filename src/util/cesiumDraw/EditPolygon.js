import * as turf from "@turf/turf";
import * as Cesium from "cesium";
class EditPolygon {
  constructor(arg) {
    this.viewer = arg.viewer;
    this.entityEdit = arg.entityEdit;
    this.lineEntity = arg.pointIndex;
    this.linePoint = []; //存储活动点位
    this.DrawStartEvent = new Cesium.Event(); //开始绘制事件
    this.DrawEndEvent = new Cesium.Event(); //结束绘制事件
  }
  //创建点位
  createPoint = (item, name) => {
    let entity = this.viewer.entities.add({
      name,
      position: new Cesium.Cartesian3(item.x, item.y, item.z),
      point: {
        pixelSize: 10,
        color: new Cesium.Color(0, 0, 0, 1),
        outlineColor: new Cesium.Color(1, 1, 0, 1),
        outlineWidth: 2,
        // clampToGround: true,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },                        
    });
    return entity;
  };
  edits = () => {
    let that = this;
    let changeLinePos = [];
    let num = 0;//计数器
    // let changeLinePos =
    this.lineEntity.polygon.hierarchy._value.positions.forEach((item,index) => {
      // changeLinePos.push(this.CartesianLonLat(item));
      this.linePoint.push(this.createPoint(item, `多边形活动点${index}`));
    });

    // changeLinePos.forEach((item, index) => {
    //   this.linePoint.push(this.createPoint(item, `多边形活动点${index}`));
    // });

    let positiones = this.lineEntity.polygon.hierarchy._value.positions;

    this.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    let handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    // let handlers = null;
    this.handler.setInputAction((movement) => {
      if(handlers ==null){
        handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
      }
      const { position } = movement;
      //屏幕坐标转化为笛卡尔坐标
      const ray = that.viewer.camera.getPickRay(position);
      const cartesian3 = that.viewer.scene.globe.pick(
        ray,
        that.viewer.scene
      );
      let pick = that.viewer.scene.pick(position);
      if (cartesian3 == undefined) return; //如果点位不在球上就不执行以下操作
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
          if (pick.id.name.indexOf("多边形活动点") !== -1) {
            pick.id.position._value = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            positiones[pick.id.name.split("点")[1]] =
            new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            this.entityEdit.polygonArr[pick.id.name.split("点")[1]] = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            // console.log(pick.id.name.split("点")[1])
            if(pick.id.name.split("点")[1]  == 0){
              this.entityEdit.lon = lng1;
              this.entityEdit.lat = lat1;
              this.lineEntity.position = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            }
           
            // this.lineEntity.position._value = positiones[positiones.length - 1];
            // //动态绘制多边形
            this.lineEntity.polygon.hierarchy = new Cesium.CallbackProperty(function () {
                return {
                  positions:
                   that.entityEdit.polygonArr
                };
              }, false);
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
      }
      
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);


    this.handler.setInputAction(() => {
      if(handlers !==null){
        handlers.destroy();
        handlers = null;
      }
      

      this.lineEntity.polygon.hierarchy = this.entityEdit.polygonArr;
       //结束绘制之后的回调函数
        this.DrawEndEvent.raiseEvent(this.entityEdit, this.lineEntity,this.linePoint);


        that.viewer.scene.screenSpaceCameraController.enableInputs = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    this.handler.setInputAction(() => {
      console.log(that.linePoint);
      if(this.linePoint.length){
        this.linePoint.forEach((item) => {
          that.viewer.entities.remove(item);
        });
        this.linePoint = [];
      }
      if(this.handler!==null){
        this.handler.destroy();
        this.handler =null;
        
      }
      if(handlers !==null){
        handlers.destroy();
        handlers = null;
      }
      

    //   this.lineEntity.polygon.hierarchy = positiones;
      //结束绘制之后的回调函数
      this.DrawEndEvent.raiseEvent(this.entityEdit, this.lineEntity,this.linePoint);
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
  };

  //笛卡尔坐标系 转经纬度
  CartesianLonLat(cartesian3) {
    //笛卡尔坐标转经纬度
    const radians =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
    const lat = Cesium.Math.toDegrees(radians.latitude); //弧度转度
    const lng = Cesium.Math.toDegrees(radians.longitude);
    return [lng, lat];
  }
  destroys(){
    if(this.handler!==null){
      this.handler.destroy();
      this.handler =null;
      
    }
    if(this.linePoint.length){
      this.linePoint.forEach((item) => {
        that.viewer.entities.remove(item);
      });
      this.linePoint = [];
    }
  }
}
export default EditPolygon;
