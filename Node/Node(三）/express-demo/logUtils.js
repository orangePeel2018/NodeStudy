var express = require('express');
var uuid = require('node-uuid');
var router = express.Router();
const moment = require('moment');
var url = require('url');
var md5 = require("./md5");
var db = require('./db'); //引入数据库封装模块
const log = require('./log').logger;
var primaryKeyUtils = require('./primaryKeyUtils');
var token = require('./tokenValidate');


function insertLog(opreationLog,req){
    var addUpdateDate = new Date();//操作时间
    var operateIp = getClientIp(req);

    console.log("operateIp: "+operateIp);
    var logId = primaryKeyUtils.generatePrimaryKey();
    insertLogSql = 'insert into system_operation_log (fd_id'        
        +',fd_operate_user_id'
        +',fd_operate_time'
        +',fd_operate_ip'  
        +',fd_operate_module' 
        +',fd_operate_type'
        +',fd_operate_object_id' 
        +',fd_operate_object_code'
        +',fd_operate_object_name' 
        +',fd_state'
        +') values('
        +'?,?,?,?,?,?,?,?,?,?'
        +')' ;
    insertLogData = [logId
        ,opreationLog.operateUserId
        ,addUpdateDate  
        ,operateIp  
        ,opreationLog.operateModule
        ,opreationLog.operateType  
        ,opreationLog.operateObjectId
        ,opreationLog.operateObjectCode 
        ,opreationLog.operateObjectName 
        ,1];

    db.query(insertLogSql, insertLogData, function (err, results, fields) {
        console.log("插入系统日志...");
        console.log("err: "+err);
        console.log("results: "+results);
    });    
       
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

module.exports.insertLog = insertLog;
