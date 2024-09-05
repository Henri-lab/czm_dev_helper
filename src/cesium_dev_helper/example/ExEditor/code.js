export default
    `
<template>
    <div class="ex1">
        <CzmMap 
        name="wuhan123" 
        :option="wuhan" 
        width="30%" 
        height="40%" />
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
        AccessToken: '~~~',
        logo: false,
        depthTest: true,
    },
};
</script>
`