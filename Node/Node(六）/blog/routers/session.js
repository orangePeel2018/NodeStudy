var express = require('express')
var router = express.Router()
var User = require('../models/user.js')
var md5 = require('blueimp-md5')

 
 router.get('/',function(req,resp){
	resp.render('index.html')
 })
 
 router.get('/login',function(req,resp){
	 resp.render('login.html')
 })
 
 router.get('/register',function(req,resp){
	 resp.render('register.html')
 })
 
router.post('/register',function(req,resp){
	var body=req.body
	User.findOne({email:body.email})
		.then(function(data){
			console.log('emailData:'+data)
			if(data){
				console.log('1')
				resp.status(200).json({
					err_code:1,
					message:'注册邮箱已存在'
				})
			}else{
				console.log('邮箱可以使用')
				return User.findOne({nickname:body.nickname})	
			}	
		},function(err){
			if(err){
				console.log('2')	
				next(err)
			}
		})
		.then(function(data){
			console.log('nicknameData:'+data)
			if(data){
				resp.status(200).json({
					err_code:2,
					message:'注册昵称已存在'
				})
			}else{
				console.log('昵称可以使用')
				body.password=md5(md5(body.password))
				return new User(body).save()
			}	
		},function(err){
			console.log('4')
			if(err){
				next(err)
			}
		})
		.then(function(data){
			console.log('userData:'+data)
			//保存成功，user信息放进session
			console.log('注册完成')
			req.session.user=data
			resp.status(200).json({
				err_code:0,
				message:'注册成功'
			})
		},function(err){
			console.log('6')
			if(err){
				next(err)
			}
		})
})
 
 
 
 module.exports=router