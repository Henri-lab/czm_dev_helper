import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';


export const useElementPlus = () => {
    return [
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        AutoImport({
            // imports: ['vue', 'vue-router', 'vue-i18n', 'vue-tsc', 'pinia'],
            // dts: 'src/auto-import.d.ts',
            resolvers: [ElementPlusResolver()],
        })
    ]
}