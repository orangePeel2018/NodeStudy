var express=require('express')
var upgradeClass=require('./upgradeClass')
var app=express();

app.use('/public/',express.static('./public/'))
app.use('/static/', express.static('./static/'))

app.get('/',function(req,resp){
	resp.send('首页')
})

app.listen(3000,function(){
	console.log('打开')
})

