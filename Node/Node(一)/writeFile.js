//写文件
var fs=require("fs");

// 第一个参数：文件路径
// 第二个参数：文件内容
// 第三个参数：回调函数
//    error
//    
//    成功：
//      文件写入成功
//      error 是 null
//    失败：
//      文件写入失败
//      error 就是错误对象
fs.writeFile("./resource/b.txt",'吃吃吃',function(error){
	if(error){
		console.log("写入失败")
	}else{
		console.log("写入成功")
		fs.readFile("./resource/b.txt",function(error,data){
			console.log("文件内容为：")
			//读返回的是二进制编码
			console.log(data.toString())
		})
	}
})