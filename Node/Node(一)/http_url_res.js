var http=require("http");

var server=http.createServer();


server.on('request',function(req,resp){
	// 根据不同的请求路径发送不同的响应结果
	// 1. 获取请求路径
	//    req.url 获取到的是端口号之后的那一部分路径
	//    也就是说所有的 url 都是以 / 开头的
	// 2. 判断路径处理响应
	var url=req.url;
	if(url==='/'){
		resp.end('index.html')
	}else if(url==='/login'){
		resp.end('<h1>登录</h1>')
	}else if(url==='/produce'){
		var produce=[{
			name:'apple',
			price:8888
		},{
			name:'banana',
			price:7777
		},{
			name:'organge',
			price:6666
		}]
		
		resp.end(JSON.stringify(produce))
	}else{
		resp.end('404 NOT FOUND')
	}
	
	
	// 响应内容只能是二进制数据或者字符串
	//不能以下数据类型，可以转换为字符串再进行响应
	//  数字
	//  对象
	//  数组
	//  布尔值
})


server.listen(3000,function(){
	console.log('服务器已启动成功')
})