// 武汉 白模 视图 
import { TencentImageryProvider } from '../index';

//腾讯底图
const txOpt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);

// 配置viewer
const vcfg_wuhan = {
    containerId: `czm_viewer`,//使用时看情况修改
    baseConfig: {
        navigationHelpButton: true,
        navigationInstructionsInitiallyVisible: true,
        // skyAtmosphere: new Cesium.SkyAtmosphere(),
    },
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
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
};

// 白膜
const modelOpt_wuhan = {
    url: "static/mono/wuhan/tileset.json",
}

// 获取配置 可以指定viewer在哪个容器
const get_vcfg_wuhan = (id) => {
    vcfg_wuhan.containerId = `${id}`
    return vcfg_wuhan;
}

export {
    vcfg_wuhan,
    modelOpt_wuhan,
    get_vcfg_wuhan,
}