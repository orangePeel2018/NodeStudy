// Express 提供了一种更好的方式
// 专门用来包装路由的
var express = require('express')

// 1. 创建一个路由容器
var router = express.Router()
//配置模板
var bodyParser=require('body-parser')

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


router.get('/',function(req,resp){
	resp.render('index.html',{
		comments:comments
	})
})

router.get('/post',function(req,resp){
	resp.render('post.html')
})

router.post('/pinglun',function(req,resp){
	console.log(req.query)
	var comment=req.body
	comment.dateTime = '2017-11-5'
	comments.unshift(comment)
	resp.redirect('/');
	
	//resp.statusCode =302
	//resp.setHeader('location','/')
})

module.exports = router