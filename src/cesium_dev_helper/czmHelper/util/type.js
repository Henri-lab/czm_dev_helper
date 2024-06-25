/**
 * Checks if the type of an object matches the specified type.
 *
 * @param {any} obj - The object to check the type of.
 * @param {string} type - The type to compare against.
 * @returns {boolean} True if the object's type matches the specified type, false otherwise.
 *
 * @example
 * let myObject = { name: 'John' };
 * console.log(isTypeOf(myObject, 'Object')); // true
 * console.log(isTypeOf(myObject, 'Array')); // false
 */
export function isTypeOf(obj, type) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
}



/**
 * Returns the type of the given object.
 *
 * @param {any} obj - The object to get the type of.
 * @returns {string} The type of the object.
 *
 * @example
 * let polygonHierarchy = new Cesium.PolygonHierarchy();
 * console.log(typeOf(polygonHierarchy)); // "PolygonHierarchy"
 */
// Both instanceof and Object.prototype.toString.call(obj).slice(8, -1) are methods used to determine the type of an object, but they have different use cases and trade-offs. Here’s a comparison of their advantages and disadvantages:

// instanceof
// Advantages:

// Simplicity and Readability:

// instanceof is straightforward and easy to read.
// Example: obj instanceof Cesium.Entity.
// Prototype Chain Check:

// instanceof checks if the prototype property of a constructor appears anywhere in the prototype chain of an object.
// This makes it useful for verifying if an object is an instance of a specific constructor or class, including inherited classes.
// Disadvantages:

// Limited to Constructor Functions:

// instanceof only works with constructor functions and their instances.
// It won't work for primitive types or objects created without constructors.
// Context-Sensitive:

// If different execution contexts (like iframes) have their own global object, instanceof can give incorrect results because each context has its own version of constructors.
// Object.prototype.toString.call(obj).slice(8, -1)
// Advantages:

// Accurate Type Checking:

// This method returns the internal class name of an object, which is a reliable way to determine the precise type.
// It can be used for all types of objects, including primitives.
// Context-Independent:

// It’s not affected by execution contexts, making it more robust when dealing with objects across different contexts.
// Disadvantages:

// Complexity:

// It is less readable and more cumbersome to use.
// Example: Object.prototype.toString.call(obj).slice(8, -1) === 'Entity'.
// Performance:

// It might be slightly slower compared to instanceof due to the string operations involved, though this is usually negligible.
// Use Cases
// Use instanceof when:

// You need to check if an object is an instance of a specific constructor or class.
// Your code is operating within a single execution context.
// You want a simple and readable solution.
// Use Object.prototype.toString.call(obj).slice(8, -1) when:

// You need a robust type check that works across different execution contexts.
// You need to check for primitive types or objects not created by constructors.
// You need precise type information that goes beyond constructor checks.
export function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}