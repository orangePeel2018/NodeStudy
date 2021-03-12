var db = require('./db'); //引入数据库封装模块

/**
 * 获取同名的班级
 * @param {班级Id} affairsclassId 
 * @param {班级名称} name 
 * @param {回调方法} callback
 */
function getNameExist(affairsclassId,affairsclass,callback){
    var selectSql = 'select aClass.* from affairs_class aClass where (aClass.fd_class_no = ? or exists(select * from affairs_class_teacher ct where ct.fd_user_id = ? and ct.fd_identity = 1 and ct.fd_class_id <> aClass.fd_id)) and aClass.fd_id <> ?'
    var selectData = [affairsclass.classNo,affairsclass.headmasterId,affairsclassId];
    db.query(selectSql, selectData, function (err, results, fields) {
        callback && callback(err,results,fields);
    });
}

/**
 * 插入班级表
 * @param {插入班级的数据}} student 
 * @param {插入班级的回调} callback 
 */
function insertClass(affairsclassId,affairsclass,callback){
    var addUpdateDate = new Date();//注册时间
    var insertClass = 'insert into affairs_class (fd_id' 
      +',fd_class_no' 
      +',fd_name'
      +',fd_enrollment_time'
      +',fd_graduation_time'    
      +',fd_grade_id' 
      +',fd_add_time'  
      +',fd_update_time'
      +',fd_state'  
      +',fd_remark'
      +')values('
      +'?,?,?,?,?,?,?,?,?,?'
      +') ';
    var insertClassData = [affairsclassId
      ,affairsclass.classNo || ''
      ,affairsclass.name || ''
      ,affairsclass.enrollmentTime - 0 || 0
      ,affairsclass.graduationTime  - 0 || 0
      ,affairsclass.gradeId - 0 || 0
      ,addUpdateDate
      ,addUpdateDate  
      ,1 
      ,''
    ];
    db.query(insertClass, insertClassData, function (err, results, fields) {
      callback && callback(err,results,fields);
    });
  } 

  /**
 * 更新班级表信息
 * @param {班级Id} affairsclassId 
 * @param {班级更新信息} affairsclass 
 * @param {*} callback 
 */
function updateClass(affairsclassId,affairsclass,callback){
  var addUpdateDate = new Date();
  var updateClassSql = 'update affairs_class set '
  +'fd_class_no = ?'
  +',fd_name = ?'
  +',fd_enrollment_time = ?'
  +',fd_graduation_time = ?'
  +',fd_grade_id = ?' 
  +',fd_update_time = ?'
  +',fd_state = ?'
  +',fd_remark = ?'
  +'where fd_id = ?';

  var updateClassData = [affairsclass.classNo || ''
    ,affairsclass.name || ''
    ,affairsclass.enrollmentTime - 0 || 0
    ,affairsclass.graduationTime  - 0 || 0
    ,affairsclass.gradeId - 0 || 0
    ,addUpdateDate
    ,1 
    ,''
    ,affairsclassId
  ];

  db.query(updateClassSql, updateClassData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 删除班级
 * @param {班级Id} affairsclassId 
 * @param {} affairsclass 
 * @param {回调参数} callback 
 */
function deleteClass(affairsclassId,affairsclass,callback){
  var deletetClassSql = 'delete from  affairs_class WHERE fd_id=?';
  var deletetClassData = [affairsclassId]
  db.query(deletetClassSql, deletetClassData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 查询班级列表
 * @param {查询参数} queryParams 
 * @param {*} callback 
 */
function selectClassList(queryParams,callback){
  var page = queryParams.page; //请求的页数
  var perpage=queryParams.perpage;////每页的数量
  var classNo = queryParams.classNo || '';//班号
  var gradeId = queryParams.gradeId - 0 || 0;//年级
  var headMasterId = queryParams.headMasterId - 0 || 0;//班主任
  var cTeacher = queryParams.cTeacher - 0 || 0;//任课老师
  var queryCountSql="select count(*) as total FROM affairs_class t where 1=1 and t.fd_class_no like ? and if(? = 0, 1 = 1, t.fd_grade_id = ?) and EXISTS(select * from affairs_class_teacher ct where if(? = 0, 1 = 1, ? = fd_user_id) and fd_identity = 1 and ct.fd_class_id = t.fd_id) and EXISTS(select * from affairs_class_teacher ct where if(? = 0, 1 = 1, ? = fd_user_id) and fd_identity = 2 and ct.fd_class_id = t.fd_id)";  
    console.log("queryCountSql:" + queryCountSql);
    //查询users表
    db.query(queryCountSql, ["%"+classNo+"%",gradeId,gradeId,headMasterId,headMasterId,cTeacher,cTeacher], function (err, results, fields) { 
      var total=0;//总条数
      if(results){  
        total =results[0].total;       
      }  
      console.log("开始调用affairsclassList请求参数："+results[0].total);
      var queryClassListSql = "SELECT"
      +" affairsclass.*, grade.fd_code AS gradeCode,"
      +" grade.fd_name AS gradeName,"
      +" bu.fd_id AS headmasterId, bu.fd_name AS headmasterName"
    +" FROM"
      +" affairs_class affairsclass"
    +" LEFT JOIN affairs_grade grade ON grade.fd_id = affairsclass.fd_grade_id"
    +" LEFT JOIN affairs_class_teacher ct ON ct.fd_class_id = affairsclass.fd_id AND ct.fd_identity = 1"
    +" LEFT JOIN basic_user bu ON bu.fd_id = ct.fd_user_id"
    +" WHERE"
     +" 1=1 and affairsclass.fd_class_no like ? and if(? = 0, 1 = 1, affairsclass.fd_grade_id = ?) and EXISTS(select * from affairs_class_teacher ct where if(? = 0, 1 = 1, ? = fd_user_id) and fd_identity = 1 and ct.fd_class_id = affairsclass.fd_id) and EXISTS(select * from affairs_class_teacher ct where if(? = 0, 1 = 1, ? = fd_user_id) and fd_identity = 2 and ct.fd_class_id = affairsclass.fd_id)"
    +" ORDER BY"
      +" grade.fd_phase ASC,"
      +" affairsclass.fd_class_no ASC LIMIT "+(page-1)*perpage+","+perpage;
      console.log("queryClassListSql:" + queryClassListSql);
      db.query(queryClassListSql, ["%"+classNo+"%",gradeId,gradeId,headMasterId,headMasterId,cTeacher,cTeacher], function (err, results, fields) {
        callback && callback(err,results,fields,total);
      });
    }); 
}

function affairsclassDetail(affairsclassId,callback){
  //查询affairsclass 详情
  var getClassSql = "SELECT affairsclass.*,bu.fd_id AS headmasterId,bu.fd_name AS headmasterName,bu.fd_job_number as headmasterJobNumber,grade.fd_code as gradeCode,grade.fd_name as gradeName FROM affairs_class affairsclass LEFT JOIN affairs_class_teacher ct ON ct.fd_class_id = affairsclass.fd_id LEFT JOIN basic_user bu ON bu.fd_id = ct.fd_user_id AND ct.fd_identity = 1  left join affairs_grade grade on grade.fd_id = affairsclass.fd_id where affairsclass.fd_id = ?";
  //查询班级
  db.query(getClassSql, [affairsclassId], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

/**
 * 选择班级
 * @param {} affClass 
 * @param {*} callback 
 */
function selectClass(affClass,callback){
  console.log("affClass: "+affClass);
  //查询班级
  var getGradeSql = "select affClass.*,grade.fd_name as gradeName from affairs_class affClass left join affairs_grade grade on grade.fd_id = affClass.fd_grade_id where affClass.fd_class_no like ? or affClass.fd_name like ?";
  //选择班级
  db.query(getGradeSql, ["%"+affClass.classNo+"%","%"+affClass.name+"%"], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

//根据班级名称查询班级id
function selectClassByGradeNoAndClassNo(classNo,gradeNo,callback){
  console.log("gradeNo: "+gradeNo+"classNo: "+classNo);
  //查询班级
  var getClassByGradeNoAndClassNoSql = "select affClass.fd_id from affairs_class affClass where affclass.fd_class_no=? and affClass.fd_grade_type=?";
  //选择班级
  db.query(getClassByGradeNoAndClassNoSql, [classNo,gradeNo], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

//提升班级年级
function upgradeClassGrade(callback){
  //查询班级
  var upgradeClassGrade = "UPDATE affairs_class affClass SET affClass.fd_grade_type =affClass.fd_grade_type+1 where affClass.fd_id='1'";
  //选择班级
  db.query(upgradeClassGrade, [], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

module.exports = {
    getNameExist : getNameExist,
    insertClass : insertClass,
    updateClass : updateClass,
    deleteClass : deleteClass,
    selectClassList : selectClassList,
    affairsclassDetail : affairsclassDetail,
    selectClass : selectClass,
	selectClassByGradeNoAndClassNo:selectClassByGradeNoAndClassNo,
	upgradeClassGrade:upgradeClassGrade
}