export default class Draw {
  private sectorList: any[] = []; //扇形存储
  //绘制扇形
  public drawSector(viewer: any, params: any) {
    const calculatingTargetPoints = (
      lon: any,
      lat: any,
      height: any,
      direction: any,
      radius: any
    ) => {
      //根据位置，方位，距离求经纬度
      var viewPoint = window.Cesium.Cartesian3.fromDegrees(lon, lat, height);
      var webMercatorProjection = new window.Cesium.WebMercatorProjection(
        viewer.scene.globe.ellipsoid
      );
      var viewPointWebMercator = webMercatorProjection.project(
        window.Cesium.Cartographic.fromCartesian(viewPoint)
      );
      var toPoint = new window.Cesium.Cartesian3(
        viewPointWebMercator.x + radius * Math.cos(direction),
        viewPointWebMercator.y + radius * Math.sin(direction),
        0
      );
      toPoint = webMercatorProjection.unproject(toPoint);
      toPoint = window.Cesium.Cartographic.toCartesian(toPoint.clone());
      var cartographic = window.Cesium.Cartographic.fromCartesian(toPoint);
      var point = [
        window.Cesium.Math.toDegrees(cartographic.longitude),
        window.Cesium.Math.toDegrees(cartographic.latitude),
      ];
      return point;
    };
    const drawSector = (params: any) => {
      var d1 = params.d1;
      var d2 = params.d2;
      var list = [Number(params.lng), Number(params.lat)];
      for (let i = d1; i < d2; i += 1) {
        var point = calculatingTargetPoints(
          params.lng,
          params.lat,
          0,
          (90 - i) * (Math.PI / 180),
          params.zcjl
        );
        list.push(point[0]);
        list.push(point[1]);
      }
      list.push(Number(params.lng));
      list.push(Number(params.lat));
      let box = viewer.entities.add({
        polygon: {
          hierarchy: window.Cesium.Cartesian3.fromDegreesArray(list),
          material: window.Cesium.Color.RED.withAlpha(0.4),
        },
      });
      this.sectorList.push(box);
    };
    drawSector(params);
  }
  //清除扇形entity
  public clearSector(viewer: any) {
    this.sectorList.forEach((item: any) => {
      viewer.entities.remove(item);
    });
  }

  //绘制点位 entity
  public drawEntity(Lon: Number, Lat: Number, name: string) {
    let poin = that.viewer.entities.add({
      position: window.Cesium.Cartesian3.fromDegrees(Lon, Lat),
      point: {
        color: new window.Cesium.Color(1, 0, 0, 1),
        pixelSize: 10.0,
      },
      label: {
        text: name,
        font: "12px sans-serif",
        backgroundColor: window.Cesium.Color.BLACK,
        fillColor: window.Cesium.Color.WHITE,
        showBackground: true,
        style: window.Cesium.LabelStyle.FILL,
        outlineWidth: 1,
        horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
        pixelOffset: window.Cesium.Cartesian2(5.0, -20.0),
      },
    });
    return poin;
  }

  //绘制线
  public drawLine(params: any) {
    let line = that.viewer.entities.add({
      polyline: {
        positions: window.Cesium.Cartesian3.fromDegreesArray(params),
        material: window.Cesium.Color.RED.withAlpha(0.5),
        width: 2,
      },
    });
    return line;
  }

  //箭头线
  // public drawLineJT(params: any) {
  //   let line = that.viewer.entities.add({
  //     polyline: {
  //       positions: window.Cesium.Cartesian3.fromDegreesArray(params),
  //       material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
  //       width: 5,
  //     },
  //   });
  //   return line;
  // }

  //fly
  public flyTo(lon, lat, height = 100000) {
    that.viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(lon, lat, height),
    });
  }

  //清除entity
  public clearEntity(entity: any) {
    if (entity) {
      that.viewer.entities.remove(entity);
    }
  }
}
