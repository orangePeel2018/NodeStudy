var db = require('./db'); //引入数据库封装模块

/**
 * 判断该课程时间是否已经存在
 * @param {课程Id} courseId 
 * @param {课程名称} name 
 * @param {回调方法} callback
 */
function getNameExist(courseId,course,callback){
    var selectSql = "select * from subject_course where (((DATE_FORMAT(?,'%H:%i') >= DATE_FORMAT(fd_start_time,'%H:%i') and DATE_FORMAT(?,'%H:%i') <= DATE_FORMAT(fd_end_time,'%H:%i')) or (DATE_FORMAT(?,'%H:%i') >= DATE_FORMAT(fd_start_time,'%H:%i') and DATE_FORMAT(?,'%H:%i') <= DATE_FORMAT(fd_end_time,'%H:%i'))) and fd_week = ? and fd_class_id = ? and fd_id <> ? and fd_state = ?)"
     +" or EXISTS(select * from subject_course t where ((DATE_FORMAT(?,'%H:%i') >= DATE_FORMAT(t.fd_start_time,'%H:%i') and DATE_FORMAT(?,'%H:%i') <= DATE_FORMAT(t.fd_end_time,'%H:%i')) or (DATE_FORMAT(?,'%H:%i') >= DATE_FORMAT(t.fd_start_time,'%H:%i') and DATE_FORMAT(?,'%H:%i') <= DATE_FORMAT(t.fd_end_time,'%H:%i'))) and t.fd_week = ? and t.fd_class_teacher_id = ?  and t.fd_id <> ? and t.fd_state = ?) "
    var selectData = [course.startTime,course.startTime,course.endTime,course.endTime,course.week,course.classId,courseId,1,course.startTime,course.startTime,course.endTime,course.endTime,course.week,course.cTeacherId,courseId,1];
    db.query(selectSql, selectData, function (err, results, fields) {
        callback && callback(err,results,fields);
    });
}

/**
 * 插入课程表
 * @param {插入课程的数据}} student 
 * @param {插入课程的回调} callback 
 */
function insertCourse(courseId,course,callback){
    var addUpdateDate = new Date();//注册时间
    var insertCourse = 'insert into subject_course (fd_id' 
      +',fd_code' 
      +',fd_semester_calendar_id'
      +',fd_class_id'
      +',fd_course' 
      +',fd_class_teacher_id' 
      +',fd_week'    
      +',fd_number' 
      +',fd_start_time' 
      +',fd_end_time' 
      +',fd_add_time' 
      +',fd_update_time'  
      +',fd_state'  
      +',fd_remark'
      +')values('
      +'?,?,?,?,?,?,?,?,?,?,?,?,?,?'
      +') ';
    var insertCourseData = [courseId
      ,course.code || ''
      ,course.sCalendarId - 0 || 0
      ,course.classId - 0 || 0
      ,course.course || ''
      ,course.cTeacherId - 0 || 0
      ,course.week  - 0 || 0
      ,course.number  - 0 || 0
      ,(course.startTime || '') == '' ? null : course.startTime
      ,(course.endTime || '') == '' ? null : course.endTime
      ,addUpdateDate
      ,addUpdateDate  
      ,1 
      ,course.remark
    ];
    db.query(insertCourse, insertCourseData, function (err, results, fields) {
      callback && callback(err,results,fields);
    });
  } 

  /**
 * 更新课程表信息
 * @param {课程Id} courseId 
 * @param {课程更新信息} course 
 * @param {*} callback 
 */
function updateCourse(courseId,course,callback){
  var addUpdateDate = new Date();
  var updateCourseSql = 'update subject_course set '
  +'fd_code = ?' 
  +',fd_semester_calendar_id = ?'
  +',fd_class_id = ?'
  +',fd_course = ?' 
  +',fd_class_teacher_id = ?' 
  +',fd_week = ?'    
  +',fd_number = ?' 
  +',fd_start_time = ?' 
  +',fd_end_time = ?' 
  +',fd_add_time = ?' 
  +',fd_update_time = ?'  
  +',fd_state = ?'  
  +',fd_remark = ?'
  +' where fd_id = ?';

  var updateCourseData = [course.code || ''
    ,course.sCalendarId - 0 || 0
    ,course.classId - 0 || 0
    ,course.course || ''
    ,course.cTeacherId - 0 || 0
    ,course.week  - 0 || 0
    ,course.number  - 0 || 0
    ,(course.startTime || '') == '' ? null : course.startTime
    ,(course.endTime || '') == '' ? null : course.endTime
    ,addUpdateDate
    ,addUpdateDate  
    ,1 
    ,course.remark
    ,courseId
  ];

  db.query(updateCourseSql, updateCourseData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}


  /**
 * 更新课程表状态
 * @param {课程Id} courseId 
 * @param {课程更新信息} course 
 * @param {*} callback 
 */
function updateCourseState(courseId,state,callback){
  var updateCourseSql = 'update subject_course set '
  +' fd_state = ?'  
  +' where fd_id = ?';
  var updateCourseData = [state 
    ,courseId
  ];
  db.query(updateCourseSql, updateCourseData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 删除课程
 * @param {课程Id} courseId 
 * @param {} course 
 * @param {回调参数} callback 
 */
function deleteCourse(courseId,course,callback){
  var deletetCourseSql = 'delete from  subject_course WHERE fd_id=?';
  var deletetCourseData = [courseId]
  db.query(deletetCourseSql, deletetCourseData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 查询课程列表
 * @param {查询参数} queryParams 
 * @param {*} callback 
 */
function selectCourseList(queryParams,callback){
  var page = queryParams.page; //请求的页数
  var perpage=queryParams.perpage;////每页的数量
  var sCalendarId=queryParams.sCalendarId - 0 || 0;//学期ID
  var classId = queryParams.classId - 0 || 0;//班级ID
  var userId = queryParams.userId - 0 || 0;//班级老师ID
  var course = queryParams.course || '';//课程
  var queryCountSql="SELECT"
	+" count(*) AS total"
  +" FROM"
	+" subject_course t"
  +" left join affairs_semester_calendar sCal on sCal.fd_id = t.fd_semester_calendar_id"
  +" left join affairs_class aClass on aClass.fd_id = t.fd_class_id"
  +" left JOIN basic_user u on u.fd_id = t.fd_class_teacher_id"
  +" WHERE"
  +" 	1 = 1"
  +" and IF(?=0,1 = 1,sCal.fd_id = ?)"
  +" and IF(?=0,1 = 1,aClass.fd_id = ?)"
  +" and IF(?=0,1 = 1,u.fd_id = ?)"
  +" and t.fd_course like ?";  
    console.log("queryCountSql:" + queryCountSql);
    //查询users表
    db.query(queryCountSql, [sCalendarId,sCalendarId,classId,classId,userId,userId,"%"+course+"%"], function (err, results, fields) { 
      var total=0;//总条数
      if(results){  
        total =results[0].total;       
      }  
      console.log("开始调用courseList请求参数："+results[0].total);
      var queryCourseListSql = "SELECT"
      +" i.fd_name as fd_week_name,sCal.fd_name as sCalendarName,sCal.fd_id as sCalendarId,aClass.fd_id as classId,aClass.fd_name as className,aClass.fd_class_no as classNo,t.fd_id as courseId,t.fd_course,u.fd_id as teacherId,u.fd_name as teacherName,t.fd_week,t.fd_number,DATE_FORMAT(t.fd_start_time,'%Y-%m-%d %H:%i') as startTime,DATE_FORMAT(t.fd_end_time,'%Y-%m-%d %H:%i') as endTime"
      +" FROM"
      +" subject_course t"
      +" left join affairs_semester_calendar sCal on sCal.fd_id = t.fd_semester_calendar_id"
      +" left join affairs_class aClass on aClass.fd_id = t.fd_class_id"
      +" left JOIN basic_user u on u.fd_id = t.fd_class_teacher_id"
      +" left join system_code_item  i on i.fd_value = t.fd_week"
      +" left join system_code c on i.fd_code_id=c.fd_id"
      +" WHERE"
      +" 1 = 1"
      +" and IF(?=0,1 = 1,sCal.fd_id = ?)"
      +" and IF(?=0,1 = 1,aClass.fd_id = ?)"
      +" and IF(?=0,1 = 1,u.fd_id = ?)"
      +" and t.fd_course like ? and c.fd_code='week_type' order by sCal.fd_start_time desc,t.fd_start_time desc,t.fd_id desc limit " +(page-1)*perpage+","+perpage;
      console.log("queryCourseListSql:" + queryCourseListSql);
      db.query(queryCourseListSql, [sCalendarId,sCalendarId,classId,classId,userId,userId,"%"+course+"%"], function (err, results, fields) {
        callback && callback(err,results,fields,total);
      });
    }); 
}

function courseDetail(courseId,callback){
  //查询course 详情
  var getCourseSql = "SELECT"
  +" sCal.fd_name as sCalendarName,sCal.fd_id as sCalendarId,aClass.fd_id as classId,aClass.fd_name as className,aClass.fd_class_no as classNo,t.fd_id as courseId,t.fd_code,t.fd_course,t.fd_remark,u.fd_id as teacherId,u.fd_name as teacherName,t.fd_week,t.fd_number,DATE_FORMAT(t.fd_start_time,'%Y-%m-%d %H:%i') as startTime,DATE_FORMAT(t.fd_end_time,'%Y-%m-%d %H:%i') as endTime"
  +" FROM"
  +" subject_course t"
  +" left join affairs_semester_calendar sCal on sCal.fd_id = t.fd_semester_calendar_id"
  +" left join affairs_class aClass on aClass.fd_id = t.fd_class_id"
  +" left JOIN basic_user u on u.fd_id = t.fd_class_teacher_id"
  +" WHERE"
  +" 	1 = 1"
  +" and t.fd_id = ?";
  //查询课程
  db.query(getCourseSql, [courseId], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

function selectCourse(course,callback){
  console.log("course: "+course);
  var dateTime = course.dateTime || '';
  //查询course 详情
  var getCourseSql = "select course.fd_id, course.fd_code,course.fd_course,course.fd_number,course.fd_week,date_format(course.fd_start_time,'%Y-%m-%d %h:%i') as startTime,date_format(course.fd_end_time,'%Y-%m-%d %h:%i') as endTime from subject_course course where Date(course.fd_start_time) <= ? and Date(course.fd_end_time) >= ? and if( ? = 0 , 1 = 1, course.fd_class_id = ?) and if( ? = 0 , 1 = 1, course.fd_class_teacher_id = ?) and course.fd_state = 1 ";
  //查询课程
  db.query(getCourseSql, [dateTime,dateTime,course.classId - 0 || 0,course.classId - 0 || 0,course.teacherId - 0 || 0,course.teacherId - 0 || 0], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

function selectCourseBytipsay(course,callback){
  //查询course 详情
  var getCourseSql = "select course.fd_id, course.fd_code,course.fd_course,date_format(course.fd_start_time,'%Y-%m-%d %h:%i') as startTime,date_format(course.fd_end_time,'%Y-%m-%d %h:%i') as endTime from subject_course course where 1 = 1 and course.fd_state = 1 ";
  //查询课程
  db.query(getCourseSql, [], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

/**
 * 课程人数
 * @param {} callback 
 */
function courseCondition(callback){
  var courseConditionSql = "select count(*),aclass.fd_class_no,aclass.fd_name as className,u.fd_name as teacherName,u.fd_job_number from subject_course t LEFT JOIN affairs_class aclass on aclass.fd_id = t.fd_class_id left join basic_user u on u.fd_id = t.fd_class_teacher_id GROUP BY t.fd_class_teacher_id,t.fd_class_id";
  db.query(courseConditionSql, [], function (err, results, fields) {
    callback && callback(err,results,fields);
  }) 
}

module.exports = {
    getNameExist : getNameExist,
    insertCourse : insertCourse,
    updateCourse : updateCourse,
    deleteCourse : deleteCourse,
    selectCourseList : selectCourseList,
    courseDetail : courseDetail,
    courseCondition : courseCondition,
    selectCourse : selectCourse,
    updateCourseState : updateCourseState,
    selectCourseBytipsay : selectCourseBytipsay
}