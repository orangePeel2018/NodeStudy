var http=require('http')
var fs=require('fs')
var template=require('art-template')
var url=require('url')


var comments = [
  {
    name: '张三',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三2',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三3',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三4',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三5',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  }
]

http
	.createServer(function(req,resp){
		var parseObj=url.parse(req.url,true)
		var pathName=parseObj.pathname
		if(pathName==='/'){
			fs.readFile('./views/index.html',function(err,data){
				if(err){
					return
				}
				var tempHtml=template.render(data.toString(),{
					comments:comments
				})
				resp.end(tempHtml)
				
			})
		}else if(pathName.indexOf('/public')===0){
			fs.readFile('.'+pathName,function(err,data){
				if(err){
					return
				}
				resp.end(data)
			})
			
		}else if(pathName==='/post'){
			fs.readFile('./views/post.html',function(err,data){
				if(err){
					fs.readFile('./views/404.html',function(err2,data2){
						resp.end(data2);
					})
				}
				resp.end(data)
			})
		}else if(pathName==='/pinglun'){
			var comment=parseObj.query;
			comments.unshift(comment)
			
			resp.statusCode=302
			resp.setHeader('Location', '/')
			resp.end()
		}else{
			fs.readFile('./views/404.html',function(err,data){
				if(err){
					fs.readFile('./views/404.html',function(err2,data2){
						resp.end(data2);
					})
				}
				resp.end(data)
			})
		}
	})
	.listen(3000,function(){
		console.log('running.....')
	})