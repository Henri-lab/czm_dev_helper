/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2023-12-18 14:40:31
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 14:22:34
 */
// 导入相关库
import * as Cesium from "cesium";
import {
  initViewer,
  setScene,
  loadTilesets,
  handleDefaultModelEffect,
  flyToDefaultView
} from "@/cesiumTools/sceneManager.js";


// vue的插件: 导出一个对象
// 1. 在该对象必须包含一个install方法
// 2. 当执行app.use(插件对象)时, 会自动执行
export default {
  async install(app) {
    //初始化cesium实例
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODAzN2EzOS1kZDMzLTQ5Y2UtYjYxMi1jMzQxNTdiMTUzN2IiLCJpZCI6NDU5NDIsImlhdCI6MTYxNTYyNDQyOX0.BucgmI6OJ-7ixj7rcQ_Qyg45DkvdHmaLrFwyMYitLcI";

    // 创建地图容器 <div id="map" style="width: 100%; height:100%">
    const container = document.createElement("div");
    container.id = "cesiumContainer";

    document.body.appendChild(container);
    // 初始化cesium地图对象viewer
    const viewer = initViewer("cesiumContainer");
    setScene(viewer);
    flyToDefaultView(viewer)
    const modelUrls = [{
      url:"http://localhost:9003/model/Q6yR6vkj/tileset.json",
      options:{}
    }]
    // 加载多个3dtiles
    await loadTilesets(viewer,modelUrls,(tilesets)=>{
      handleDefaultModelEffect(tilesets[0])
      app.provide("$viewer_tile", { viewer, tilesets });
    })
  },
};
