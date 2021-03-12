// 1. 结合 fs 发送文件中的数据
// 2. Content-Type
//    http://tool.oschina.net/commons
//    不同的资源对应的 Content-Type 是不一样的
//    图片不需要指定编码
//    一般只为字符数据才指定编码

var http=require('http');
var fs=require('fs');

var server=http.createServer();

// 2. 监听 Server 的 request 请求事件，设置请求处理函数
//    请求
//      处理
//    响应
//    一个请求对应一个响应，如果在一个请求的过程中，已经结束响应了，则不能重复发送响应。
//    没有请求就没有响应。
// 
// 咱们以前使用过 Apache 服务器软件，这个软件默认有一个 www 目录，所有存放在 www 目录中的资源都可以通过网址来浏览
// 127.0.0.1:80/a.txt
// 127.0.0.1:80/index.html
// 127.0.0.1:80/apple/login.html
//通过前面的案例，我们可以看出读取文件路径都是相同的，所以我们可以把他提取出来
//可以看到提取出文件路径也是可以访问成功的，而且还节省了代码，但是此案例还有一个问题，就是动态的添加文件时，没有对应的路径判断，要重新加判断来获取很麻烦
//在这里，我们可以看出访问路径和文件路径后面拼的路径一模一样，所以我们也可以直接把url放到文件路径，不用进行判断，这样代码就十分的简洁
//但是这样会存在编码问题，而且还要写文件后缀，可以用正则判断后缀，来设置编码
var filePath='D:/BaiduNetdiskDownload/nodejs资料（7天）/www';

server.on('request',function(req,resp){
	var url='/index.html'
	if(url!='/'){
		url=req.url
	}
	fs.readFile(filePath+url,function(error,data){
		if(error){
			console.log('读取文件失败，找不到该文件')
			return
		}
		resp.end(data)
	})
	
})


server.listen(3000,function(){
	console.log('服务器已经启动了，冲冲冲')
})