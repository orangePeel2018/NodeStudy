var express=require('express')
var router=express.Router()

var Student=require('./student-moogose')


router.get('/',function(req,resp){
	Student.find()
			.then(function(data){
				console.log('执行查询数据库操作完成,数据为：'+data)
				resp.render('index.html',{
					students:data
				})
			},function(err){
				console.log('读取moogose数据库失败：'+err)
				throw new Error(err)
			})
})

router.get('/students/new',function(req,resp){
	resp.render('new.html')
})

router.post('/students/new',function(req,resp){
	var student=new Student(req.body)
	student.save()
			.then(function(data){
				console.log('执行插入数据库操作完成,数据为：'+data)
				resp.redirect('/')
			},function(err){
				console.log('插入moogose数据库失败：'+err)
				throw new Error(err)
			})
})

router.get('/students/edit',function(req,resp){
	var id=req.query.id.replace(/"/g, '')
	Student.findOne({_id:id})
			.then(function(data){
				console.log('执行查询数据库操作完成,数据为：'+data)
				resp.render('edit.html',{
					student:data
				})
			},function(err){
				console.log('查询moogose数据库失败：'+err)
				throw new Error(err)
			})
})

router.post('/students/edit',function(req,resp){
	var id=req.body.id.replace(/"/g, '')
	Student.findByIdAndUpdate(id,req.body)
			.then(function(data){
				console.log('执行更新数据库操作完成,数据为：'+data)
				resp.redirect('/')
			},function(err){
				console.log('更新moogose数据库失败：'+err)
				throw new Error(err)
			})
})

router.get('/students/delete',function(req,resp){
	var id=req.query.id.replace(/"/g, '')
	console.log(id)
	Student.deleteOne({_id:id})
			.then(function(data){
				console.log('执行删除数据库操作完成,数据为：'+data)
				resp.redirect('/')
			},function(err){
				console.log('删除moogose数据库失败：'+err)
				throw new Error(err)
			})
})

module.exports=router