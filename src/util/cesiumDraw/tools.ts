export default class Tools {
  private ImageEntity = "";
  //加载影像
  public LoadImage(viewer: any, result: any): void {
    this.ImageEntity = new window.Cesium.WebMapServiceImageryProvider({
      url: `${process.env.VUE_APP_GEO_URL}${result.openLayersMap.requestUrl}`,
      layers: result.openLayersMap.layers, //服务图层，修改成自己发布的名称
      parameters: {
        service: result.openLayersMap.service,
        format: "image/png",
        transparent: true,
      },
    });
    viewer.imageryLayers.addImageryProvider(this.ImageEntity);
  }
  //删除影像
  public delImage(viewer: any) {
    viewer.imageryLayers.remove(this.ImageEntity);
  }
}
