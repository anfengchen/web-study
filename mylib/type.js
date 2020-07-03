module.exports = { isPromise, isGenerator, isGeneratorFunction, isObject, type, quacks };

/**
 * Check if 'obj' is a promise
 * @param {Object} obj 
 * @return {Boolean}
 * @api public
 */
function isPromise(obj) {
    return 'function' == typeof obj.then;
}



/**4.2
 * Check if 'obj' is a generator
 * @param {Mixed} obj 
 * @return {Boolean}
 * @api public
 */
function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**4.3
 * Check if 'obj' is a generator function
 * @param {Mixed} obj 
 * @return {Boolean}
 * @api public
 */
function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ("GeneratorFunction" === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
}

/**4.4
 * Check for plain object
 * @param {Object} obj 
 * @return {Boolean}
 * @api public
 */
function isObject(obj) {
    return Object == obj.constructor;
}

/**可以判断值类型的type()函数
 * 主要区分各种原始类型、Nan、function、class、object
 */
function type(o) {
    var tp, className, name;

    //识别各种原始值和function
    if (o === null) return null;
    if (o !== o) return NaN;
    if ((tp = typeof o) !== 'object') return tp;

    //识别内置类型
    if ((className = classof(o)) !== 'Object') return className;

    //如果对象的构造函数的名字存在的话，就返回它
    if (o.constructor && typeof o.constructor === 'function' &&
        (name = o.constructor.getName())) return name;

    return 'Object';
}

/**
 * 内置对象的类
 */
function classof(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

//返回函数的名字 （可能是空字符串），不是函数的话返回null
Function.prototype.getName = function() {
    if ('name' in this) return this.name;
    //处理 function funcName()形式的 函数，得到funcName
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
}


/**
 * 鸭式辩型，如果o实现了除地一个 参数以外的所有参数所表示的方法 ，则返回true
 */
function quacks(o, ...rest) {
    for (var val of rest) {
        switch (typeof val) {
            case 'string':
                if (typeof o[val] !== 'function') return false;
                continue;
            case 'function':
                //如果实参是函数，就使用 它的原型
                val = val.prototype;
            case 'object':
                for (var name in val) {
                    if (typeof val[name] !== 'function') continue;
                    if (typeof o[name] !== 'function') return false;
                }
        }
    }
    return true;
}