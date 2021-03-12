var db = require('./db'); //引入数据库封装模块

/**
 * 获取有包含日期或重名的学期
 * @param {学期Id} semestercalendarId 
 * @param {学期} semestercalendar 
 * @param {回调方法} callback
 */
function getNameExist(semestercalendarId,semestercalendar,callback){
  var selectSql = 'select * from affairs_semester_calendar where (fd_name = ? or (Date(?) >= Date(fd_start_time) and Date(?) <= Date(fd_end_time)) or (Date(?) >= Date(fd_start_time) and Date(?) <= Date(fd_end_time))) and fd_year_calendar_id = ? and fd_id <> ?'
  var selectData = [semestercalendar.name, semestercalendar.startTime, semestercalendar.startTime, semestercalendar.endTime, semestercalendar.endTime, semestercalendar.yearcalendarId,semestercalendarId];
  db.query(selectSql, selectData, function (err, results, fields) {
      callback && callback(err,results,fields);
  });
}

/**
 * 获取重复编码的学期
 * @param {学期Id} semestercalendarId 
 * @param {学期} semestercalendar 
 * @param {回调方法} callback
 */
function getCodeExist(semestercalendarId,semestercalendar,callback){
  var selectSql = 'select * from affairs_semester_calendar where fd_code = ? and fd_id <> ?'
  var selectData = [semestercalendar.code,semestercalendarId];
  db.query(selectSql, selectData, function (err, results, fields) {
      callback && callback(err,results,fields);
  });
}


/**
 * 插入校历学期表
 * @param {插入校历学期的数据}} semestercalendar 
 * @param {插入校历学期的回调} callback 
 */
function insertSemesterCalendar(semestercalendarId,semestercalendar,callback){
    var addUpdateDate = new Date();//注册时间
    var insertSemesterCalendar = 'insert into affairs_semester_calendar (fd_id' 
      +',fd_year_calendar_id'
      +',fd_code' 
      +',fd_name'
      +',fd_semester'
      +',fd_start_time'
      +',fd_end_time'
      +',fd_add_time'
      +',fd_update_time'    
      +',fd_state' 
      +',fd_remark' 
      +')values('
      +'?,?,?,?,?,?,?,?,?,?,?'
      +') ';
    var insertSemesterCalendarData = [semestercalendarId
      ,semestercalendar.yearCalendarId - 0 || 0
      ,semestercalendar.code || ''
      ,semestercalendar.name || ''
      ,semestercalendar.semester - 0 || 0
      ,(semestercalendar.startTime || '') == '' ? null : semestercalendar.startTime
      ,(semestercalendar.endTime || '') == '' ? null : semestercalendar.endTime
      ,addUpdateDate
      ,addUpdateDate 
      ,1 
      ,''
    ];
    db.query(insertSemesterCalendar, insertSemesterCalendarData, function (err, results, fields) {
      callback && callback(err,results,fields);
    });
  } 

  /**
 * 更新校历学期表信息
 * @param {校历学期Id} semestercalendarId 
 * @param {校历学期更新信息} semestercalendar 
 * @param {*} callback 
 */
function updateSemesterCalendar(semestercalendarId,semestercalendar,callback){
  var addUpdateDate = new Date();
  var updateSemesterCalendarSql = 'update affairs_semester_calendar set '
  +'fd_year_calendar_id = ?'
  +',fd_code = ?' 
  +',fd_name = ?'
  +',fd_semester = ?'
  +',fd_start_time = ?'
  +',fd_end_time = ?'
  +',fd_update_time = ?'    
  +',fd_state = ?' 
  +',fd_remark = ?' 
  +' where fd_id = ?';

  var updateSemesterCalendarData = [semestercalendar.yearCalendarId - 0 || 0
    ,semestercalendar.code || ''
    ,semestercalendar.name || ''
    ,semestercalendar.semester - 0 || 0
    ,(semestercalendar.startTime || '') == '' ? null : semestercalendar.startTime
    ,(semestercalendar.endTime || '') == '' ? null : semestercalendar.endTime
    ,addUpdateDate
    ,1 
    ,''
    ,semestercalendarId
  ];

  db.query(updateSemesterCalendarSql, updateSemesterCalendarData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 更新同步人,同步日期
 * @param {*} semestercalendarId 
 * @param {*} semestercalendar 
 * @param {*} callback 
 */
function updateSemesterCalendarTime(semestercalendarId,semestercalendar,callback){
  var addUpdateDate = new Date();
  var updateSemesterCalendarSql = 'update affairs_semester_calendar set '
  +'fd_recent_syn_time = ?'
  +',fd_recent_syn_user = ?' 
  +' where fd_id = ?';

  var updateSemesterCalendarData = [semestercalendar.recentSynTime
    ,semestercalendar.recentSynUser
    ,semestercalendarId
  ];

  db.query(updateSemesterCalendarSql, updateSemesterCalendarData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 删除校历学期
 * @param {校历学期Id} semestercalendarId 
 * @param {} semestercalendar 
 * @param {回调参数} callback 
 */
function deleteSemesterCalendar(semestercalendarId,semestercalendar,callback){
  var deletetSemesterCalendarSql = 'delete from  affairs_semester_calendar WHERE fd_id=?';
  var deletetSemesterCalendarData = [semestercalendarId]
  db.query(deletetSemesterCalendarSql, deletetSemesterCalendarData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 查询校历学期列表
 * @param {查询参数} queryParams 
 * @param {*} callback 
 */
function selectSemesterCalendarList(queryParams,callback){
  var page = queryParams.page; //请求的页数
  var perpage=queryParams.perpage;////每页的数量
  var name=queryParams.name || '';//名称
  var queryCountSql='select count(*) as total FROM affairs_semester_calendar where 1=1 and fd_name like ?';  
  console.log("queryCountSql:" + queryCountSql);
  //查询users表
  db.query(queryCountSql, ["%"+name+"%"], function (err, results, fields) { 
    var total=0;//总条数
    if(results){  
      total =results[0].total;       
    }  
    console.log("开始调用semestercalendarList请求参数："+results[0].total);
    var querySemesterCalendarListSql = "SELECT"
    +" semestercalendar.fd_id,"
    +" semestercalendar.fd_code,"
    +" semestercalendar.fd_name,"
    +" semestercalendar.fd_semester,"
    +" i.fd_name as fd_semester_name,"
    +" DATE_FORMAT("
      +" semestercalendar.fd_start_time,"
      +" '%Y-%m-%d'"
      +" ) AS startTime,"
      +" DATE_FORMAT("
        +" semestercalendar.fd_end_time,"
        +" '%Y-%m-%d'"
        +" ) AS endTime,"
        +" yearCal.fd_code AS yearCode,"
        +" yearCal.fd_name AS yearName"
    +" FROM"
        +" affairs_semester_calendar semestercalendar"
    +" LEFT JOIN affairs_year_calendar yearCal ON yearCal.fd_id = semestercalendar.fd_year_calendar_id"
    +" left join system_code_item  i on i.fd_value = semestercalendar.fd_semester"
    +" left join system_code c on i.fd_code_id=c.fd_id"
    +" WHERE"
        +" semestercalendar.fd_name LIKE ? and c.fd_code='semester_type'"
    +" order by yearCal.fd_start_time asc,semestercalendar.fd_start_time asc,semestercalendar.fd_code desc, semestercalendar.fd_add_time desc,semestercalendar.fd_id desc LIMIT "+(page-1)*perpage+","+perpage;
    console.log("querySemesterCalendarListSql:" + querySemesterCalendarListSql);
    db.query(querySemesterCalendarListSql, ["%"+name+"%"], function (err, results, fields) {
      callback && callback(err,results,fields,total);
    });
  }); 
}

function semesterCalendarDetail(semestercalendarId,callback){
  //查询semestercalendar 详情
  var getSemesterCalendarSql = "SELECT"
  +" semestercalendar.fd_id,"
  +" semestercalendar.fd_code,"
  +" semestercalendar.fd_name,"
  +" semestercalendar.fd_semester,"
  +"semestercalendar.fd_year_calendar_id,"
  +" i.fd_name as fd_semester_name,"
  +" DATE_FORMAT("
    +" semestercalendar.fd_start_time,"
    +" '%Y-%m-%d'"
    +" ) AS startTime,"
    +" DATE_FORMAT("
      +" semestercalendar.fd_end_time,"
      +" '%Y-%m-%d'"
      +" ) AS endTime,"
      +" yearCal.fd_code AS yearCode,"
      +" yearCal.fd_name AS yearName"
  +" FROM"
      +" affairs_semester_calendar semestercalendar"
  +" LEFT JOIN affairs_year_calendar yearCal ON yearCal.fd_id = semestercalendar.fd_year_calendar_id"
  +" left join system_code_item  i on i.fd_value = semestercalendar.fd_semester"
  +" left join system_code c on i.fd_code_id=c.fd_id"
  +" WHERE"
      +" semestercalendar.fd_id = ? and c.fd_code='semester_type'";
  //查询校历学期
  db.query(getSemesterCalendarSql, [semestercalendarId], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

/**
 * 选择学期
 * @param {} semestercalendar 
 * @param {*} callback 
 */
function selectSemesterCalendar(semestercalendar,callback){
  //查询semestercalendar 详情
  var getSemesterCalendarSql = "SELECT"
  +" semestercalendar.fd_id,"
  +" semestercalendar.fd_code,"
  +" semestercalendar.fd_name,"
  +" semestercalendar.fd_semester,"
  +"semestercalendar.fd_year_calendar_id,"
  +" i.fd_name as fd_semester_name,"
  +" DATE_FORMAT("
    +" semestercalendar.fd_start_time,"
    +" '%Y-%m-%d'"
    +" ) AS startTime,"
    +" DATE_FORMAT("
      +" semestercalendar.fd_end_time,"
      +" '%Y-%m-%d'"
      +" ) AS endTime,"
      +" yearCal.fd_code AS yearCode,"
      +" yearCal.fd_name AS yearName"
  +" FROM"
      +" affairs_semester_calendar semestercalendar"
  +" LEFT JOIN affairs_year_calendar yearCal ON yearCal.fd_id = semestercalendar.fd_year_calendar_id"
  +" left join system_code_item  i on i.fd_value = semestercalendar.fd_semester"
  +" left join system_code c on i.fd_code_id=c.fd_id"
  +" WHERE"
      +" semestercalendar.fd_name like ? and yearCal.fd_id = ? and c.fd_code='semester_type'";
  //查询校历学期
  db.query(getSemesterCalendarSql, ["%"+semestercalendar.name+"%",semestercalendar.yearCalendarId], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

/**
 * 选择学期
 * @param {} semestercalendar 
 * @param {*} callback 
 */
function selectSCalendar(semestercalendar,callback){
  //查询semestercalendar 详情
  var getSemesterCalendarSql = "SELECT"
  +" semestercalendar.fd_id,"
  +" semestercalendar.fd_code,"
  +" semestercalendar.fd_name,"
  +" semestercalendar.fd_semester,"
  +"semestercalendar.fd_year_calendar_id,"
  +" i.fd_name as fd_semester_name,"
  +" DATE_FORMAT("
    +" semestercalendar.fd_start_time,"
    +" '%Y-%m-%d'"
    +" ) AS startTime,"
    +" DATE_FORMAT("
      +" semestercalendar.fd_end_time,"
      +" '%Y-%m-%d'"
      +" ) AS endTime,"
      +" yearCal.fd_code AS yearCode,"
      +" yearCal.fd_name AS yearName"
  +" FROM"
      +" affairs_semester_calendar semestercalendar"
  +" LEFT JOIN affairs_year_calendar yearCal ON yearCal.fd_id = semestercalendar.fd_year_calendar_id"
  +" left join system_code_item  i on i.fd_value = semestercalendar.fd_semester"
  +" left join system_code c on i.fd_code_id=c.fd_id"
  +" WHERE"
      +" semestercalendar.fd_name like ?  and c.fd_code='semester_type'";
  //查询校历学期
  db.query(getSemesterCalendarSql, ["%"+semestercalendar.name+"%"], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}


//根据学期名称查询学期id
function selectSemesterByName(semesterName,callback){
  console.log("semesterName: "+semesterName);
  //查询学期
  var getSemesterByName = "select semester.fd_id from affairs_semester_calendar semester where semester.fd_name=?";

  db.query(getSemesterByName, [semesterName], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}


module.exports = {
    insertSemesterCalendar : insertSemesterCalendar,
    updateSemesterCalendar : updateSemesterCalendar,
    deleteSemesterCalendar : deleteSemesterCalendar,
    selectSemesterCalendarList : selectSemesterCalendarList,
    semesterCalendarDetail : semesterCalendarDetail,
    selectSemesterCalendar : selectSemesterCalendar,
    getNameExist : getNameExist,
    selectSCalendar : selectSCalendar,
    updateSemesterCalendarTime : updateSemesterCalendarTime,
    getCodeExist : getCodeExist,
	selectSemesterByName:selectSemesterByName
}