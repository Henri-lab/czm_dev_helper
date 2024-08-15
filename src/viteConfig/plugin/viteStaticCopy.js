import { viteStaticCopy } from "vite-plugin-static-copy";

// 开发模式，复制 node_modules 下的 cesium 依赖
const cesiumLibraryRoot = "node_modules/cesium/Build/CesiumUnminified/";
const cesiumLibraryCopyToRootPath = "libs/cesium/"; // 相对于打包后的路径
const cesiumStaticSourceCopyOptions = [
    "Assets",
    "ThirdParty",
    "Workers",
    "Widgets",
].map((dirName) => {
    return {
        src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
        dest: `${cesiumLibraryCopyToRootPath}${dirName}`,
    };
});
export const useViteStaticCopy = () => {
    return [
        viteStaticCopy({
            targets: [
                // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
                {
                    src: `${cesiumLibraryRoot}Cesium.js`,
                    dest: cesiumLibraryCopyToRootPath,
                },
                // 四大静态文件夹
                ...cesiumStaticSourceCopyOptions,
            ],
        })
    ]
}