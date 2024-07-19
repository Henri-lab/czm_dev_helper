import DataLoader from "./DataLoader";
import DataPrepocesser from "./DataPrepocesser";
import gifLoader from "./gifLoader";
import {
    defaultHierachyCache,
    hierarchyNavigate,
} from './hierachy'

export {
    DataLoader,
    DataPrepocesser,
    gifLoader,
    defaultHierachyCache,
    hierarchyNavigate,
}

// 在 3D 数据可视化和 GIS 应用中，有多种 3D 数据格式可供使用。以下是一些常见的 3D 数据格式及其在 Cesium 中的应用和性能比较：

// 常见 3D 数据格式
// 3D Tiles
// I3S (Indexed 3D Scene Layer)
// GLTF (GL Transmission Format) / GLB
// KML/COLLADA
// GeoJSON
// 1. 3D Tiles
// 特点
// 专门为大规模 3D 数据集设计，如城市模型、点云和 BIM 数据。
// 使用空间索引（如四叉树或八叉树）来管理和优化数据加载。
// 支持多分辨率和渐进式加载。
// 优点
// 高效的空间索引和数据管理，适合大规模数据集。
// 支持多种数据类型（模型、点云、矢量数据）。
// 缺点
// 格式复杂，数据转换和处理可能需要更多时间。
// 性能
// 优秀的加载和渲染性能，适用于需要实时交互的大规模 3D 数据。
// 示例
// const viewer = new Cesium.Viewer('cesiumContainer');
// const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
//   url: 'https://example.com/tileset.json'
// }));
// viewer.zoomTo(tileset);
// 2. I3S (Indexed 3D Scene Layer)
// 特点
// 由 Esri 开发，广泛应用于 ArcGIS 平台。
// 支持大规模城市模型和点云数据。
// 高效的空间索引和渐进式加载。
// 优点
// 与 ArcGIS 平台的良好集成。
// 支持多分辨率和渐进式加载。
// 缺点
// 主要与 Esri 生态系统绑定，其他平台的支持可能不如 3D Tiles。
// 性能
// 类似于 3D Tiles，高效的加载和渲染性能。
// 示例
// const viewer = new Cesium.Viewer('cesiumContainer');
// const i3sLayer = Cesium.I3SLayer.fromUrl('https://example.com/i3s');
// viewer.scene.primitives.add(i3sLayer);
// viewer.zoomTo(i3sLayer);
// 3. GLTF (GL Transmission Format) / GLB
// 特点
// 开放的 3D 模型格式，由 Khronos Group 开发。
// 支持纹理、动画、材质等复杂的 3D 模型细节。
// GLB 是 GLTF 的二进制格式，包含相同的信息但文件更小。
// 优点
// 广泛支持，多种工具和平台兼容。
// 高效的加载和渲染性能。
// 缺点
// 不支持空间索引，不适合非常大规模的 3D 数据集。
// 性能
// 适合中小规模的 3D 模型，加载和渲染性能优良。
// 示例
// const viewer = new Cesium.Viewer('cesiumContainer');
// const entity = viewer.entities.add({
//   name: '3D Model',
//   position: Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
//   model: {
//     uri: 'path/to/model.glb'
//   }
// });
// viewer.zoomTo(entity);
// 4. KML/COLLADA
// 特点
// KML 是一种用于描述地理数据的 XML 格式，通常与 COLLADA（.dae）模型文件结合使用。
// 常用于地理标记和简单的 3D 模型。
// 优点
// 简单易用，适合地理标记和路径可视化。
// 与 Google Earth 等应用兼容。
// 缺点
// 性能不如 3D Tiles 和 I3S，不适合大规模 3D 数据。
// 性能
// 适用于简单的 3D 模型和地理标记，加载和渲染性能中等。
// 示例
// const viewer = new Cesium.Viewer('cesiumContainer');
// const kmlDataSource = new Cesium.KmlDataSource.load('path/to/file.kml');
// viewer.dataSources.add(kmlDataSource);
// viewer.zoomTo(kmlDataSource);
// 5. GeoJSON
// 特点
// 一种基于 JSON 格式的标准，用于表示简单的地理要素。
// 支持点、线、面等基本几何形状。
// 优点
// 简单易用，广泛支持。
// 适合描述矢量地理数据。
// 缺点
// 不支持复杂的 3D 模型。
// 性能
// 适用于简单的地理数据和标记，加载和渲染性能良好。
// 示例
// const viewer = new Cesium.Viewer('cesiumContainer');
// const geoJsonDataSource = Cesium.GeoJsonDataSource.load('path/to/file.geojson');
// viewer.dataSources.add(geoJsonDataSource);
// viewer.zoomTo(geoJsonDataSource);
// 性能比较
// 3D Tiles 和 I3S：适合大规模 3D 数据集，具有高效的空间索引和渐进式加载特性，性能最佳。
// GLTF/GLB：适合中小规模的 3D 模型，加载和渲染性能优良。
// KML/COLLADA 和 GeoJSON：适合简单的地理标记和路径，可视化性能中等。
// 选择合适的 3D 数据格式取决于应用场景和数据规模。在需要高效处理和渲染大规模 3D 数据时，3D Tiles 和 I3S 是理想的选择；而对于较小规模的 3D 模型和简单的地理数据，GLTF/GLB 和 GeoJSON 是更合适的选择。