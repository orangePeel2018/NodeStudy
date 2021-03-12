var express = require('express');
var logUtils = require('./logUtils');

module.exports = {
    insertAndUpdate : function (logParam,opreatParam,req,callback){
        logUtils.insertLog(logParam,req);
        callback&&callback(logParam.operateObjectId,opreatParam);
    }
}

