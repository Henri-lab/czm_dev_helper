import { useElementPlus } from "./elementplus";
import { useGlsl } from "./glsl";
import { useVuePlugin } from "./vue";
import { useInsertHtlml } from "./insertHtml";
import { useViteExternalsPlugin } from "./viteExternalsPlugin";
import { useViteStaticCopy } from "./viteStaticCopy";
import { useCompress } from "./compress";


export const usePlugins = (isProd = false) => {
    const arrOfArr = [
        useVuePlugin(),
        useElementPlus(),
        useGlsl(),
        useInsertHtlml(),
        useViteExternalsPlugin()
    ]
    if (!isProd) {
        arrOfArr.push(useViteExternalsPlugin())
    }
    return arrOfArr.flat(1)
}

