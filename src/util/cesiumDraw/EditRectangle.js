import * as turf from "@turf/turf";
import * as Cesium from "cesium";
class EditRectangle {
  constructor(arg) {
    this.viewer = arg.viewer;
    this.entityEdit = arg.entityEdit;
    this.rectangleEntity = arg.pointIndex;
    this.rectanglePoint = []; //存储活动点位
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
        color: new Cesium.Color(0, 0, 0, 1),
        outlineColor: new Cesium.Color(1, 1, 0, 1),
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return entity;
  };
  edits = () => {
    let _this = this;
    const { westSouthEastNorth } = this.entityEdit;
    
    console.log(westSouthEastNorth,this.rectangleEntity)

    //绘制矩形左上角节点
    let leftTop = this.createPoint(
      Number(westSouthEastNorth[0]),
      Number(westSouthEastNorth[1]),
      "左上"
    );
    //绘制矩形右下角节点
    let rightDown = this.createPoint(
      Number(westSouthEastNorth[4]),
      Number(westSouthEastNorth[5]),
      "右下"
    );

    //计算矩形的中心点
    var features = turf.featureCollection([
      turf.point([
        Number(westSouthEastNorth[0]),
        Number(westSouthEastNorth[1]),
      ]),
      turf.point([
        Number(westSouthEastNorth[4]),
        Number(westSouthEastNorth[5]),
      ]),
    ]);

    //绘制中心点
    var center = turf.center(features);
    let centerPoint = this.createPoint(
      Number(center.geometry.coordinates[0]),
      Number(center.geometry.coordinates[1]),
      "中间"
    );

    //计算矩形 斜边的距离
    var from = turf.point([westSouthEastNorth[0], westSouthEastNorth[1]]);
    var to = turf.point([westSouthEastNorth[4], westSouthEastNorth[5]]);
    var options = { units: "kilometers" };

    var distance = turf.distance(from, to, options);

    //将三个点位存储到数组中  以便后续操作
    this.rectanglePoint.push(centerPoint);
    this.rectanglePoint.push(leftTop);
    this.rectanglePoint.push(rightDown);

    this.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    let handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
    //计算中心点到左上角点位的角度
    var point1 = turf.point([
      Number(center.geometry.coordinates[0]),
      Number(center.geometry.coordinates[1]),
    ]);
    var point2 = turf.point([westSouthEastNorth[0], westSouthEastNorth[1]]);
    var bearingInit = turf.bearing(point1, point2);
    //计算中心点到右下角点位的角度
    var bearingesInit = turf.bearing(
      point1,
      turf.point([westSouthEastNorth[4], westSouthEastNorth[5]])
    );
    this.handler.setInputAction((movement) => {
      // handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);\
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
        that.viewer.scene.screenSpaceCameraController.enableInputs  = false;
        handlers.setInputAction((move) => {
          // let cartesian = that.viewer.camera.pickEllipsoid(
          //   move.endPosition,
          //   that.viewer.scene.globe.ellipsoid
          // );
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
          if (pick.id.name == "左上") {
            // that.viewer.entities.remove(centerPoint);
            leftTop.position._value = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            this.rectangleEntity.position = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            this.entityEdit.westSouthEastNorth[0] = lng1;
            this.entityEdit.westSouthEastNorth[1] = lat1;
            this.entityEdit.westSouthEastNorth[2] = lng1;
            this.entityEdit.westSouthEastNorth[7] = lat1;
            this.entityEdit.westSouthEastNorth[8] = lng1;
            this.entityEdit.westSouthEastNorth[9] = lat1;

            this.entityEdit.lon = lng1;
            this.entityEdit.lat = lat1;


            //计算矩形的中心点
            var features = turf.featureCollection([
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[0]),
                Number(this.entityEdit.westSouthEastNorth[1]),
              ]),
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[4]),
                Number(this.entityEdit.westSouthEastNorth[5]),
              ]),
            ]);
            var center = turf.center(features);

            centerPoint.position._value = Cesium.Cartesian3.fromDegrees(
              center.geometry.coordinates[0],
              center.geometry.coordinates[1],
              0
            );
            let _this = this;
            //动态绘制矩形
            this.rectangleEntity.polygon.hierarchy =
              new Cesium.CallbackProperty(function () {
                return {
                  positions:
                    Cesium.Cartesian3.fromDegreesArray(_this.entityEdit.westSouthEastNorth),
                };
              }, false);
            //动态绘制矩形的边框
            this.rectangleEntity.polyline.positions =
              new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegreesArray(_this.entityEdit.westSouthEastNorth);
              }, false);
          } else if (pick.id.name === "中间") {
            // that.viewer.entities.remove(leftTop);
            // that.viewer.entities.remove(rightDown);
            centerPoint.position._value = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
            var pt = turf.point([lng1, lat1], { "marker-color": "F00" });


            leftTop.position._value = Cesium.Cartesian3.fromDegrees(
              this.entityEdit.westSouthEastNorth[0],
              this.entityEdit.westSouthEastNorth[1],
              0
            );

            rightDown.position._value = Cesium.Cartesian3.fromDegrees(
              this.entityEdit.westSouthEastNorth[4],
              this.entityEdit.westSouthEastNorth[5],
              0
            );

            //计算矩形的中心点
            var features = turf.featureCollection([
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[0]),
                Number(this.entityEdit.westSouthEastNorth[1]),
              ]),
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[4]),
                Number(this.entityEdit.westSouthEastNorth[5]),
              ]),
            ]);

            //绘制中心点
            var center = turf.center(features);

            //计算中心点到左上角点位的角度
            var point1 = turf.point([
              Number(center.geometry.coordinates[0]),
              Number(center.geometry.coordinates[1]),
            ]);
            var point2 = turf.point([this.entityEdit.westSouthEastNorth[0], this.entityEdit.westSouthEastNorth[1]]);
            var bearingInit = turf.bearing(point1, point2);
            //计算中心点到右下角点位的角度
            var bearingesInit = turf.bearing(
              point1,
              turf.point([this.entityEdit.westSouthEastNorth[4], this.entityEdit.westSouthEastNorth[5]])
            );

          
            //计算矩形 斜边的距离
            var from = turf.point([ this.entityEdit.westSouthEastNorth[0],  this.entityEdit.westSouthEastNorth[1]]);
            var to = turf.point([ this.entityEdit.westSouthEastNorth[4],  this.entityEdit.westSouthEastNorth[5]]);
            var options = { units: "kilometers" };
            var distance = turf.distance(from, to, options);
            var distances = distance / 2;
            var bearing = bearingInit;
            var options = { units: "kilometers" };

            var destination = turf.rhumbDestination(
              pt,
              distances,
              bearing,
              options
            );
            var bearinges = bearingesInit;
            var destinationes = turf.rhumbDestination(
              pt,
              distances,
              bearinges,
              options
            );
            const { coordinates } = destination.geometry;
            this.rectangleEntity.position = Cesium.Cartesian3.fromDegrees(
              coordinates[0],
              coordinates[1],
              0
            );
            this.entityEdit.westSouthEastNorth = [
              coordinates[0],
              coordinates[1],
              coordinates[0],
              destinationes.geometry.coordinates[1],
              destinationes.geometry.coordinates[0],
              destinationes.geometry.coordinates[1],
              destinationes.geometry.coordinates[0],
              coordinates[1],
              coordinates[0],
              coordinates[1],
            ];
            this.entityEdit.lon = coordinates[0];
            this.entityEdit.lat = coordinates[1];
            //动态绘制矩形
            this.rectangleEntity.polygon.hierarchy =
              new Cesium.CallbackProperty(function () {
                return {
                  positions: Cesium.Cartesian3.fromDegreesArray(
                    _this.entityEdit.westSouthEastNorth
                  ),
                };
              }, false);
            //动态绘制矩形的边框
            this.rectangleEntity.polyline.positions =
              new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegreesArray(
                  _this.entityEdit.westSouthEastNorth
                );
              }, false);
          }else if(pick.id.name=='右下'){
              // that.viewer.entities.remove(centerPoint);
            rightDown.position._value = Cesium.Cartesian3.fromDegrees(
              lng1,
              lat1,
              0
            );
            // this.rectangleEntity.position = Cesium.Cartesian3.fromDegrees(
            //   lng1,
            //   lat1,
            //   0
            // );
            this.entityEdit.westSouthEastNorth[3] = lat1;
            this.entityEdit.westSouthEastNorth[4] = lng1;
            this.entityEdit.westSouthEastNorth[5] =  lat1;
            this.entityEdit.westSouthEastNorth[6] = lng1;

            // this.entityEdit.lon = lng1;
            // this.entityEdit.lat = lat1;


            //计算矩形的中心点
            var features = turf.featureCollection([
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[0]),
                Number(this.entityEdit.westSouthEastNorth[1]),
              ]),
              turf.point([
                Number(this.entityEdit.westSouthEastNorth[4]),
                Number(this.entityEdit.westSouthEastNorth[5]),
              ]),
            ]);
            var center = turf.center(features);

            centerPoint.position._value = Cesium.Cartesian3.fromDegrees(
              center.geometry.coordinates[0],
              center.geometry.coordinates[1],
              0
            );
            let _this = this;
            //动态绘制矩形
            this.rectangleEntity.polygon.hierarchy =
              new Cesium.CallbackProperty(function () {
                return {
                  positions:
                    Cesium.Cartesian3.fromDegreesArray(_this.entityEdit.westSouthEastNorth),
                };
              }, false);
            //动态绘制矩形的边框
            this.rectangleEntity.polyline.positions =
              new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegreesArray(_this.entityEdit.westSouthEastNorth);
              }, false);


          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      }
      this.handler.setInputAction(() => {
        if(handlers !==null){
          handlers.destroy();
          handlers = null;
        }
        // that.viewer.entities.remove(this.rectangleEntity);

        //右击确定之后 将回调函数更改为静态的数组数据
        this.rectangleEntity.polygon.hierarchy =
          Cesium.Cartesian3.fromDegreesArray(
            this.entityEdit.westSouthEastNorth
          );
        this.rectangleEntity.polyline.positions =
          Cesium.Cartesian3.fromDegreesArray(
            this.entityEdit.westSouthEastNorth
          );
        //结束绘制之后的回调函数
        this.DrawEndEvent.raiseEvent(this.entityEdit, this.rectangleEntity,this.rectanglePoint);

        that.viewer.scene.screenSpaceCameraController.enableInputs  = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      this.handler.setInputAction(() => {
        //右击确定之后 将回调函数更改为静态的数组数据
        this.rectangleEntity.polygon.hierarchy =
          Cesium.Cartesian3.fromDegreesArray(
            this.entityEdit.westSouthEastNorth
          );
        this.rectangleEntity.polyline.positions =
          Cesium.Cartesian3.fromDegreesArray(
            this.entityEdit.westSouthEastNorth
          );
        
        if(this.handler!==null){
          this.handler.destroy();
          this.handler =null;
          
        }
        if(handlers !==null){
          handlers.destroy();
          handlers = null;
        }
        
        //清除活动点
        if (this.rectanglePoint.length) {
          this.rectanglePoint.forEach((item) => {
            that.viewer.entities.remove(item);
          });
          this.rectanglePoint =[];
        }
       //结束绘制之后的回调函数
       this.DrawEndEvent.raiseEvent(this.entityEdit, this.rectangleEntity,this.rectanglePoint);
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);

    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  }

  destroys(){
    if(this.handler!==null){
      this.handler.destroy();
      this.handler =null;
      
    }
     //清除活动点
     if (this.rectanglePoint.length) {
      this.rectanglePoint.forEach((item) => {
        that.viewer.entities.remove(item);
      });
      this.rectanglePoint =[];
    }
  }
}
export default EditRectangle;
