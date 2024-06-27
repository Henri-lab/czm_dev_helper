let consolePlugin = null;

// 改造原生 console 
export default consolePlugin = {
    install(app) {
        // Save the original console methods
        const originalConsoleError = console.error;
        // Override the console.error method
        console.error = function (message, ...args) {
            if (typeof message === 'string' && message.includes('GET https://rt2.map.gtimg.com/tile')) {
                // Suppress this specific error
                return;
            }
            // Call the original console.error method
            originalConsoleError.apply(console, [message, ...args]);

            // Restore the original console.error method after initialization
            console.error = originalConsoleError;
        };
    }
}