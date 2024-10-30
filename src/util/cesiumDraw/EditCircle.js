import * as turf from "@turf/turf";

class EditCircle {
  constructor(arg) {
    this.viewer = arg.viewer;
    this.circleEntity = arg.pointIndex;
    this.entityEdit = arg.entityEdit;
    this.circlePointArr = []; //存储活动点位
    this.DrawStartEvent = new Cesium.Event(); //开始绘制事件
    this.DrawEndEvent = new Cesium.Event(); //结束绘制事件
  }

  //创建点位
  createPoint = (lon, lat, name, height = 0) => {
    let entity = this.viewer.entities.add({
      name,
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      point: {
        pixelSize: 8,
        color: new window.Cesium.Color(0, 0, 0, 1),
        outlineColor: new window.Cesium.Color(1, 1, 0, 1),
        outlineWidth: 2,
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return entity;
  };

  createPoints = (item, name) => {
    let entity = this.viewer.entities.add({
      name,
      position: new Cesium.Cartesian3(item.x,item.y,item.z),
      point: {
        pixelSize: 8,
        color: new window.Cesium.Color(0, 0, 0, 1),
        outlineColor: new window.Cesium.Color(1, 1, 0, 1),
        outlineWidth: 2,
        // clampToGround: true,
        heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
        // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return entity;
  };
  edits() {
    let that = this;
    console.log(that.viewer.scene.mode)
    const { lon, lat, semiMajorAxis } = this.entityEdit;
    console.log(this.circleEntity.position._value);
    that.viewer.shadows = false;
    var pt = turf.point([lon, lat], { "marker-color": "F00" });
    var bearing = 135;
    var options = { units: "kilometers" };
    var destination = turf.rhumbDestination(
      pt,
      semiMajorAxis / 1000,
      bearing,
      options
    );
    this.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    let handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    //生成中心点  和边缘点

    let outSideEntity = this.createPoint(
      destination.geometry.coordinates[0],
      destination.geometry.coordinates[1],
      "边缘点"
    );
    let circleCenter = this.createPoints(this.circleEntity.position._value, "中心点");

    this.circlePointArr.push(outSideEntity);
    this.circlePointArr.push(circleCenter);

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
        console.log(pick.id)
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
          if (pick.id.name == "边缘点") {
            let lonlats = this.CartesianLonLat(circleCenter.position._value);
            

            var from = turf.point([lonlats[0],lonlats[1]]);
            var to = turf.point([lng1, lat1]);
            var options = { units: "kilometers" };
            var distance = turf.distance(from, to, options);
            //动态绘制矩形
            this.circleEntity.ellipse.semiMajorAxis =
              new Cesium.CallbackProperty(function () {
                return distance * 1000;
              }, false);
            this.circleEntity.ellipse.semiMinorAxis =
              new Cesium.CallbackProperty(function () {
                return distance * 1000;
              }, false);
            outSideEntity.position._value = Cesium.Cartesian3.fromDegrees(
              lng1,
              lat1,
              0
            );
            // circleCenter.position._value = Cesium.Cartesian3.fromDegrees(lng1, lat1, 0);

            this.entityEdit.semiMajorAxis = distance * 1000;
            this.entityEdit.semiMinorAxis = distance * 1000;
            console.log(pick.id.name,cartesian)
          } else if (pick.id.name === "中心点" || pick.id.name == "圆形") {
            
            this.circleEntity.position = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z);
            circleCenter.position = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z);
            this.entityEdit.lon = lng1;
            this.entityEdit.lat = lat1;
            var pt = turf.point([lng1, lat1], { "marker-color": "F00" });
            var bearing = 135;
            var options = { units: "kilometers" };
            var destination = turf.rhumbDestination(
              pt,
              this.entityEdit.semiMajorAxis / 1000,
              bearing,
              options
            );
            outSideEntity.position._value =new Cesium.Cartesian3.fromDegrees(
              destination.geometry.coordinates[0],
              destination.geometry.coordinates[1],
              0
            );
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      }
      this.handler.setInputAction((movement) => {
        if(handlers !==null){
          handlers.destroy();
          handlers = null;
        }
        this.circleEntity.position = new Cesium.Cartesian3.fromDegrees(
          this.entityEdit.lon,
          this.entityEdit.lat,
          0
        );
        // this.circleEntity.position = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z),
        this.circleEntity.ellipse.semiMajorAxis = this.entityEdit.semiMajorAxis;
        this.circleEntity.ellipse.semiMinorAxis = this.entityEdit.semiMinorAxis;
        //结束绘制之后的回调函数
        this.DrawEndEvent.raiseEvent(this.entityEdit, this.circleEntity, this.circlePointArr);

        that.viewer.scene.screenSpaceCameraController.enableInputs = true;

      }, Cesium.ScreenSpaceEventType.LEFT_UP);



      this.handler.setInputAction(() => {
        if(this.handler!==null){
          this.handler.destroy();
          this.handler =null;
        }
        if(handlers !==null){
          handlers.destroy();
          handlers = null;
        }
        //清除活动点
       if(this.circlePointArr.length){
          this.circlePointArr.forEach((item) => {
            that.viewer.entities.remove(item);
          });
          this.circlePointArr = [];
      }
        this.circleEntity.position = new Cesium.Cartesian3.fromDegrees(
          this.entityEdit.lon,
          this.entityEdit.lat,
          0
        );
        //结束绘制之后的回调函数
        this.DrawEndEvent.raiseEvent(this.entityEdit, this.circleEntity,this.circlePointArr);
        
       
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
      
      
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  

  }
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
    //清除活动点
    if(this.circlePointArr.length){
      this.circlePointArr.forEach((item) => {
        that.viewer.entities.remove(item);
      });
      this.circlePointArr = [];
   }
  }
}

export default EditCircle;
