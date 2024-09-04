const Config = {
    viewerConfig: {
        containerId: 'cesiumContainer', // 容器的 ID
        extraConfig: {
            name: 'global',
            AccessToken: import.meta.env.VITE_CESIUM_KEY,
            logo: false,
            depthTest: true,
            canvas: {
                // width: 800,
                // height: 600
            }
        }
    },
};

export default Config;