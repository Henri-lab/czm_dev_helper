// 世界地图
const vcfg_global = {
    containerId: `czm_viewer`,
    baseConfig: {
        navigationHelpButton: true,
        navigationInstructionsInitiallyVisible: true,
    },
    providerConfig: {
        terrainProvider: [],
        imageryProvider: [],
    },
    extraConfig: {
        name: 'global',
        AccessToken: import.meta.env.VITE_CESIUM_KEY,
        logo: false,
        depthTest: true,
    },
};
const get_vcfg_global = (id) => {
    vcfg_global.containerId = `${id}`
    return vcfg_global;
}

export {
    vcfg_global,
    get_vcfg_global,
}