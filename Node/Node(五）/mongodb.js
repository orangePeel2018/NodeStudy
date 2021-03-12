var mongoose = require('mongoose')

var Schema = mongoose.Schema
// 1. 连接数据库
// 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来
mongoose.connect('mongodb://localhost/user',{useNewUrlParser: true, useUnifiedTopology: true})


// 2. 设计文档结构（表结构）
// 字段名称就是表结构中的属性名称
// 约束的目的是为了保证数据的完整性，不要有脏数据
var userSchema = new Schema({
	username:{
		type:String,
		required: true // 必须有
	},
	password:{
		type:String,
		require: true
	},
	email:{
		type:String,
		require: true
	}
})

// var userSchema = new Schema({
//   username: {
//     type: String,
//     required: true // 必须有
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String
//   }
// })


// 3. 将文档结构发布为模型
//    mongoose.model 方法就是用来将一个架构发布为 model
//    第一个参数：传入一个大写名词单数字符串用来表示你的数据库名称
//                 mongoose 会自动将大写名词的字符串生成 小写复数 的集合名称
//                 例如这里的 User 最终会变为 users 集合名称
//    第二个参数：架构 Schema
//   
//    返回值：模型构造函数
var User=mongoose.model('User',userSchema);
//添加用户
// var admin=new User({
// 	username:'fys',
// 	password:'440184',
// 	email:'1186421205@qq.com'
// })

// admin.save(function(err,data){
// 	if(err){
// 		console.log('保存失败')
// 		console.log(err)
// 	}else{
// 		console.log('保存成功')
// 		console.log(data)
// 	}
// })

//查找用户
// User.find(function(err,data){
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log(data)
// 	}
// })

//查找其中一个数据
// User.findOne({username:'fys'},function(err,data){
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log(data)
// 	}
// })

//查找其中一个数据并判断存在，若不存在贼新建
// User.findOne({username:'fys2'},function(err,data){
// 	if(err){
// 		console.log(err)
// 	}else if(data){
// 		console.log(data)
// 	}else{
// 		new User({
// 			username:'fys2',
// 			password:'44017',
// 			email:'185@qq.com'
// 		}).save(function(err2,data2){
// 			if(err){
// 				console.log('进来')
// 				console.log(err2)
// 			}else{
// 				console.log("数据库没找到插入成功")
// 				console.log(data2)
// 			}
// 		})
// 	}
// })

//删除
// User.remove({username:'fys2'},function(err,data){
// 	if(err){
// 		console.log('删除失败')
// 		console.log(err)
// 	}else{
// 		console.log('删除成功')
// 		console.log(data)
// 	}
// })

//更新
// User.findByIdAndUpdate('6036251162dc6653f07afca7', {
//   password: '123'
// }, function (err, ret) {
//   if (err) {
//     console.log('更新失败')
//   } else {
//     console.log('更新成功')
//   }
// })

//mongoose与promise结合
User.find()
	.then(function(data){
		console.log(data)
	})