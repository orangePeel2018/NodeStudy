//1.导入依赖
var mongoose=require('mongoose')

//2.配置设计
var Schema=mongoose.Schema

//3.配置连接
mongoose.connect('mongodb://localhost/student',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


//设置文档格式
var studentSchema = new Schema({
	name:{
		type:String,
		required:true
		
	},
	sex:{
		type:Number,
		enum:[0,1],
		default:0
	},
	age:{
		type:Number,
		required:true
		
	},
	hobbies:{
		type:String,
		required:false
	}
	
})
//模型构造函数
module.exports=mongoose.model('Student',studentSchema)
