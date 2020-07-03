/**inherit
 * 兼容ES5之前的版本，ES5之后使用Object.create()
 * @param {Object} p
 * @return {Object} 
 */
function inherit(p) {
    if (p == null) throw TypeError("proto can't be null or undefined");
    if (Object.create) return Object.create(p);

    var t = typeof p;
    if (t !== 'object' && t !== 'function') throw TypeError('proto shouln\'t be origion value');

    function f() {}
    f.prototype = p; //继承的根本，p为新对象的原型对象
    return new f();
}

/**extend 
 * 拓展对象o中的属性（只处理可枚举属性，包括继承来的属性）
 * 如果o与p中有同名属性，则覆盖o中属性
 * @param {Object} o 
 * @param {Object} p
 * @return {Object} 
 */
function extend(o, p) {
    for (var prop in p) {
        o[prop] = p[prop]; //浅复制
    }
    return o;
}
/**merge
 * 拓展对象o中的属性（只处理可枚举属性，包括继承来的属性）
 * 如果o与p中有同名属性，则以o中属性为准
 * @param {Object} o 
 * @param {Object} p
 * @return {Object} 
 */
function merge(o, p) {
    for (var prop in p) {
        //o的自有属性有prop，则不做处理
        if (o.hasOwnProperty(prop)) continue;
        o[prop] = p[prop];
    }
}
/**restrict
 * 如果o中的属性，在p中没有同名熟悉，则从o中删除这个属性
 * @param {Object} o 
 * @param {Object} p 
 * @return {Object}
 */
function restrict(o, p) {
    for (var prop in o) {
        if (!(prop in p)) delete o[prop];
    }
    return o;
}
/**subtract
 * 如果o中属性，在p中存在同名属性，则从o中删除这个属性
 * @param {Object} o 
 * @param {Object} p 
 * @return {Object}
 */
function subtract(o, p) {
    for (var prop in p) {
        delete o[prop];
    }
    return o;
}
/**union
 * 返回一个新对象，这个对象同时拥有o中和p中的属性
 * 如果o和p中有同名属性，使用p中的属性值
 * @param {Object} o 
 * @param {Object} p 
 * @return {Object}
 */
function union(o, p) { return extend(extend({}, o), p); }
/**intersection
 * 返回一个新对象，这个对象拥有o中和p中的都有的属性
 * 忽略p中的属性值
 * @param {Object} o 
 * @param {Object} p 
 * @return {Object}
 */
function intersection(o, p) { return restrict(extend({}, o), p); }

export { inherit, extend, merge, restrict, subtract, union, intersection };