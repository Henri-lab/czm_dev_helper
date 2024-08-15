import { insertHtml, h } from "vite-plugin-insert-html";

// 路径配置
const base = "/";
const cesiumBaseUrl = env.VITE_CESIUM_BASE_URL;

export const useInsertHtlml = () => {
    return [
        insertHtml({
            // 在head标签中插入内容
            head: [
                // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接，开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
                h("script", {
                    // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
                    src: isProd
                        ? `${cesiumBaseUrl}Cesium.js`
                        : `${base}${cesiumBaseUrl}Cesium.js`,
                }),
                h("link", {
                    rel: "stylesheet",
                    href: isProd
                        ? `${cesiumBaseUrl}Widgets/widgets.css`
                        : `${base}${cesiumBaseUrl}Widgets/widgets.css`,
                }),
            ],
        })
    ]
}

// # vite-plugin-insert-html 插件

// `vite-plugin-insert-html` 是一个 Vite 插件，允许在构建过程中动态地向 HTML 文件中插入内容。

// ## 主要功能

// ### `insertHtml`

// - **描述**: 用于插入静态 HTML 内容到 HTML 文件中指定的位置。
// - **参数**:
//   - `selector`: CSS 选择器，用于定位 HTML 文件中的元素。
//   - `html`: 要插入的 HTML 字符串。
//   - `position`: 插入位置，可以是 `'beforebegin'`, `'afterbegin'`, `'beforeend'`, `'afterend'`。
// - **示例**:
//   ```javascript
//   insertHtml('#app', '<div>Hello World!</div>', 'beforeend'),

