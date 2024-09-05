export default
    `
<template>
    <div class="ex1">
        <CzmMap name="wuhan123" :option="wuhan" width="30%" height="40%" />
    </div>
</template>

<script setup>
import { CzmTexture, CzmMap } from 'cesium_dev_helper/components'
import { TencentImageryProvider } from 'cesium_dev_helper/Plugin/mapPlugin';

const txOpt = {
    style: 4, //style: img、1：经典
    crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);//腾讯底图
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
`