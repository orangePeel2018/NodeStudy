var db = require('./db'); //引入数据库封装模块

//根据角色查找模块
function selectOneLevelMoudle(callback){
    console.log("selectOneLevelMoudle: "+selectOneLevelMoudle);
    //查询班级
   var selectOneLevelMoudle = "select sm.* from system_module sm where sm.fd_parent_id is null"
    //选择班级
    db.query(selectOneLevelMoudle, [], function (err, results, fields) {
      callback && callback(err,results,fields);
    })
}




module.exports = {
 
}