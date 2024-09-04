// 假设czm的地图容器的id : cesiumContainer

import * as Cesium from "cesium";
import Manager from "../Manager";
import initMap from "./initMap";

// 多视图管理
// 可以保存视图和销毁视图
const emptyMap = new Cesium.Viewer('cesiumContainer', {});
export default class MapGroupManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.curMap = emptyMap;
        this.mapCopy = null;
        this.maps = [];
    }

    // 创建地图
    createMap(config) {
        const map = initMap(config);
        this.mapCopy = map;
        return map;
    }
    // 切换地图 - 不要销毁
    switchMapTo(map) {
        if (this.curMap) {
            this.curMap.container.style.display = 'none';
        }
        map.container.style.display = 'block';
        this.curMap = map;
    }
    // 全屏地图+监听
    fullScreenMap(map) {
        // 获取 HTML 容器元素
        const container = map.container;

        // 定义一个进入全屏模式的函数
        const requestFullscreen = (element) => {
            if (element.requestFullscreen) {
                element.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) { // 注意：Firefox 使用的是 `mozRequestFullScreen`
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else {
                console.error("Fullscreen API is not supported by this browser.");
            }
        };

        // 调用进入全屏模式的函数
        requestFullscreen(container);

        // 添加一个事件监听器来处理全屏模式的退出
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                console.log('Exited full-screen mode.');
            }
        });
        document.addEventListener('mozfullscreenchange', () => {
            if (!document.mozFullScreenElement) {
                console.log('Exited full-screen mode.');
            }
        });
        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement) {
                console.log('Exited full-screen mode.');
            }
        });
        document.addEventListener('msfullscreenchange', () => {
            if (!document.msFullscreenElement) {
                console.log('Exited full-screen mode.');
            }
        });
    }
    // 保存地图
    saveMap(map) {
        this.maps.push(map);
    }
    // 删除地图
    deleteMap(map) {
        this.maps = this.maps.filter(m => m !== map);
    }
    // 销毁地图
    destroyMap(map) {
        map.destroy();
        this.deleteMap(map);
        // 缓存补充
        if (this.maps.length > 0) {
            this.curMap = this.maps[this.maps.length - 1]
        }
        // 彻底没有地图了
        else {
            this.curMap = emptyMap;
        }
    }
    // 获取展示地图
    getCurMap() {
        return this.curMap;
    }
    // 获取所有地图
    getAllMaps() {
        return this.maps;
    }

    // 重置 销毁 所有地图
    resetAllMaps() {
        this.maps.forEach(map => map.destroy());
        this.maps = [];
        this.curMap = emptyMap;
    }
}