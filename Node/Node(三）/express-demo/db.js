var mysql = require('mysql');
// var dbConfig = require('../config/db.config.example');
var async = require('async');
module.exports = {
    query : function(sql,params,callback){
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        console.log("sql: "+sql);
        console.log("params: "+params);
        const mysqlconfig={
          host: '192.168.0.110', 
          user: 'aixh', 
          password:'aixh123456', 
          database:'aixh', // 前面建的user表位于这个数据库中
          port: '3306'
        }
        var connection = mysql.createConnection(mysqlconfig);        
        connection.connect(function(err){
            if(err){
                console.log('数据库连接失败');
                throw err;
            }
         //开始数据操作
        connection.query( sql, params, function(err,results,fields ){
           if(err){
                console.log('数据操作失败');
                console.log('数据操作sql: '+sql);
                console.log("数据操作params: "+params);
                throw err;
            }
            console.log('执行数据库查询');
            async.series({
                function(callback){
                    //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                    connection.end(function(err){
                        console.log('关闭数据库连接！');
                        if(err){
                            console.log('关闭数据库连接失败！');
                            throw err;
                        }
                        callback(null, null);
                    });
                },
            },
            function(err) {        
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                console.log("执行数据库查询回调");
                callback && callback(err,results,fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
            });
           });
       });
    }
};