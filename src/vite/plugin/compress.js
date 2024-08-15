import compress from "vite-plugin-compression";

export const useCompress = () => {
    return [
        compress({
            threshold: 10 * 1024,// 10KB 以下不压缩
            // verbose: true,
            // disable: false,
            // algorithm: "gzip",
            // ext: ".gz",
        })
    ]
}   