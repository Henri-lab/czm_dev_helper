import {
    ConfigManager,
    SceneManager,
    CameraManager
} from '../../Manager';
import { CoordTransformer } from '../../Compute';
import { TencentImageryProvider } from '../../Plugin/mapPlugin';

// 使用示例
// initMap(Config);
// const Config = {
//     viewerConfig: {
//         containerId: 'cesiumContainer', // 容器的 ID
//         baseConfig: {
//             useDefaultRenderLoop: true,
//             targetFrameRate: 60,
//             showRenderLoopErrors: false,
//             useBrowserRecommendedResolution: true
//         },
//         providerConfig: {
//             terrainProvider:[
//                               new Cesium.CesiumTerrainProvider({
//                               url: 'https://assets.cesium.com/1',
//                               requestVertexNormals: true
//                        })],
//             imageryProvider: [
//                               {
//                                   type: 'UrlTemplateImageryProvider',
//                                   option: {
//                                       customProvider: tcip,
//                                   },
//                               },
//                             ],
//         },
//         extraConfig: {
//             name: 'MyViewer',
//             AccessToken: 'your_access_token_here',
//             logo: 'path/to/logo.png',
//             depthTest: true,
//             canvas: {
//                 width: 800,
//                 height: 600
//             }
//         }
//     },
//     sceneConfig: {
//         dataOptions: {
//             modelOptions: {
//                 tilesetOptions: {
//                     url: 'https://example.com/tileset.json',
//                     maximumScreenSpaceError: 2,
//                     maximumNumberOfLoadedTiles: 100
//                 },
//                 gltfOptions: {
//                     url: 'https://example.com/model.gltf',
//                     modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0)),
//                     scale: 1.0,
//                     minimumPixelSize: 128
//                 }
//             },
//             // 其他数据选项可以在这里添加
//         },
//         baseOptions: {
//             enableLighting: true,
//             depthTestAgainstTerrain: true,
//             shadows: true,
//             globe: {
//                 show: true,
//                 baseColor: Cesium.Color.BLACK
//             }
//         }
//     },
//     cameraConfig: {
//         viewOptions: {
//             destination: Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 3000),
//             heading: Cesium.Math.toRadians(90.0),
//             pitch: Cesium.Math.toRadians(-45.0),
//             roll: 0.0
//         },
//         flyOptions: {
//             position: Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 1000),
//             effectOptions: {
//                 orientation: {
//                     heading: Cesium.Math.toRadians(90.0),
//                         pitch: Cesium.Math.toRadians(-45.0),
//                             roll: 0.0
//                 },
//                 duration: 5.0
//             }
//         }
//     }
// };

const elID = 'czm-map-groups@henriFox'// 所有地图的大容器 配置id🏆

const cfgM = new ConfigManager();
let sceneM, cameraM;

// 影像图层和地形数据通常被视为 viewer 的一部分，
// 因为它们是 Cesium.Viewer 类的配置选项。
// 影像图层（ImageryLayer）和地形提供者（TerrainProvider）可以在 viewer 的初始化配置中直接设置。
// 另一方面，3D 瓦片集（Tileset）和 GLTF 模型更适合作为场景的一部分，
// 因为它们是通过场景（scene）中的 primitives 添加的。
export default async function initMap(Config, cb) {
    const res = parse(Config);
    const {
        containerId,
        baseOptions,
        gltfOptions,
        tilesetOptions,
        viewerConfig,
        viewOptions,
        flyOptions
    } = res
    // 视图设置
    const $viewer = await cfgM.initViewer(viewerConfig);
    // 返回视图
    cb($viewer)
    // 挂载视图 到 某个id为 elID 的div中
    mountIn(elID)
    // 创建两个新的辅助管理者 帮助管理视图的场景和相机
    sceneM = new SceneManager($viewer);
    cameraM = new CameraManager($viewer);
    // 场景设置
    sceneM.initScene(baseOptions || {})
    // 相机操作
    cameraM.setView(viewOptions)
    cameraM.flyTo(flyOptions)
    // 模型加载
    const loadCb = (res) => console.log('Loaded model:', res.model)
    gltfOptions.url && await sceneM.add3DModel(gltfOptions, 'gltf', loadCb)
    tilesetOptions.url && await sceneM.add3DModel(tilesetOptions, '3dtiles', loadCb)
}



async function parse(Config) {
    // API 设计🎇
    const { viewerConfig, sceneCofig, cameraConfig } = Config ?? {};
    // 解构视图配置
    const { containerId, baseConfig, providerConfig, extraConfig } = viewerConfig ?? {}
    // const { terrainProvider, imageryProvider } = providerConfig?? {};
    // const { name, AccessToken, logo, depthTest, canvas } = extraConfig?? {}
    // const { width, height } = canvas?? {}

    // 解构场景配置
    const { dataOptions, baseOptions } = sceneCofig ?? {}
    const { modelOptions, ...rest /*还没设计好..🧸*/ } = dataOptions ?? {};
    const { tilesetOptions, gltfOptions } = modelOptions ?? {};

    // 结构相机配置
    const { viewOptions, flyOptions } = cameraConfig ?? {}
    // const { destination, head, pitch, roll } = viewOptions?? {}
    // const { position, orientation, duration } = flyOptions?? {}

    const res = {
        containerId,
        baseOptions,
        gltfOptions,
        tilesetOptions,
        viewerConfig,
        viewOptions,
        flyOptions
    }

    return res;
}

function mountIn(elID) {
    // 创建一个新的 DOM 元素并挂载在地图容器的子区域
    const mapContainer = document.getElementById(elID);
    if (mapContainer) {
        const newElement = document.createElement('div');
        newElement.id = 'customElement';
        // 绝对定位
        // newElement.style.position = 'absolute';
        // newElement.style.top = '10px';  
        // newElement.style.left = '10px';
        // grid 或者 flex 布局
        mapContainer.style.position = 'flex';
        newElement.style.width = '500px'; // 自定义宽度
        newElement.style.height = '500px'; // 自定义高度
        newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 半透明背景
        newElement.innerHTML = '<p>Custom content here</p>'; // 自定义内容
        mapContainer.appendChild(newElement);
    }
}