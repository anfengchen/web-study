/**
 * 一个创建简单子类的函数
 * @param {Function} superclass 
 * @param {Function} constructor 
 * @param {Object} methods 
 * @param {Object} statics 
 * @return {Function}
 */
function defineSubclass(superclass, constructor, methods, statics) {
    //方法链的继承
    constructor.prototype = Object.create(superclass.prototype);
    constructor.prototype.constructor = constructor;
    //重载或添加新的实例方法
    if (methods) extend(constructor.prototype, methods);
    //添加类静态成员
    if (statics) extend(constructor, statics);

    return constructor;
}

Function.prototype.extend = function(constructor, methods, statics) {
        return defineClass.call(this, constructor, methods, statics);
    }
    /*******************************************************************************
     * 类的层次结构和抽象类
     *******************************************************************************/
    //AbstractFunction
function abstractmethod() { throw new Error('abstract method!') }

/**AbstractSet
 * 有一个抽象方法：contains()
 */
function AbstractSet() { throw new Error("Can't instantiate abstract class!") }
AbstractSet.prototype.contains = abstractmethod;

/**NotSet
 * AbstractSet的非抽象子类
 * 所有不在其他集合中的成员都在这个集合中，
 * 因为它是在其他集合是不可写的条件下定义的，
 * 同时由于它的成员数是无限个，因此它是不可枚举的，
 * 我们只能用它来检查成员的归属情况
 */
//其实NotSet没有继承AbstractSet的任何东西，它只是名称上是set
//它本事也只是一个set的组合
var NotSet = AbstractSet.extend(
    function NotSet(set) { this.set = set; }, {
        contains: function(x) { return !this.set.contains(x); },
        toString: function() {
            return "~" + this.set.toString();
        },
        equals: function(that) {
            return that instanceof NotSet && this.set.equals(that.set);
        }
    }
);

/**AbstractEnumerableSet是AbstractSet的一个抽象子类
 * 它定义了抽象方法size()和foreach()
 * 然后实现了非抽象方法isEmpty(),toArray(),toString(),toLocalString()和equals()方法
 * 子类实现contains(),size(),foreach(),这三个方法就可以使用上面的五个方法了
 */
var AbstractEnumerableSet = AbstractSet.extend(
    function AbstractEnumerableSet() { throw new Error("Can't instantiate abstract class!") }, {
        size: abstractmethod,
        foreach: abstractmethod,
        isEmpty: function() { return this.size() === 0; },
        toArray: function() {
            var arr = [];
            this.foreach(function(val) {
                arr.push(val);
            });
            return arr;
        },
        toString: function() {
            var s = "{",
                i = 0;
            this.foreach(function(val) {
                if (i++ > 0) s += ",";
                s += val;
            });
            return s + "}";
        },
        toLocalString: function() {
            var s = "{",
                i = 0;
            this.foreach(function(val) {
                if (i++ > 0) s += ",";
                if (val == null) s += val;
                else s += val.toLocalString();
            });
            return s + "}";
        },
        equals: function(that) {
            if (!(that instanceof AbstractEnumerableSet)) return false;
            if (this.size !== that.size) return false;
            try {
                this.foreach(function(val) {
                    if (!that.contains(val)) throw false;
                });
                return true;
            } catch (x) {
                if (x === false) return false;
                throw x;
            }
        }
    }
);

/**SingletonSet是AbstractEnumerableSet的一个抽象子类
 * 它是只读的，它只含有一个成员
 */
var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member; }, {
        contains: function(x) { return this.member === x; },
        size: function() { return 1; },
        foreach: function(f, ctx) { f.call(ctx, this.member); }
    }
);

/**AbstractWritableSet是AbstractEnumerableSet的抽象子类
 * 它定义了抽象方法add()和remove()
 * 然后实现了非抽象方法union(),intersection()和difference()
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
    function AbstractWritableSet() { throw new Error("Can't instantiate abstract class!"); }, {
        add: abstractmethod,
        remove: abstractmethod,
        union: function(that) {
            var self = this;
            that.foreach(function(val) {
                //if(!self.contains(val)) 去掉判断，因为如果含有，添加无效果
                self.add(val);
            });
            return this;
        },
        intersection: function(that) {
            var self = this;
            this.foreach(function(val) {
                if (!that.contains(val)) self.remove(val);
            });
            return this;
        },
        difference: function(that) {
            var self = this;
            that.foreach(function(val) {
                self.remove(val);
            });
            return this;
        }
    }
);

/**ArraySet是AbstractWritableSet的非抽象子类
 * 它以数组的形式表示集合中的元素;
 * contains()采用线性查找的方式，复杂度为O(n),
 * 所以，它适合于相对较小的集合
 */
var ArraySet = AbstractWritableSet.extend(
    function ArraySet() {
        this.values = [];
        this.add.apply(this, arguments);
    }, {
        contains: function(x) { return this.values.indexOf(x) !== -1; },
        size: function() { return this.values.length; },
        foreach: function(f, ctx) { this.values.forEach(f, ctx); },
        add: function() {
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!this.contains(arg))
                    this.values.push(arg);
            }
            return this;
        },
        remove: function() {
            for (var i = 0; i < arguments.length; i++) {
                var index = this.values.indexOf(arguments[i]);
                if (index !== -1) this.values.splice(index, 1);
            }
            return this;
        }
    }
);

export { AbstractWritableSet, AbstractEnumerableSet, AbstractSet, NotSet, ArraySet, SingletonSet };