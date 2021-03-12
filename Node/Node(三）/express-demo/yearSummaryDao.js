var db = require('./db'); //引入数据库封装模块

/**
 * 查询学年总结列表
 * @param {查询参数} queryParams 
 * @param {*} callback 
 */
function selectYearSmmaryList(queryParams, callback) {
  var page = queryParams.page; //请求的页数
  var perpage = queryParams.perpage;////每页的数量
  var yCalendarId = queryParams.yCalendarId - 0 || 0;//学期ID
  var classId = queryParams.classId - 0 || 0;//班级ID
  var studentName = queryParams.studentName || '';//学生姓名
  var queryCountSql = "SELECT"
    + " count(*) AS total"
    + " FROM"
    + " iep_year_summary t"
    + " left join affairs_year_calendar yCal on t.fd_year_calendar_id = yCal.fd_id"
    + " left JOIN basic_student st on st.fd_id = t.fd_student_id"
    + " left join affairs_class aClass on aClass.fd_id = st.fd_class_id"
    + " left JOIN basic_user cu on cu.fd_id = t.fd_create_user_id"
    + " left JOIN basic_user uu on uu.fd_id = t.fd_update_user_id"
    + " WHERE"
    + " 1 = 1"
    + " and IF(?=0,1 = 1,yCal.fd_id = ?)"
    + " and IF(?=0,1 = 1,aClass.fd_id = ?)"
    + " and st.fd_name like ?";
  console.log("queryCountSql:" + queryCountSql);
  //查询学期总结表
  db.query(queryCountSql, [yCalendarId,yCalendarId, classId,classId, "%"+studentName +"%"], function (err, results, fields) {
    var total = 0;//总条数
    if (results) {
      total = results[0].total;
    }
    console.log("开始调用YearSmmaryList请求参数：" + results[0].total);
    var yearSmmaryListSql = "SELECT"
    + " t.fd_id as yearSummaryId,yCal.fd_name as yearCalendarName,yCal.fd_id as yearCalendarId,st.fd_id as studentId,st.fd_name as studentName,aClass.fd_id as classId,aClass.fd_name as className,cu.fd_name as createUserName,cu.fd_id as createUserId, uu.fd_name as updateUserName,uu.fd_id as updateUserId,DATE_FORMAT(t.fd_add_time,'%Y-%m-%d %H:%i') as addTime,DATE_FORMAT(t.fd_update_time,'%Y-%m-%d %H:%i') as updateTime"
    + " FROM"
    + " iep_year_summary t"
    + " left join affairs_year_calendar yCal on yCal.fd_id = t.fd_year_calendar_id"
    + " left JOIN basic_student st on st.fd_id = t.fd_student_id"
    + " left join affairs_class aClass on aClass.fd_id = st.fd_class_id"
    + " left JOIN basic_user cu on cu.fd_id = t.fd_create_user_id"
    + " left JOIN basic_user uu on uu.fd_id = t.fd_update_user_id"
    + " WHERE"
    + " 1 = 1"
    + " and IF(?=0,1 = 1,yCal.fd_id = ?)"
    + " and IF(?=0,1 = 1,aClass.fd_id = ?)"
    + " and st.fd_name like ?  order by t.fd_add_time desc,t.fd_id desc LIMIT "+(page-1)*perpage+","+perpage;
    console.log("yearSmmaryListSql:" + yearSmmaryListSql);
    db.query(yearSmmaryListSql,  [yCalendarId,yCalendarId, classId,classId,"%"+studentName+"%"], function (err, results, fields) {
      callback && callback(err, results, fields, total);
    });
  });
}

/**
 * 插入学年总结
 * @param {学期总结的数据}} semesterSummary 
 * @param {插入学期总结的回调} callback 
 */
function insertYearSummary(yearSummaryId, yearSummary, callback) {
  var addUpdateDate = new Date();//创建时间
  console.log("yearSummary:"+yearSummary)
  var insertYearSummarySql = 'insert into iep_year_summary (fd_id'
    + ',fd_year_calendar_id'
    + ',fd_student_id'
    + ',fd_student_idcard'
    + ',fd_code'
    + ',fd_report_teacher_id'
    + ',fd_report_teacher_account'
    + ',fd_report_time'
    + ',fd_next_education_keys'
    + ',fd_teacher_comment'
    + ',fd_add_time'
    + ',fd_update_time'
    + ',fd_state'
    + ',fd_remark'
    + ',fd_update_user_id'
    + ',fd_create_user_id'
    + ')values('
    + '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'
    + ') ';
  var insertYearSummaryData = [yearSummaryId
    , yearSummary.yearCalendarId - 0 || 0
    , yearSummary.studentId - 0 || 0
    , yearSummary.studentIdCard || ''
    , yearSummary.code || ''
    , yearSummary.reportTeacherId - 0 || 0
    , yearSummary.reportTeacherAccount || ''
    ,(yearSummary.reportTime || '') == '' ? null : yearSummary.reportTime
    , yearSummary.nextEducationKeys || ''
    , yearSummary.teacherComment || ''
    , addUpdateDate
    , addUpdateDate
    , 1
    , yearSummary.remark || ''
    , yearSummary.updateUserId - 0 || 0
    , yearSummary.createUserId - 0 || 0
  ];
  db.query(insertYearSummarySql, insertYearSummaryData, function (err, results, fields) {
    callback && callback(err, results, fields);
  });
}


/**
* 更新学期总结
* @param {学期总结Id} semesterSummaryId 
* @param {模块学期总结} iepSemesterSummary 
* @param {*} callback 
*/
function updateYearSummary(yearSummaryId, yearSummary, callback) {
  var addUpdateDate = new Date();
  var updateYearSummarySql = 'update iep_year_summary set '
    + 'fd_year_calendar_id= ?'
    + ',fd_student_id= ?'
    + ',fd_student_idcard= ?'
    + ',fd_code = ?'
    + ',fd_report_teacher_id= ?'
    + ',fd_report_teacher_account= ?'
    + ',fd_report_time= ?'
    + ',fd_next_education_keys= ?'
    + ',fd_teacher_comment= ?'
    + ',fd_update_time= ?'
    + ',fd_state= ?'
    + ',fd_remark= ?'
    + ',fd_update_user_id= ?'   
    + ' where fd_id = ?';
  var updateYearSummaryData = [
      yearSummary.yearCalendarId - 0 || 0
    , yearSummary.studentId - 0 || 0
    , yearSummary.studentIdCard || ''
    , yearSummary.code || ''
    , yearSummary.reportTeacherId - 0 || 0
    , yearSummary.reportTeacherAccount || ''
    ,(yearSummary.reportTime || '') == '' ? null : iepSemesterSummary.reportTime
    , yearSummary.nextEducationKeys || ''
    , yearSummary.teacherComment || ''    
    , addUpdateDate
    , 1
    , yearSummary.remark || ''
    , yearSummary.updateUserId - 0 || 0
    , yearSummaryId
  ];

  db.query(updateYearSummarySql, updateYearSummaryData, function (err, results, fields) {
    callback && callback(err, results, fields);
  });
}


/**
 * 删除学年总结
 * @param {学期总结Id} iepSemesterSummaryId 
 * @param {} iepSemesterSummary 
 * @param {回调参数} callback 
 */
function deleteYearSummary(yearSummaryId, yearSummary, callback) {
  var deleteYearSummarySql = 'delete from iep_year_summary WHERE fd_id=?';
  var deleteYearSummaryData = [yearSummaryId]
  db.query(deleteYearSummarySql, deleteYearSummaryData, function (err, results, fields) {
    callback && callback(err, results, fields);
  });
}

function yearSummaryDetail(yearSummaryId, callback) {
  //查询学期总结详情 
  var yearSummartDetailSql = "SELECT"
  + " t.fd_id as yearSummaryId,yCal.fd_name as yearCalendarName,yCal.fd_id as yearCalendarId,t.fd_next_education_keys as nextEducationKeys,t.fd_teacher_comment as teacherComment,st.fd_id as studentId,st.fd_name as studentName,aClass.fd_id as classId,aClass.fd_name as className,cu.fd_name as createUserName,cu.fd_id as createUserId, uu.fd_name as updateUserName,uu.fd_id as updateUserId,DATE_FORMAT(t.fd_add_time,'%Y-%m-%d %H:%i') as addTime,DATE_FORMAT(t.fd_update_time,'%Y-%m-%d %H:%i') as updateTime"
  + " FROM"
  + " iep_year_summary t"
  + " left join affairs_year_calendar yCal on yCal.fd_id = t.fd_year_calendar_id"
  + " left JOIN basic_student st on st.fd_id = t.fd_student_id"
  + " left join affairs_class aClass on aClass.fd_id = st.fd_class_id"
  + " left JOIN basic_user cu on cu.fd_id = t.fd_create_user_id"
  + " left JOIN basic_user uu on uu.fd_id = t.fd_update_user_id"
  + " WHERE t.fd_id=?";
  //学期总结
  db.query(yearSummartDetailSql, [yearSummaryId], function (err, results, fields) {
    callback && callback(err, results, fields);
  })
}



module.exports = {
  selectYearSmmaryList: selectYearSmmaryList,
  insertYearSummary: insertYearSummary,
  updateYearSummary: updateYearSummary,
  deleteYearSummary: deleteYearSummary,
  yearSummaryDetail: yearSummaryDetail 
}
