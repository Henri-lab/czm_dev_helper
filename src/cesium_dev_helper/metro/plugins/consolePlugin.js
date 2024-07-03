// 改造原生 console 
let consolePlugin1 = null;
let consolePlugin2 = null;

// 重写 
// 经过测试发现拦截不了来自cesium的打印！      ???
consolePlugin1 = {
    install(app) {

        // Save the original console methods
        const originalConsoleError = console.error;
        // Override the console.error method
        console.error = function (message, ...args) {
            const s0 = 'GET https://rt0.map.gtimg.com/tile';
            const s1 = 'GET https://rt1.map.gtimg.com/tile';
            const s2 = 'GET https://rt2.map.gtimg.com/tile';

            let sArr = [s0, s1, s2];

            // 拦截 ：经过测试发现拦截不了来自cesium的打印！
            if (typeof message === 'string') {
                // Suppress this specific error
                for (let s of sArr) {
                    if (message.includes(s)) {
                        return;
                    }
                }
            }
            // Call the original console.error method
            originalConsoleError.apply(console, [message, ...args]);

            // Restore the original console.error method after initialization
            console.error = originalConsoleError;
        };
    }
}

// 代理
// 经过测试发现拦截不了来自cesium的打印！         ???
consolePlugin2 = {
    install(app) {
        // Save the original console.error method
        const originalConsoleError = console.error;

        // Create a proxy for the console.error method
        console.error = new Proxy(originalConsoleError, {
            apply(target, thisArg, args) {
                const message = args[0];
                const s0 = 'GET https://rt0.map.gtimg.com/tile';
                const s1 = 'GET https://rt1.map.gtimg.com/tile';
                const s2 = 'GET https://rt2.map.gtimg.com/tile';

                let sArr = [s0, s1, s2];

                if (typeof message === 'string') {
                    // Suppress this specific error
                    for (let s of sArr) {
                        if (message.includes(s)) {
                            return;
                        }
                    }
                }

                // Call the original console.error method
                return Reflect.apply(target, thisArg, args);
            }
        });
    }
}

export {
    consolePlugin1,
    consolePlugin2
}
