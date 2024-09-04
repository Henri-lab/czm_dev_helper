export default
    `
<template>
    <div class="ex1">
        <CzmMap name="wuhan123" :option="wuhan" width="30%" height="40%">
            <CzmTexture></CzmTexture>
        </CzmMap>
    </div>
</template>

<script setup>
import { CzmTexture, CzmMap } from '../../components'
// 武汉 白模 视图 
import { TencentImageryProvider } from '../../lib/Plugin/mapPlugin';

//腾讯底图
const txOpt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);
const wuhan = {
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

</script>

<style lang="scss" scoped>
.ex1 {
    height: 100vh;
    width: 100vw;
}
</style>
`