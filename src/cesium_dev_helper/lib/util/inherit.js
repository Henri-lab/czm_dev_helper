/**
   * 函数继承
   * ---更推荐extends
   * @param {Function} childCtor - 子函数
   * @param {Function} parentCtor - 父函数
   * @returns {Object} 返回继承后的原型对象
   */
export default function inherits(childCtor, parentCtor) {
    function TempCtor() { }
    TempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new TempCtor();
    childCtor.prototype.constructor = childCtor;
    childCtor.base = function (me, methodName, varArgs) {
        const args = Array.prototype.slice.call(arguments, 2);
        return parentCtor.prototype[methodName].apply(me, args);
    };
}



