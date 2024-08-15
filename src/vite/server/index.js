export const serverOption = {
    port: 9000,
    host: true,
    open: true,
    proxy: {
        "/dev": {
            target: "http://127.0.0.1:8888",
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/dev/, ''),
        },
    },
}