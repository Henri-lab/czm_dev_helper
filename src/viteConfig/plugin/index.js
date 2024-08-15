import { useElementPlus } from "./elementplus";
import { useGlsl } from "./glsl";
import { useVuePlugin } from "./vue";
import { useInsertHtlml } from "./insertHtml";
import { useViteExternalsPlugin } from "./viteExternalsPlugin";
import { useViteStaticCopy } from "./viteStaticCopy";
import { useCompress } from "./compress";

// export let pluginOption = [];
export const usePlugins = ({ isProd = false }) => {
    const arrOfArr = [
        useVuePlugin(),
        useElementPlus(),
        useGlsl(),
        useInsertHtlml(),
        useViteExternalsPlugin(),
        useCompress(),
    ]
    if (!isProd) {
        arrOfArr.push(useViteStaticCopy())
    }
    return arrOfArr.flat(1)
}


