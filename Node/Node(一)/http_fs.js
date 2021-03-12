// 1. 结合 fs 发送文件中的数据
// 2. Content-Type
//    http://tool.oschina.net/commons
//    不同的资源对应的 Content-Type 是不一样的
//    图片不需要指定编码
//    一般只为字符数据才指定编码

var http=require('http');
var fs=require('fs');

var server=http.createServer();


server.on('request',function(req,resp){
	var url=req.url;
	if(url==='/'||url==='/index'){
		fs.readFile('./resource/index.html',function(error,data){
			if(error){
				resp.setHeader('Content-type','text/plain;charset=utf-8')
				console.log('读取文件失败，找不到该文件')
				return
			}
			resp.setHeader('Content-type','text/html;charset=utf-8')
			resp.end(data.toString())
		})
	}else if(url==='/pic'){
		fs.readFile('./resource/ab2.jpg',function(error,data){
			if(error){
				resp.setHeader('Content-type','text/plain;charset=utf-8')
				console.log('读取文件失败，找不到该文件')
				return
			}
			 // data 默认是二进制数据，可以通过 .toString 转为咱们能识别的字符串
			// res.end() 支持两种数据类型，一种是二进制，一种是字符串
			// 图片就不需要指定编码了，因为我们常说的编码一般指的是：字符编码
			resp.setHeader('Content-Type','image/jpeg')
			resp.end(data)
		})
	}else if(url==='/css'){
		fs.readFile('./resource/main.css',function(error,data){
			if(error){
				resp.setHeader('Content-type','text/plain;charset=utf-8')
				console.log('读取文件失败，找不到该文件')
				return
			}
			resp.setHeader('Content-type','text/css;charset=utf-8')
			resp.end(data.toString())
		})
	}
})


server.listen(3000,function(){
	console.log('服务器已经启动了，冲冲冲')
})