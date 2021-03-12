var db = require('./db'); //引入数据库封装模块
var primaryKeyUtils = require('./primaryKeyUtils');
var transDb = require('./transactionDb')
var iepDiagnoseLogDao = require('./iepDiagnoseLogDao')

/**
 * 查询教育诊断列表
 * @param {*} dbConn 事物
 * @param {*} query  查询参数
 * @param {*} callback 回到函数
 */
function selectIepDiagonseList(query,callback){
  console.log('query:'+query)
  var page = query.page -0 || 0;
  var perpage = query.perpage -0 || 0;
  var gradeType = query.gradeType -0 || 0;
  var classId = query.classId -0 || 0;
  var studentName = query.studentName || '';
  var reportType =query.reportType -0 || 0;
  var queryCountSql="SELECT" 
    +" count(*) AS total"
    +" FROM"
    +" iep_diagnose_report idr"
    +"  WHERE"
    +" 1 = 1"
    +"  AND idr.fd_student_id IN ("
        +"  SELECT"
        +"     bs.fd_id"
        +"  FROM"
        +"     basic_student bs"
        +"  LEFT JOIN affairs_class class ON bs.fd_class_id =class.fd_id"
        +"  LEFT JOIN system_code_item codeItem ON codeItem.fd_value =class.fd_grade_type"
        +" WHERE"
        +"     bs.fd_name like ?"
        +" AND if(?=0,1=1,class.fd_grade_type=?)"
        +" AND if(?=0,1=1,class.fd_id=?)"
        +" )"
    +"  And if(?=0,1=1,idr.fd_report_type = ?)";  
  
  console.log("queryCountSql:" + queryCountSql);
  db.query(queryCountSql, ['%'+studentName+'%',gradeType,gradeType,classId,classId,reportType,reportType], function (err, results, fields) { 
    var total=0;//总条数
    if(results){  
      total =results[0].total;       
    }  
    console.log("开始调用selectIepDiagonseList请求参数："+results[0].total);
    var selectIepDiagonseListSql="SELECT" 
    +" 	idr.*, bs.fd_name AS studentName,codeItem.fd_name as reportName,Item.fd_name as className,cItem.fd_name as gradeName"
    +" FROM"
    +" iep_diagnose_report idr"
    +" LEFT JOIN basic_student bs ON bs.fd_id = idr.fd_student_id"
    +" LEFT JOIN system_code_item codeItem ON codeItem.fd_value = idr.fd_report_type"
    +" LEFT JOIN system_code sc ON sc.fd_id = codeItem.fd_code_id"
    +" LEFT JOIN affairs_class class ON bs.fd_class_id = class.fd_id"
    +" LEFT JOIN system_code_item item ON item.fd_value = class.fd_class_no"
    +" LEFT JOIN system_code scode ON scode.fd_id = item.fd_code_id"
    +" LEFT JOIN system_code_item cItem ON cItem.fd_value = class.fd_grade_type"
    +" LEFT JOIN system_code sysCode ON sysCode.fd_id = cItem.fd_code_id"
    +" WHERE"
    +" 1 = 1"
    +" And sc.fd_code='report_type'"
    +" And scode.fd_code='class_no'"
    +" And sysCode.fd_code='grade_type'"
    +" AND idr.fd_student_id IN ("
        +"  SELECT"
        +"     bs.fd_id"
        +"  FROM"
        +"     basic_student bs"
        +"  LEFT JOIN affairs_class class ON bs.fd_class_id =class.fd_id"
        +"  LEFT JOIN system_code_item codeItem ON codeItem.fd_value =class.fd_grade_type"
        +" WHERE"
        +"     bs.fd_name like ?"
        +" AND if(?=0,1=1,class.fd_grade_type=?)"
        +" AND if(?=0,1=1,class.fd_id=?)"
        +" )"
    +" And if(?=0,1=1,idr.fd_report_type = ?)"
    +" limit "+(page-1)*perpage+","+perpage;

    db.query(selectIepDiagonseListSql,['%'+studentName+'%',gradeType,gradeType,classId,classId,reportType,reportType],function (err, results, fields) {
      callback && callback(err,results,fields,total);
    });
  });
}



/**
 * 插入教育诊断
 * @param {插入教育诊断的主键}} iepDiagnoseId 
 * @param {插入教育诊断的数据}} iepDiagnose 
 * @param {插入教育诊断的回调} callback 
 */
function insertIepDiagonse(dbConn,iepDiagnoseId,iepDiagnose,callback){
    var addUpdateDate = new Date();//注册时间
    var insertIepDiagonse = 'insert into iep_diagnose_report (fd_id' 
      +',fd_code' 
      +',fd_student_id'
      +',fd_student_idcard'
      +',fd_report_type'    
      +',fd_report_time'
      +',fd_evaluation_results'
      +',fd_improve_items' 
      +',fd_add_time' 
      +',fd_update_time'
      +',fd_state'
      +',fd_remark'
      +')values('
      +'?,?,?,?,?,?,?,?,?,?,?,?'
      +') ';
    var insertIepDiagonseData = [iepDiagnoseId
      ,iepDiagnose.code || ''
      ,iepDiagnose.studentId -0 || 0
      ,iepDiagnose.idCard || ''
      ,iepDiagnose.reportType -0 || 0
      ,(iepDiagnose.reportTime || '') == '' ? null : iepDiagnose.reportTime
      ,iepDiagnose.evaluationResults || ''
      ,iepDiagnose.improveItems || ''
      ,addUpdateDate
      ,addUpdateDate
      ,1
      ,iepDiagnose.remark||''
    ];
    if(dbConn==null){
        db.query(insertIepDiagonse, insertIepDiagonseData, function (err, results, fields) {
            callback && callback(err,results,fields);
        });
    }else{
        return dbConn.query(insertIepDiagonse,insertIepDiagonseData);
    }
  } 

/**
 * 删除教育诊断信息
 * @param {教育诊断信息Id} schoolId 
 * @param {删除信息，记录日志} school   
 * @param {回调参数} callback 
 */
function deleteIepDiagnose(dbConn,iepDiagnoseId,iepDiagnose,callback){
  var deleteIepDiagnoseSql = 'delete from iep_diagnose_report WHERE fd_id=?';
  var deleteIepDiagnoseData = [iepDiagnoseId]
  if(dbConn==null){
	db.query(deleteIepDiagnoseSql, deleteIepDiagnoseData, function (err, results, fields) {
	  callback && callback(err,results,fields);
	});  
  }else{
	  return dbConn.query(deleteIepDiagnoseSql,deleteIepDiagnoseData);
  }
 
}



function iepDiagnoseDetail(iepDiagnoseId,callback){
  //查询school 详情
  var getIepDiagnoseDetailSql = "SELECT"
	+" idr.*, bu.fd_name AS operateUserName,"
	+" bs.fd_name AS studentName,"
	+" sci.fd_name AS reportType,"
	+" idrl.fd_operate_type AS operateType,"
	+" idrl.fd_add_time AS operateTime,"
	+" item.fd_name AS gradeName,"
	+" codeItem.fd_name AS className,"
	+" scodeItem.fd_name AS operateReportType"
	+" FROM"
	+" iep_diagnose_report idr"
	+" LEFT JOIN iep_diagnose_report_log idrl ON idr.fd_id = idrl.fd_diagnose_report_id"
	+" LEFT JOIN basic_user bu ON idrl.fd_operater_id = bu.fd_id"
	+" LEFT JOIN basic_student bs ON idr.fd_student_id = bs.fd_id"
	+" LEFT JOIN system_code_item sci ON idr.fd_report_type = sci.fd_value"
	+" LEFT JOIN system_code sc ON sc.fd_id = sci.fd_code_id"
	+" LEFT JOIN affairs_class ac ON bs.fd_class_id = ac.fd_id"
	+" LEFT JOIN system_code_item scodeItem ON idrl.fd_update_type = scodeItem.fd_value"
	+" LEFT JOIN system_code smcode ON smcode.fd_id = scodeItem.fd_code_id"
	+" LEFT JOIN system_code_item item ON ac.fd_grade_type = item.fd_value"
	+" LEFT JOIN system_code scode ON scode.fd_id = item.fd_code_id"
	+" LEFT JOIN system_code_item codeItem ON ac.fd_class_no = codeItem.fd_value"
	+" LEFT JOIN system_code syscode ON syscode.fd_id = codeItem.fd_code_id"
	+" WHERE"
	+" sc.fd_code = 'report_type'"
	+" AND scode.fd_code = 'grade_type'"
	+" AND syscode.fd_code = 'class_no'"
	+" AND smcode.fd_code = 'report_type'"
	+" AND idr.fd_id = ?";
	
	db.query(getIepDiagnoseDetailSql, [iepDiagnoseId], function (err, results, fields) {
	callback && callback(err,results,fields);
	})
}


/**
 * 删除教育诊断与教育诊断日志
 * @param {*回调函数} callback 
 */
const deleteIepDiagonseAndLog=async(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,callback)=>{
    let DBConn=new transDb.DBUnity(await transDb.getConnection());
    await DBConn.beginTransaction();
    console.log("--------------------------------------------");
	var operaterIp=getClientIp(req);
    try{
        //执行语句
        let deleteIepDiagonseResult=await deleteIepDiagnose(DBConn,iepDiagnoseId,iepDiagnose);
        //执行结果
        if(!deleteIepDiagonseResult.success){
          throw new Error("删除教育诊断执行错误");
        }
		var iepDiagnoseLogId = primaryKeyUtils.generatePrimaryKey();
        var iepDiagnoseLog={
			"reportId":iepDiagnoseId,
			"reportCode":iepDiagnose.code,
			"operaterId":opreateUserId,
			"operateAccount":operateAccount,
			"operateIp":operaterIp,
			"operateType":'删除'
		}
        let insertIepDiagonseLogResult=await iepDiagnoseLogDao.insertIepDiagonseLog(DBConn,iepDiagnoseLogId,iepDiagnoseLog);
        if(!insertIepDiagonseLogResult.success){
          throw new Error("插入教育诊断日志执行错误");
        }
        //提交事务并释放连接
        DBConn.commit()
        callback(null,[deleteIepDiagonseResult.data],'删除教育诊断信息成功');
    }catch(e){
        console.log("--------------------捕获异常")
        DBConn.rollback()
		console.log("修改教育诊断信息出错:" + e)
		callback("修改教育诊断信息出错:" + e, null,'删除教育诊断信息失败');
    }
}

  /**
 * 更新教育模块信息
 * @param {模块Id} schoolId 
 * @param {模块更新信息} school 
 * @param {*} callback 
 */
function updateIepDiagonse(dbConn,iepDiagnoseId,iepDiagnose,callback){
	var updateDate = new Date();//修改时间
	var updateIepDiagonseSql = 'update iep_diagnose_report set '
	+' fd_code= ?'
	+',fd_student_id= ?'
	+',fd_student_idcard= ?'
	+',fd_report_type = ?'
	+',fd_report_time= ?'
	+',fd_evaluation_results= ?'
	+',fd_improve_items= ?'
	+',fd_update_time= ?'
	+',fd_state= ?'
	+',fd_remark= ?'
	+' where fd_id = ?';
	var updateIepDiagonseData = [
	 iepDiagnose.code || ''
    ,iepDiagnose.studentId - 0 || 0
	,iepDiagnose.idCard || ''
	,iepDiagnose.reportType -0 || 0
	,(iepDiagnose.reportTime || '') == '' ? null : iepDiagnose.reportTime
	,iepDiagnose.evaluationResults || ''
	,iepDiagnose.improveItems || ''
	,updateDate
	,1
	,iepDiagnose.remark||''
	,iepDiagnoseId
  ];
	if(dbConn==null){
		db.query(updateIepDiagonseSql, updateIepDiagonseData, function (err, results, fields) {
				callback && callback(err,results,fields);
		});
	}else{
		return dbConn.query(updateIepDiagonseSql,updateIepDiagonseData);
	} 
}



/**
 * 修改教育诊断与教育诊断日志
 * @param {*回调函数} callback 
 */
const updateIepDiagonseAndLog=async(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,callback)=>{
    let DBConn=new transDb.DBUnity(await transDb.getConnection());
    await DBConn.beginTransaction();
    console.log("--------------------------------------------");
	var operaterIp=getClientIp(req);
    try{
        //执行语句
        let updateIepDiagonseResult=await updateIepDiagonse(DBConn,iepDiagnoseId,iepDiagnose);
        //执行结果
        if(!updateIepDiagonseResult.success){
          throw new Error("修改教育诊断执行错误");
        }
		var iepDiagnoseLogId = primaryKeyUtils.generatePrimaryKey();
        var iepDiagnoseLog={
			"reportId":iepDiagnoseId,
			"reportCode":iepDiagnose.code,
			"operaterId":opreateUserId,
			"operateAccount":operateAccount,
			"operateIp":operaterIp,
			"operateType":'修改',
			"updateType" :iepDiagnose.reportType,
			"updateValue" :iepDiagnose.evaluationResults
		}
		
        let insertIepDiagonseLogResult=await iepDiagnoseLogDao.insertIepDiagonseLog(DBConn,iepDiagnoseLogId,iepDiagnoseLog);
        if(!insertIepDiagonseLogResult.success){
          throw new Error("插入教育诊断日志执行错误");
        }
        //提交事务并释放连接
        DBConn.commit()
        callback(null,[updateIepDiagonseResult.data]);
    }catch(e){
        console.log("--------------------捕获异常")
        DBConn.rollback()
		console.log("程序执行出错:"+e)
        callback("程序执行出错:"+e,null);
    }
}



function getClientIp(req) {
    var ipAddress = req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.headers['x-forwarded-for'] ||
    req.connection.socket.remoteAddress;
    if (ipAddress.indexOf('::ffff:') !== -1) {
        ipAddress = ipAddress.substring(7);
    }
    return ipAddress;
};

/**
 * 插入教育诊断与教育诊断日志
 * @param {*回调函数} callback 
 */
const insertIepDiagonseAndLog=async(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,callback)=>{
    let DBConn=new transDb.DBUnity(await transDb.getConnection());
    await DBConn.beginTransaction();
    console.log("--------------------------------------------");
	var operaterIp=getClientIp(req);
    try{
        //执行语句
        let insertIepDiagonseResult=await insertIepDiagonse(DBConn,iepDiagnoseId,iepDiagnose);
        //执行结果
        if(!insertIepDiagonseResult.success){
          throw new Error("插入教育诊断执行错误");
        }
		var iepDiagnoseLogId = primaryKeyUtils.generatePrimaryKey();
        var iepDiagnoseLog={
			"reportId":iepDiagnoseId,
			"reportCode":iepDiagnose.code,
			"operaterId":opreateUserId,
			"operateAccount":operateAccount,
			"operateIp":operaterIp,
			"operateType":'新增',
			"updateType" :iepDiagnose.reportType,
			"updateValue" :iepDiagnose.improveItems
		}
		
        let insertIepDiagonseLogResult=await iepDiagnoseLogDao.insertIepDiagonseLog(DBConn,iepDiagnoseLogId,iepDiagnoseLog);
        if(!insertIepDiagonseLogResult.success){
          throw new Error("插入教育诊断日志执行错误");
        }
        //提交事务并释放连接
        DBConn.commit()
        callback(null,[insertIepDiagonseResult.data]);
    }catch(e){
        console.log("--------------------捕获异常")
        DBConn.rollback()
		console.log("程序执行出错:"+e)
        callback("程序执行出错:"+e,null);
    }
}

module.exports = {
    selectIepDiagonseList:selectIepDiagonseList,
	insertIepDiagonseAndLog:insertIepDiagonseAndLog,
	updateIepDiagonse:updateIepDiagonse,
	updateIepDiagonseAndLog:updateIepDiagonseAndLog,
	deleteIepDiagonseAndLog:deleteIepDiagonseAndLog,
	iepDiagnoseDetail:iepDiagnoseDetail
}