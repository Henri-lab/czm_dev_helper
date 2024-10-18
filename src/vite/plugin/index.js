import { useElementPlus } from "./autoImport";
import { useGlsl } from "./glsl";
import { useVuePlugin } from "./vue";
import { useInsertHtlml } from "./insertHtml";
import { useViteExternalsPlugin } from "./viteExternalsPlugin";
import { useViteStaticCopy } from "./viteStaticCopy";
import { useCompress } from "./compress";

import commonjs from 'vite-plugin-commonjs';


// export let pluginOption = [];
export const usePlugins = ({ isProd = false, base = '/', cesiumBaseUrl }) => {
    const arrOfArr = [
        useVuePlugin(),
        useElementPlus(),
        useGlsl(),
        useInsertHtlml({ isProd, base, cesiumBaseUrl }),
        useViteExternalsPlugin(),
        useCompress(),
        commonjs()
    ]
    if (!isProd) {
        arrOfArr.push(useViteStaticCopy())
    }
    return arrOfArr.flat(1)
}


