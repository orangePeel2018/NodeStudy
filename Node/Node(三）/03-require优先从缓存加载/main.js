require('./a')

// 优先从缓存加载
// 由于 在 a 中已经加载过 b 了
// 所以这里不会重复加载
// 可以拿到其中的接口对象，但是不会重复执行里面的代码
// 这样做的目的是为了避免重复加载，提高模块加载效率
var fn = require('./b')

console.log(fn)


//require加载规则
/* 
	1.优先从缓存加载
	2.通过核心模块加载
	3.通过路径加载
	4.通过第三方包加载，
	// 凡是第三方模块都必须通过 npm 来下载
	// 使用的时候就可以通过 require('包名') 的方式来进行加载才可以使用
	// 不可能有任何一个第三方包和核心模块的名字是一样的
	// 既不是核心模块、也不是路径形式的模块
	//    先找到当前文件所处目录中的 node_modules 目录
	//    node_modules/art-template
	//    node_modules/art-template/package.json 文件
	//    node_modules/art-template/package.json 文件中的 main 属性
	//    main 属性中就记录了 art-template 的入口模块
	//    然后加载使用这个第三方包
	//    实际上最终加载的还是文件
	
	//    如果 package.json 文件不存在或者 main 指定的入口模块是也没有
	//    则 node 会自动找该目录下的 index.js
	//    也就是说 index.js 会作为一个默认备选项
	//    
	//    如果以上所有任何一个条件都不成立，则会进入上一级目录中的 node_modules 目录查找
	//    如果上一级还没有，则继续往上上一级查找
	//    。。。
	//    如果直到当前磁盘根目录还找不到，最后报错：
	//      can not find module xxx
	
	注意一般在开发中，只会又一个node_moudle模块，而且在项目根路径，因为按照第三方包加载的规则，放在根路径所有的文件都能找到
 */