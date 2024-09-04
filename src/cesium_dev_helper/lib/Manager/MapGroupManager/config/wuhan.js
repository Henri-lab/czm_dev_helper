import { TencentImageryProvider } from '../../../Plugin/mapPlugin';

//腾讯底图
const tc_Opt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(tc_Opt);


const Config = {
    viewerConfig: {
        containerId: 'cesiumContainer', // 容器的 ID
        baseConfig: {},
        providerConfig: {
            terrainProvider: [],
            imageryProvider: [
                {
                    type: 'UrlTemplateImageryProvider',
                    option: {
                        customProvider: tcip,
                    },
                },
            ],
        },
        extraConfig: {
            name: 'wuhan',
            AccessToken: import.meta.env.VITE_CESIUM_KEY,
            logo: false,
            depthTest: true,
            canvas: {
                // width: 800,
                // height: 600
            }
        }
    },
    sceneConfig: {
        dataOptions: {
            modelOptions: {
                tilesetOptions: {
                    url: "http://localhost:8001/wuhan/tileset.json",
                    maximumScreenSpaceError: 2,
                    maximumNumberOfLoadedTiles: 100
                },
                // gltfOptions: {
                //     url: 'https://example.com/model.gltf',
                //     modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0)),
                //     scale: 1.0,
                //     minimumPixelSize: 128
                // }
            },
        },
        // baseOptions: {
        //     enableLighting: true,
        //     depthTestAgainstTerrain: true,
        //     shadows: true,
        //     globe: {
        //         show: true,
        //         baseColor: Cesium.Color.BLACK
        //     }
        // }
    },
    cameraConfig: {
        viewOptions: {
            destination: Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 3000),
            heading: Cesium.Math.toRadians(35.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
        },
        flyOptions: {
            position: {//wuhan
                longitude: 114.2977,
                latitude: 30.5961,
                height: 40000,
            },
            effectOptions: {
                orientation: {
                    heading: Cesium.Math.toRadians(90.0),
                    pitch: Cesium.Math.toRadians(-45.0),
                    roll: 0.0
                },
                duration: 3.0
            }
        }
    }
};

export default Config;