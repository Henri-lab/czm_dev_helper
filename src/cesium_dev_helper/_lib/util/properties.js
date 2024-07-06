/**
* 判断对象是否有某个属性
* @private
* @param {object} obj 对象
* @param {string} field  属性字段
* @param {string} defVal  默认返回 
* @returns {string}
*/
export function objHasOwnProperty(obj, field, defVal) {
    // return obj.hasOwnProperty(field) ? obj.field : defVal   // 哪里错误？🎃
    return Object.prototype.hasOwnProperty.call(obj, field) ? obj[field] : defVal;
}

/**
 * 批量设置对象属性
 * @private
 * @param {object} obj -需要改造的对象
 * @param {Array<Object>} properties - 属性图数组
 * @returns {Object} -修改后属性的对象
 */
export function setProperties(obj, properties) {
    properties.forEach(property => {
        obj[property.key] = this._objHasOwnProperty(options, property.key, property.defaultValue);
    });
    return obj;
}

/**
 * Creates a Cesium CallbackProperty for updating a property per frame.
 *
 * @param {Array} data - The initial value of the property array.
 * @param {boolean} [isConst=false] - If true, the property will not change after creation.
 * @returns {Cesium.CallbackProperty} - A new CallbackProperty instance.
 *
 * @example
 * // Example usage:
 * const position = updatePerFrame(new Cesium.Cartesian3(0, 0, 0));
 * entity.position = position;
 */
// 设置 czm帧刷新 属性
export function setPropertiesUpdatedPerFrame(dataArr, isConst = false) {
    let resArr = dataArr.map(data => {
        return new Cesium.CallbackProperty(function () {
            return data
        }, isConst)
    })
    return resArr
}