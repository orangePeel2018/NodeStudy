// art-template
// art-template 不仅可以在浏览器使用，也可以在 node 中使用

// 安装：
//    npm install art-template
//    该命令在哪执行就会把包下载到哪里。默认会下载到 node_modules 目录中
//    node_modules 不要改，也不支持改。

// 在 Node 中使用 art-template 模板引擎
// 模板引起最早就是诞生于服务器领域，后来才发展到了前端。
// 
// 1. 安装 npm install art-template
// 2. 在需要使用的文件模块中加载 art-template
//    只需要使用 require 方法加载就可以了：require('art-template')
//    参数中的 art-template 就是你下载的包的名字
//    也就是说你 isntall 的名字是什么，则你 require 中的就是什么
// 3. 查文档，使用模板引擎的 API


//在服务端使用模板技术。会在客户端请求时，把数据渲染上去
//在客户端使用模板技术时，会先请求页面，然后在请求数据，两次请求

var template = require('art-template');
var fs = require('fs');
var http = require('http')

//开始服务和监听服务也可以用链式的方法编写
http
	.createServer(function(req, resp) {
		// 这里不是浏览器
		// template('script 标签 id', {对象})

		// var tplStr = `
		// <!DOCTYPE html>
		// <html lang="en">
		// <head>
		//   <meta charset="UTF-8">
		//   <title>Document</title>
		// </head>
		// <body>
		//   <p>大家好，我叫：{{ name }}</p>
		//   <p>我今年 {{ age }} 岁了</p>
		//   <h1>我来自 {{ province }}</h1>
		//   <p>我喜欢：{{each hobbies}} {{ $value }} {{/each}}</p>
		// </body>
		// </html>
		// `
		fs.readFile('./在html使用模板引擎.html', function(err, data) {
			if (err) {
				console.log('找不到该文件')
				return
			}
			// 默认读取到的 data 是二进制数据
			// 而模板引擎的 render 方法需要接收的是字符串
			// 所以我们在这里需要把 data 二进制数据转为 字符串 才可以给模板引擎使用
			
			resp.setHeader('Content-Type','text/html')
			resp.end(data);
		})
	})
	.listen(3000, function() {
		console.log('running.....')
	})
