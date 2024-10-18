import { fileURLToPath } from "url";
require('path')

export const resolveOption = {
    alias: {
        // "@": fileURLToPath(new URL("./src", import.meta.url)),
        '@': '/src',
        '@czmHelper': '/src/cesium_dev_helper/lib',
        'codemirror': path.resolve(__dirname, 'node_modules/codemirror')
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],//扩展名自动补全 优先级依次递减
}