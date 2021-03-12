var db = require('./db'); //引入数据库封装模块

/**
* 插入教育诊断日志
* @param {插入教育诊断的主键}} iepDiagnoseId 
* @param {插入教育诊断的数据}} iepDiagnose 
* @param {插入教育诊断的回调} callback 
*/
function insertIepDiagonseLog(dbConn, iepDiagnoseLogId, iepDiagnoseLog, callback) {
    var addUpdateDate = new Date();//注册时间
    var insertIepDiagonseLog = 'insert into iep_diagnose_report_log (fd_id'
        + ',fd_diagnose_report_id'
        + ',fd_diagnose_report_code'
        + ',fd_code'
        + ',fd_operater_id'
        + ',fd_operater_account'
        + ',fd_operate_time'
        + ',fd_operate_ip'
        + ',fd_operate_type'
        + ',fd_update_type'
        + ',fd_update_value'
        + ',fd_add_time'
        + ',fd_update_time'
        + ',fd_state'
        + ',fd_remark'
        + ')values('
        + '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'
        + ') ';
    var insertIepDiagonseLogData = [iepDiagnoseLogId
        , iepDiagnoseLog.reportId - 0 || 0
        , iepDiagnoseLog.reportCode || ''
        , iepDiagnoseLog.code || ''
        , iepDiagnoseLog.operaterId - 0 || 0
        , iepDiagnoseLog.operateAccount || ''
        , addUpdateDate
        , iepDiagnoseLog.operateIp || ''
        , iepDiagnoseLog.operateType || ''
        , iepDiagnoseLog.updateType - 0 || 0
        , iepDiagnoseLog.updateValue || ''
        , addUpdateDate
        , addUpdateDate
        , 1
        , iepDiagnoseLog.remark || ''
    ];
    if (dbConn == null) {
        db.query(insertIepDiagonseLog, insertIepDiagonseLogData, function (err, results, fields) {
            callback && callback(err, results, fields);
        });
    } else {
        return dbConn.query(insertIepDiagonseLog, insertIepDiagonseLogData);
    }
}


/**
 * 根据id查询教育诊断详情
 * @param {* 教育诊断主键} iepDiagnoseId 
 * @param {* 回调函数} callback 
 */
function iepDiagnosLogDetail(iepDiagnoseId, callback) {
    var getIepDiagnoseLogDetailSql = "select" 
	+" t.*,bu.fd_name as operatorName,codeItem.fd_name as reportType,DATE_FORMAT(t.fd_operate_time,'%Y-%m-%d %H:%i:%s') AS opertaeTime,DATE_FORMAT(t.fd_add_time,'%Y-%m-%d %H:%i:%s') AS createTime,DATE_FORMAT(t.fd_update_time,'%Y-%m-%d %H:%i:%s') AS updateTime" 
    +" from"
	+" iep_diagnose_report_log t"
    +" left join basic_user bu on bu.fd_id=t.fd_operater_id"
    +" LEFT JOIN system_code_item codeItem ON codeItem.fd_value = t.fd_operate_type"
    +" LEFT JOIN system_code code ON code.fd_id = codeItem.fd_code_id"
    +" Where code.fd_code='report_type'"
	+" And t.fd_diagnose_report_id=? order by t.fd_add_time desc,t.fd_update_time desc"
    db.query(getIepDiagnoseLogDetailSql, [iepDiagnoseId], function (err, results, fields) {
        callback && callback(err, results, fields);
    })
}



module.exports = {
    insertIepDiagonseLog: insertIepDiagonseLog,
	iepDiagnosLogDetail:iepDiagnosLogDetail
}