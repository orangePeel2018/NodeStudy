var db = require('./db'); //引入数据库封装模块



//根据老师名称查询用户id
function selectUserByName(teacherName,callback){
    console.log("teacherName: "+teacherName);
    //查询班级
    var getUserIdByNameSql = "select user.fd_id from basic_user user where user.fd_name=?";
    //选择班级
    db.query(getUserIdByNameSql, [teacherName], function (err, results, fields) {
      callback && callback(err,results,fields);
    })
  }

//根据老师名称和工号查询用户id
function selectUserByNameAndJobNumber(teacherName,jobNumber,callback){
    console.log("teacherName: "+teacherName);
    console.log("jobNumber: "+jobNumber);
    //查询班级
	var getUserIdByNameAndJobNumberSql = "select user.fd_id from basic_user user where user.fd_name=? and user.fd_job_number=? and user.fd_role=1";
    //选择班级
    db.query(getUserIdByNameAndJobNumberSql, [teacherName,jobNumber], function (err, results, fields) {
      callback && callback(err,results,fields);
    })
  }

module.exports = {
    selectUserByName:selectUserByName,
    selectUserByNameAndJobNumber:selectUserByNameAndJobNumber
}