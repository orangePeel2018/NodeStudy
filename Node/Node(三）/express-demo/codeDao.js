var db = require('./db'); //引入数据库封装模块




function selectWeekCodeValue(weekName,callback){
    console.log("weekName: "+weekName);
    var getWeekCodeValue = "select item.fd_value from system_code code left join system_code_item item on code.fd_id=item.fd_code_id where item.fd_name=? and code.fd_code='week_type' and item.fd_value<6";
    db.query(getWeekCodeValue, [weekName], function (err, results, fields) {
      callback && callback(err,results,fields);
    })
 }
 
 //根据老师名称查询用户id
 function selectGradeCodeValue(gradeName,callback){
     console.log("gradeName: "+gradeName);
     //查询班级
     var getGradeCodeValue = "select item.fd_value from system_code code left join system_code_item item on code.fd_id=item.fd_code_id where item.fd_name=? and code.fd_code='grade_type'";
     //选择班级
     db.query(getGradeCodeValue, [gradeName], function (err, results, fields) {
       callback && callback(err,results,fields);
     })
  }

//根据老师名称查询用户id
 function selectClassCodeValue(className,callback){
     console.log("className: "+className);
     //查询班级
     var getClassCodeValue = "select item.fd_value from system_code code left join system_code_item item on code.fd_id=item.fd_code_id where item.fd_name=? and code.fd_code='class_no'";
     //选择班级
     db.query(getClassCodeValue, [className], function (err, results, fields) {
       callback && callback(err,results,fields);
     })
  }

module.exports = {
    selectWeekCodeValue:selectWeekCodeValue,
    selectClassCodeValue:selectClassCodeValue,
	selectGradeCodeValue:selectGradeCodeValue
}