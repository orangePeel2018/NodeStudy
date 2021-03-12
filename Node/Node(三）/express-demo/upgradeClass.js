var schedule = require('node-schedule');
var classDao=require('./classDao')

const upgradeClass = ()=>{
  //每分钟的1-10秒都会触发，其它通配符依次类推
  schedule.scheduleJob('30 12 10 5 2 *', ()=>{
	classDao.upgradeClassGrade(function (err, results, fields) {
		var returnJson = {};
		 console.log(JSON.stringify(results))
		if(results.affectedRows==0){
			console.log(new Date()+"升级年级数量为0,请查询原因")
			return
		}
	  })
  })
}

upgradeClass()