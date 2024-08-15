import { fileURLToPath } from "url";

export const resolveOption = {
    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],//扩展名自动补全 优先级依次递减
}