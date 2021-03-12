// require 方法有两个作用：
//    1. 加载文件模块并执行里面的代码
//    2. 拿到被加载文件模块导出的接口对象
//    
//    在每个文件模块中都提供了一个对象：exports
//    exports 默认是一个空对象
//    你要做的就是把所有需要被外部访问的成员挂载到这个 exports 对象中


//如果要访问其他模块的资源，必须在那个模块暴露出来，不然访问不了
/* 因为是模块作用域，所以模块与模块之间的资源互不影响都是独立的 */
var bExports=require('./b')

console.log(bExports.age)
console.log(bExports.foo)

bExports.readFile('a.txt')

console.log(bExports.add(1,2))