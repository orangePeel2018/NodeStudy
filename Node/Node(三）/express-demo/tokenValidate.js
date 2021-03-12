var express = require('express');
var db = require('./db');
module.exports = {
    tokenIsExit : function(req,callback){
        var token = req.headers['authorization'];
        console.log("获取token:"+token);
        db.query('SELECT * FROM basic_user where fd_token = ? ', [token], function (err, results, fields) { //查列表
            console.log("results: "+JSON.stringify(results));
            results=JSON.parse(JSON.stringify(results)); 
            //console.log("results: "+results[0].fd_id);
            console.log(token);
            if (!results) {
                callback && callback(false,-1);
            } else if (results.length === 0) {
                callback && callback(false,-1);
            }else{
                callback && callback(true,results[0].fd_id,results[0].fd_role,results[0].fd_account);
            } 
        });
    }
};