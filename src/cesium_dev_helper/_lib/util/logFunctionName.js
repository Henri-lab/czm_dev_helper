// 用于拦截和打印函数名

// ~~ts,babel的装饰器~~:使用高阶函数的方式来模拟装饰器行为 
/**
 * A simple decorator function that logs the name of the function being called.
 *
 * @param {Function} fn - The function to be decorated.
 * @returns {Function} - The decorated function.
*/
function getLogFunction(fn) {
    return function (...args) {
        console.log(`Function ${fn.name} is called`);
        return fn(...args);
    };
}


/**
 * A decorator function that logs the name of the function being called.
 *
 * @param {Object} target - The target object of the method.
 * @param {string} name - The name of the method.
 * @param {PropertyDescriptor} descriptor - The property descriptor of the method.
 * @returns {PropertyDescriptor} - The modified property descriptor.
 */
function logFunctionName(target, name, descriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`${target}.${name} function is called`);
        return originalFunction.apply(this, args);
    };
    return descriptor;
}


// 动态装饰对象中的所有函数
/**
 * Decorates all functions of a given object with a logging decorator.
 * The logging decorator logs the name of the function being called.
 *
 * @param {Object} obj - The object whose functions need to be decorated.
 * @returns {void}
 */
function decorateAllFunctions(obj) {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
    propertyNames.forEach((name) => {
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), name);
        if (descriptor && typeof descriptor.value === 'function' && name !== 'constructor') {
            Object.defineProperty(Object.getPrototypeOf(obj), name, logFunctionName(obj, name, descriptor));
        }
    });
}


export {
    getLogFunction,
    logFunctionName,
    decorateAllFunctions,
}