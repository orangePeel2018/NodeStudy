
//打印看出exports是个空对象
console.log(exports)

var foo='bbb'
var age=18

exports.age=age
exports.foo=foo

exports.readFile=function(path,callback){
	console.log(path)
	
}

exports.add=function(a,b){
	return a+b
}

//打印看出exports里面已经添加了对应属性，
console.log(exports)

function add(x, y) {
  return x - y
}
