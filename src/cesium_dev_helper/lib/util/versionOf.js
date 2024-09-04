import * as Cesium from 'cesium';
export default function versionOf(lib) {
    if (lib.toLowerCase() === 'cesium') {

        // 根据版本号执行不同的代码
        const version = Cesium.VERSION.split('.');
        // 1.97
        const majorVersion = version[0];//1
        const minorVersion = version[1];//97

        return {
            majorVersion,
            minorVersion
        };
    }
}

// test
versionOf('cesium')

export function getNewCzm(lib) {
    if (lib.toLowerCase() === 'cesium') {
        const { majorVersion, minorVersion } = versionOf(lib)
        // 新版 Cesium 代码 1.90之上
        if (majorVersion == 1 && minorVersion >= 90) {
            console.log('Running new version code');
            return Cesium
        }
        else
            // 旧版 Cesium 代码 1.89 以下
            console.log('Running old version code');
    }
}


// Cesium 的不同版本之间有时会引入一些显著的变化，特别是在主要版本升级时。以下是一些主要的版本更新以及企业中常见的版本：

// 主要版本更新
// Cesium 1.0 到 1.20

// 初期版本主要在性能优化、基本功能和 API 稳定性方面进行改进。
// Cesium 1.20 到 1.50

// 引入了更多高级功能，如地形剪切、3D Tiles 支持、改进的材质和着色器支持。
// 改进了渲染引擎和数据处理能力。
// Cesium 1.50 到 1.80

// 增加了对大规模 3D Tiles 数据集的支持。
// 改善了 WebGL 性能和内存管理。
// 引入了更多的可视化工具和插件支持。
// Cesium 1.80 之后

// 增加了对 Cesium ion 的支持，简化了数据处理和上传。
// 提供了更多的云服务和工具，提升了整体生态系统的能力。
// 持续改进 WebGL 性能和添加新功能，如更多的几何类型和更复杂的材质效果。
// 企业常用版本
// 企业在选择 Cesium 版本时，通常会考虑稳定性、性能和功能特性。以下是一些在企业中流行的 Cesium 版本：

// Cesium 1.50

// 被广泛采用，因为它在功能和稳定性之间达到了良好的平衡。
// 支持大规模 3D Tiles 数据集，适用于城市建模和地理信息系统。
// Cesium 1.70

// 提供了改进的渲染性能和内存管理。
// 增强了对高级材质和着色器的支持，适用于更复杂的可视化需求。
// Cesium 1.80

// 增强了对 Cesium ion 的支持，简化了数据处理和云服务集成。
// 适用于需要高效数据处理和实时渲染的应用场景。
// Cesium 1.90 及以上

// 包含最新的功能和性能优化，适用于需要最先进技术和持续更新支持的企业。
// 提供更好的开发者体验和更广泛的功能集。
// 版本选择建议
// 企业在选择 Cesium 版本时，应考虑以下因素：

// 功能需求：

// 如果需要使用最新的功能和改进，选择较新的版本。
// 如果现有版本已经满足需求，且系统稳定性是首要考虑，可以选择稳定的旧版本。
// 兼容性：

// 确保新版本与现有系统和数据格式兼容。
// 如果存在重大 API 变化，评估升级所需的开发和测试成本。
// 支持和文档：

// 选择提供良好文档和社区支持的版本。
// 如果企业依赖 Cesium ion 或其他云服务，确保版本与这些服务兼容。