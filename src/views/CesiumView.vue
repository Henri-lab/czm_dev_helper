<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:34:13
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:40:27
-->
<template>
    <div id="cesium-viewer">
        <slot/>
    </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";
import app from '../main'
import {
    initViewer,
    setScene,
    loadTilesets,
    handleDefaultModelEffect,
    flyToDefaultView
} from "@/cesiumTools/sceneManager";

//初始化cesium实例
Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODAzN2EzOS1kZDMzLTQ5Y2UtYjYxMi1jMzQxNTdiMTUzN2IiLCJpZCI6NDU5NDIsImlhdCI6MTYxNTYyNDQyOX0.BucgmI6OJ-7ixj7rcQ_Qyg45DkvdHmaLrFwyMYitLcI";

onMounted(async () => {
    const viewer = initViewer("cesium-viewer");
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
});
</script>
<style>
#cesium-viewer {
    width: 100%;
    height: 100%;
    pointer-events: all;
}
</style>