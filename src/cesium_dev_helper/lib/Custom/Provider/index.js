// 在 Cesium 中，一个数据提供者（provider）通常指的是各种数据源， 比如
// 1.图像提供者（ImageryProvider）、
// 2.地形提供者（TerrainProvider）、
// 3.以及实体数据源（EntityDrawer DataSource）。

// 每种类型的提供者都有特定的方法和属性来管理和访问数据。💫
// 通过继承和扩展 ImageryProvider、TerrainProvider、DataSource 等基类，
// 可以创建自定义的数据提供者，以适应特定的需求和场景。
// 这个过程确保了自定义提供者能够与 Cesium 的核心架构兼容，并利用 Cesium 的强大功能。


// 下面是一些常见的提供者及其必备方法和属性：🧐

// ImageryProvider-📌-----------------------------------------------------------
// ImageryProvider 是用来提供影像图层的类。所有影像提供者都需要实现以下方法和属性：

// Properties:💨
// -ready: 表示影像提供者是否已准备好提供影像。
// -tileWidth: 瓦片宽度（以像素为单位）。
// -tileHeight: 瓦片高度（以像素为单位）。
// -maximumLevel: 支持的最大缩放级别。
// -minimumLevel: 支持的最小缩放级别。
// -rectangle: 影像提供者覆盖的地理区域。
// -tileDiscardPolicy: 用于决定是否丢弃瓦片的策略。
// -errorEvent: 当发生错误时触发的事件。
// Methods:💓
// -requestImage(x, y, level): 请求指定瓦片的影像。
// -pickFeatures(x, y, level, longitude, latitude): 请求指定瓦片的特征信息。

// TerrainProvider-📌-----------------------------------------------------------
// TerrainProvider 是用来提供地形数据的类。所有地形提供者都需要实现以下方法和属性：

// Properties:💨
// -ready: 表示地形提供者是否已准备好提供地形。
// -hasVertexNormals: 表示地形提供者是否提供顶点法线。
// -hasWaterMask: 表示地形提供者是否提供水体掩码。
// -errorEvent: 当发生错误时触发的事件。
// Methods:💓
// -requestTileGeometry(x, y, level): 请求指定瓦片的地形几何数据。
// -getLevelMaximumGeometricError(level): 获取指定缩放级别的最大几何误差。
// -getTileDataAvailable(x, y, level): 检查指定瓦片的地形数据是否可用。

// -DataSource (EntityDrawer DataSource)--📌---------------------------------------------
// -DataSource 是用来管理实体数据的类。所有数据源都需要实现以下方法和属性：
// Properties:💨
// -name: 数据源的名称。
// -entities: 实体集合。
// -isLoading: 表示数据源是否正在加载。
// -changedEvent: 数据源发生变化时触发的事件。
// -errorEvent: 数据源发生错误时触发的事件。
// -loadingEvent: 数据源加载状态改变时触发的事件.
// Methods:💓
// -load(data): 加载数据源。
// -update(time): 更新数据源。


// class CustomImageryProvider {👻
//     constructor(options) {
//         this._ready = false;
//         this._tileWidth = 256;
//         this._tileHeight = 256;
//         this._maximumLevel = 18;
//         this._minimumLevel = 0;
//         this._rectangle = Cesium.Rectangle.MAX_VALUE;
//         this._tileDiscardPolicy = undefined;
//         this._errorEvent = new Cesium.Event();

//         // 假设初始化一些数据
//         this._initialize();
//     }

//     get ready() {
//         return this._ready;
//     }

//     get tileWidth() {
//         return this._tileWidth;
//     }

//     get tileHeight() {
//         return this._tileHeight;
//     }

//     get maximumLevel() {
//         return this._maximumLevel;
//     }

//     get minimumLevel() {
//         return this._minimumLevel;
//     }

//     get rectangle() {
//         return this._rectangle;
//     }

//     get tileDiscardPolicy() {
//         return this._tileDiscardPolicy;
//     }

//     get errorEvent() {
//         return this._errorEvent;
//     }

//     _initialize() {
//         // 模拟一些异步操作
//         setTimeout(() => {
//             this._ready = true;
//         }, 1000);
//     }

//     requestImage(x, y, level) {
//         if (!this._ready) {
//             throw new Cesium.DeveloperError('Imagery provider is not ready.');
//         }
//         // 假设返回一个图片URL
//         const url = `https://example.com/tiles/${level}/${x}/${y}.png`;
//         return Cesium.ImageryProvider.loadImage(this, url);
//     }

//     pickFeatures(x, y, level, longitude, latitude) {
//         // 返回空数组，因为此示例不支持特征信息
//         return [];
//     }
// }

// // 使用自定义影像提供者
// const viewer = new Cesium.Viewer('cesiumContainer', {
//     imageryProvider: new CustomImageryProvider(),
//     baseLayerPicker: false
// });
