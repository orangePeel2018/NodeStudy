var fooExports = require('./foo')

console.log(fooExports)


// 如果你实在分不清楚 exports 和 module.exports
// 你可以选择忘记 exports
// 而只使用 module.exports 也没问题
// 
// module.exports.xxx = xxx
// moudle.exports = {}


//所以你导出多个对象时，可以直接给exports。xxx赋值，也可以module.exports。xxx赋值
//你要单独导出一个数组方法等等，可以直接moudle.exports=a就可以
//moudle.exports={}