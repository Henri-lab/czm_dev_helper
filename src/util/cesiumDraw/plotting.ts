export default class plotting {
  //绘制点位 entity
  public drawPoint(
    lon: Number,
    lat: Number,
    color: string,
    outlineColor: string,
    outlineWidth: string,
    pixelSize: number,
    isDel?: number,
    ids?: number,
    title: string
  ) {
    let point = that.viewer.entities.add({
      name: "点",
      isDel,
      title,
      ids,
      position: window.Cesium.Cartesian3.fromDegrees(lon, lat),
      point: {
        color,
        outlineColor,
        outlineWidth,
        pixelSize,
      },
    });
    return point;
  }
}
