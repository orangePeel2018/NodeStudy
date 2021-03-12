var express=require('express')
var bodyParser = require('body-parser')
var path=require('path')
var router=require('./routers/session.js')
var session = require('express-session')
var app=express()

//开放静态资源
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

//配置模板引擎
app.engine('html',require('express-art-template'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//配置session
app.use(session({
  // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'itcast',
  resave: false,
  saveUninitialized: true // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))


app.use(router)

app.use(function(err,req,resp,next){
	resp.render('404.html')
})
	


app.listen(3000, function () {
  console.log('running 3000...')
})