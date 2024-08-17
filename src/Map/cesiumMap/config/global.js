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
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
};
// 可以指定视图挂载元素
const get_vcfg_global = (id) => {
    vcfg_global.containerId = `${id}`
    return vcfg_global;
}

export {
    vcfg_global,
    get_vcfg_global,
}