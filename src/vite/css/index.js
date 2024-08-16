export const cssOption = {
    // css预处理器
    preprocessorOptions: {
        scss: {
            // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
            // 给导入的路径最后加上 ;
            additionalData: '@import "@/assets/scss/mixin.scss";',
        },
    },
    // css后处理器
    postcss: {
        plugins: [
            {
                postcssPlugin: "internal:charset-removal",
                AtRule: {// 删除css中的@charset规则 
                    charset: (atRule) => {
                        if (atRule.name === "charset") {
                            atRule.remove();
                        }
                    },
                },
            },
        ],
    },
}