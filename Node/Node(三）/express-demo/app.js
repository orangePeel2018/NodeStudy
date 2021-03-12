var express=require('express')

var app=express();
var fs = require('fs');
var xlsx = require('node-xlsx');
var path = require('path');
var uuid = require('node-uuid');
var formidable = require('formidable');
var classDao = require('./classDao.js');
var userDao = require('./userDao.js');
var codeDao = require('./codeDao.js');
var iepDiagnoseDao = require('./iepDiagnoseDao.js');
var iepDiagnoseLogDao = require('./iepDiagnoseLogDao.js');
var systemModuleDao = require('./systemModuleDao');
var semesterCalendarDao = require('./semesterCalendarDao.js');
var primaryKeyUtils = require('./primaryKeyUtils');
var courseDao = require('./subjectCourseDao');
var async = require('async');
var moment = require('moment');
var path=require('path')
var commOpreate = require('./commonOpreateUtils')
var token=require('./tokenValidate.js')
var yearSummaryDao = require('./yearSummaryDao')

var bodyParser = require('body-parser')

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
/* *********************************************** */

/* Get方法  */
/**
 * 学年总结列表
 */
app.get('/yearSmmaryList', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        console.log("开始调用yearSmmaryList请求参数：" + JSON.stringify(req.query));
        var page = req.query.page; //请求的页数
        var perpage = req.query.perpage;////每页的数量

        if (perpage) {
          perpage = parseInt(perpage);
        } else {
          perpage = 10;
        }
        if (page) {
          page = parseInt(page);
        } else {
          var returnJson = { "code": 1, "data": {}, "error": '缺少当前页数' };
          res.status(200).json(returnJson);
          return;
        }
        yearSummaryDao.selectYearSmmaryList(req.query, function (err, results, fields, total) {
          var yearSmmaryJson = JSON.parse(JSON.stringify(results));
          console.log("yearSmmaryJson:" + yearSmmaryJson);
          var returnJson = { "code": 0, "data": { datas: results, meta: { page: page, perpage: perpage, total: total, sort: {} } }, "error": '' };
          console.log(returnJson);
          res.status(200).json(returnJson);
        });
      }
    });
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.info("查询学年总结分页错误：" + error.message);
    log.error("查询学年总结分页错误：" + error.message);
  }
});


/**
 * 根据Id查询学年总结详情
 */
app.get('/yearSmmaryDetail/:iepYearSummaryId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var iepYearSummaryId = req.params.iepYearSummaryId;
        yearSummaryDao.yearSummaryDetail(iepYearSummaryId, function (err, results, fields) {
          var returnJson = {};
          if (results.length == 0) {
            returnJson = { "code": 1, "data": {}, "error": '未找到对应ID学期总结！' };
            console.log(returnJson);
            res.status(200).json(returnJson);
            return
          }
          var yearSummaryJson = JSON.parse(JSON.stringify(results[0]));
          console.log("yearSummaryJson:" + yearSummaryJson);
          returnJson = { "code": 0, "data": yearSummaryJson, "error": '' };
          console.log(returnJson);
          res.status(200).json(returnJson);
        });
      }
    });
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
  }
});

/**
 * 新增学年总结
 */
app.post('/insertYearSummary', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit, opreateUserId) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var yearSummary = req.body;
        console.log("请求新增学年总结数据接口,请求参数为: " + JSON.stringify(yearSummary));
        if (!yearSummary || JSON.stringify(yearSummary) == "{}") {
          var returnJson = { "code": 1, "data": {}, "error": "新增学年总结信息不能为空" };
          console.log(returnJson);
          res.status(200).json(returnJson);
          return;
        }
        var yearSummaryId = yearSummary.id - 0 || 0;
        if (yearSummaryId == 0 || yearSummaryId == null || yearSummaryId == "") {
          yearSummaryId = primaryKeyUtils.generatePrimaryKey();//统一生产主键
        }
        var logParam = { "operateUserId": opreateUserId, "operateModule": "学年总结", "operateType": "新增", "operateObjectId": yearSummaryId, "operateObjectCode": "", "operateObjectName": "" };
        commOpreate.insertAndUpdate(logParam, yearSummary, req, function (yearSummaryId, yearSummary) {
          yearSummaryDao.insertYearSummary(yearSummaryId, yearSummary, function () {
            var returnJson = { "code": 0, "data": { "id": yearSummaryId }, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          })
        })
      }
    })
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
  }
});

/* 修改学期总结Put方法*/
app.put('/updateYearSummary/:iepYearSummaryId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit, opreateUserId) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var yearSummary = req.body;
        console.log("请求修改学年总结数据接口,请求参数为: " + JSON.stringify(yearSummary));
        if (!yearSummary || JSON.stringify(yearSummary) == "{}") {
          var returnJson = { "code": 1, "data": {}, "error": "修改学年总结不能为空" };
          console.log(returnJson);
          res.status(200).json(returnJson);
          return;

        }
        var iepYearSummaryId = req.params.iepYearSummaryId;
        console.log("iepYearSummaryId:" + iepYearSummaryId);
        var logParam = { "operateUserId": opreateUserId, "operateModule": "学年总结", "operateType": "修改", "operateObjectId": iepYearSummaryId, "operateObjectCode": "", "operateObjectName": "" };
        commOpreate.insertAndUpdate(logParam, yearSummary, req, function (iepYearSummaryId, yearSummary) {
          yearSummaryDao.updateYearSummary(iepYearSummaryId, yearSummary, function () {
            var returnJson = { "code": 0, "data": { "id": iepYearSummaryId }, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          })
        })
      }
    })
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
  }
});

/* 删除学期总结Put方法*/
app.delete('/delYearSummary/:iepYearSummaryId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit, opreateUserId) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var yearSummary =req.params;
        console.log("请求删除学年总结数据接口,请求参数为: " + JSON.stringify(yearSummary));
        if (!yearSummary || JSON.stringify(yearSummary) == "{}") {
          var returnJson = { "code": 1, "data": {}, "error": "学年总结信息不能为空" };
          console.log(returnJson);
          res.status(200).json(returnJson);
          return;
        }
        var iepYearSummaryId = req.params.iepYearSummaryId;
        console.log("iepYearSummaryId:" + iepYearSummaryId);
        var logParam = { "operateUserId": opreateUserId, "operateModule": "学年总结", "operateType": "删除", "operateObjectId": iepYearSummaryId, "operateObjectCode": "", "operateObjectName": "" };
        console.log("logParam: " + logParam);
        commOpreate.insertAndUpdate(logParam, yearSummary, req, function (iepYearSummaryId, yearSummary) {
          yearSummaryDao.deleteYearSummary(iepYearSummaryId, yearSummary, function () {
            var returnJson = { "code": 0, "data": {}, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          })
        })
      }
    })
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
  }
});

/* ******************************************** */
app.get('/iepDiagnose/:iepDiagnoseId', function (req, res, next) { 
  try {
    token.tokenIsExit(req, function(isExit){
      if(!isExit){
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      }else{
        var iepDiagnoseId =req.params.iepDiagnoseId;
        iepDiagnoseDao.iepDiagnoseDetail(iepDiagnoseId,function(err, results, fields){
          var returnJson ={};
          if(results.length==0){
            returnJson = { "code":1, "data":{}, "error": '未找到对应'+iepDiagnoseId+'模块！' };
            console.log(returnJson);
            res.status(200).json(returnJson);
            return 
          }
          var iepDiagnoseDetailJson =JSON.parse(JSON.stringify(results)); 
          console.log("iepDiagnoseDetailJson:"+iepDiagnoseDetailJson);
          returnJson = { "code": 0, "data": iepDiagnoseDetailJson, "error": '' };
          console.log(returnJson);
          res.status(200).json(returnJson);       
        });
      }
    });
  }catch (error) {
    var returnJson = {"code": 1, "data":{}, "error":error.message};
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.error("查询教育诊断详情错误："+error.message);
  }
});


app.delete('/delIepDiagnose/:iepDiagnoseId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit, opreateUserId) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var iepDiagnose = req.query;
        console.log("请求删除模块数据接口,请求参数为: " + JSON.stringify(module));
        if (!iepDiagnose || JSON.stringify(iepDiagnose) == "{}") {
          var returnJson = { "code": 1, "data": {}, "error": "模块信息不能为空" };
          console.log(returnJson);
          res.status(200).json(returnJson);
          return;
        }
        var iepDiagnoseId = req.params.iepDiagnoseId;
        console.log("iepDiagnoseId:" + iepDiagnoseId);
        var logParam = { "operateUserId": opreateUserId, "operateModule": "模块", "operateType": "删除", "operateObjectId": iepDiagnoseId};
        console.log("logParam: " + logParam);
        commOpreate.insertAndUpdate(logParam, iepDiagnose, req, function (iepDiagnoseId, iepDiagnose) {
          iepDiagnoseDao.deleteModule(iepDiagnoseId, iepDiagnose, function () {
            var returnJson = { "code": 0, "data": {iepDiagnoseId}, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          })
        })
      }
    })
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.error();
  }
});



/**
 * 获取教育诊断详情
 */
app.get('/:iepDiagnoseId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var iepDiagnoseId = req.params.iepDiagnoseId;
      
        console.log("开始调用iepDiagnoseDetail请求参数：" + JSON.stringify(req.query));
        iepDiagnoseDao.iepDiagnoseDetail(iepDiagnoseId,function(err, results, fields){
          var returnJson ={};
          if(results.length==0){
            returnJson = { "code":1, "data":{}, "error": '未找到对应ID的教育诊断记录！' };
            console.log(returnJson);
            res.status(200).json(returnJson);
            return 
          }
          var iepDiagnoseJson =JSON.parse(JSON.stringify(results[0])); 
          console.log("iepDiagnoseJson:"+iepDiagnoseJson);
          iepDiagnoseLogDao.iepDiagnosLogDetail(iepDiagnoseId,function(err, results, fields){
			console.log('results:'+results)
            iepDiagnoseJson.logNode = results;
            returnJson = { "code": 0, "data": iepDiagnoseJson, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);   
          });    
        });
      }
    });
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
 
  }
});
// app.get('/moduleList', function (req, res, next) { 
//     try {
//       token.tokenIsExit(req, function(isExit){
//         if(!isExit){
//           var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
//           res.status(200).json(returnJson);
//           return;
//         }else{
//           var page = req.query.page; //请求的页数
//           var perpage=req.query.perpage;////每页的数量
//           var name= req.query.name;
// 		  console.log('name'+name)
//           if (perpage) {
//             perpage = parseInt(perpage);
//           }else{
//             perpage=10;
//           }
//           if(page){
//             page = parseInt(page);
//           }else {
//             var returnJson = {"code": 1, "data":{}, "error":'缺少当前页数'};    
//             res.status(200).json(returnJson);
//             return;
//           }
//           systemModuleDao.selectModuleList(req.query,function(err, results, fields, total){
//             var systemModuleJson =JSON.parse(JSON.stringify(results)); 
//             console.log("systemModuleJson:"+systemModuleJson);   
//             var returnJson = { "code": 0, "data": {datas:results,meta:{page:page,perpage:perpage,total:total,sort:{}} },"error":''};
//             console.log(returnJson);
//             res.status(200).json(returnJson);
//           });
//         }
//       });
//     }catch (error) {
//       var returnJson = {"code": 1, "data":{}, "error":error.message};
//       console.log(returnJson);
//       res.status(200).json(returnJson);
//       console.error(error.message);
//       log.info("查询家校资源审核流程信息分页错误："+error.message);
//       log.error("查询家校资源审核流程信息分页错误："+error.message);
//     }
//   });

/*                          Get方法                             */
/**
 * 教育诊断列表
 */
app.get('/iepDiagnoseList', function (req, res, next) {
    try {
      token.tokenIsExit(req, function (isExit) {
        if (!isExit) {
          var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
          res.status(200).json(returnJson);
          return;
        } else {
          var page = req.query.page; //请求的页数
          var perpage = req.query.perpage;////每页的数量
  
          if (perpage) {
            perpage = parseInt(perpage);
          } else {
            perpage = 10;
          }
          if (page) {
            page = parseInt(page);
          } else {
            var returnJson = { "code": 1, "data": {}, "error": '缺少当前页数' };
            res.status(200).json(returnJson);
            return;
          }
          iepDiagnoseDao.selectIepDiagonseList(req.query, function (err, results, fields, total) {
            var iepDiagnoseJson = JSON.parse(JSON.stringify(results));
            console.log("iepDiagnoseJson:" + iepDiagnoseJson);
            var returnJson = { "code": 0, "data": { datas: results, meta: { page: page, perpage: perpage, total: total, sort: {} } }, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          });
        }
      });
    } catch (error) {
      var returnJson = { "code": 1, "data": {}, "error": error.message };
      console.log(returnJson);
      res.status(200).json(returnJson);
      console.error(error.message);
      log.info("查询教育诊断列表信息分页错误：" + error.message);
      log.error("查询教育诊断列表信息分页错误：" + error.message);
    }
  });



  /**
 * 新增学期
 */
app.post('/insetIepDiagnose', function (req, res, next) {
    try {
        token.tokenIsExit(req, function(isExit,opreateUserId,operateAccount){
            if(!isExit){
              var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
              res.status(200).json(returnJson);
              return;
            }else{
              var iepDiagnose = req.body;
              console.log("请求新增教育诊断数据接口,请求参数为: " +  JSON.stringify(iepDiagnose));
              if (!iepDiagnose || JSON.stringify(iepDiagnose)=="{}") {
                var returnJson = {"code": 1, "data":{}, "error":"教育诊断信息不能为空"};
                console.log(returnJson);
                res.status(200).json(returnJson);
                return;
              }
              var iepDiagnoseId = primaryKeyUtils.generatePrimaryKey();
              logParam = {"operateUserId":opreateUserId,"operateModule":"教育诊断","operateType":"新增","operateObjectId":iepDiagnoseId,"operateObjectCode":iepDiagnose.code};
                  commOpreate.insertAndUpdate(logParam,iepDiagnose,req,function(iepDiagnoseId,iepDiagnose){
                    iepDiagnoseDao.insertIepDiagonseAndLog(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,function(err,data){     
						if(err){
							var returnJson = {"code": 500, "data":data, "error": err };  
							console.log(returnJson);
							res.status(200).json(returnJson);
						}else{
							var returnJson = {"code": 0, "data":{"id":iepDiagnoseId}, "error":err};
							console.log(returnJson);
							res.status(200).json(returnJson);
						}	
					})
                })
            }
        })    
    }catch (error) {
        var returnJson = {"code": 1, "data":{}, "error":error.message};
        console.log(returnJson);
        res.status(200).json(returnJson);
        console.error(error.message);
        log.error();
    }
  });
  
  
  /**
   * 修改学期
   */
  app.put('/updateIepDiagnose', function (req, res, next) {
      try {
          token.tokenIsExit(req, function(isExit,opreateUserId,operateAccount){
              if(!isExit){
                var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
                res.status(200).json(returnJson);
                return;
              }else{
                var iepDiagnose = req.body;
                console.log("请求新增教育诊断数据接口,请求参数为: " +  JSON.stringify(iepDiagnose));
                if (!iepDiagnose || JSON.stringify(iepDiagnose)=="{}") {
                  var returnJson = {"code": 1, "data":{}, "error":"教育诊断信息不能为空"};
                  console.log(returnJson);
                  res.status(200).json(returnJson);
                  return;
                }
                var iepDiagnoseId = iepDiagnose.id;
                logParam = {"operateUserId":opreateUserId,"operateModule":"教育诊断","operateType":"修改","operateObjectId":iepDiagnoseId,"operateObjectCode":iepDiagnose.code};
                    commOpreate.insertAndUpdate(logParam,iepDiagnose,req,function(iepDiagnoseId,iepDiagnose){
                      iepDiagnoseDao.updateIepDiagonseAndLog(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,function(err,data,fields){     
  						if(err){
  							var returnJson = {"code": 500, "data":data, "error": err };  
  							console.log(returnJson);
  							res.status(200).json(returnJson);
  						}else{
  							var returnJson = {"code": 0, "data":data, "error":err};
  							console.log(returnJson);
  							res.status(200).json(returnJson);
  						}	
  					})
                  })
              }
          })    
      }catch (error) {
          var returnJson = {"code": 1, "data":{}, "error":error.message};
          console.log(returnJson);
          res.status(200).json(returnJson);
          console.error(error.message);
          log.error();
      }
    });
	
	
	
app.delete('/deleteIepDiagnose', function (req, res, next) {
	try {
		token.tokenIsExit(req, function(isExit,opreateUserId,operateAccount){
			if(!isExit){
			  var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
			  res.status(200).json(returnJson);
			  return;
			}else{
			  var iepDiagnose = req.body;
			  console.log("请求删除教育诊断数据接口,请求参数为: " +  JSON.stringify(iepDiagnose));
			  if (!iepDiagnose || JSON.stringify(iepDiagnose)=="{}") {
				var returnJson = {"code": 1, "data":{}, "error":"教育诊断信息不能为空"};
				console.log(returnJson);
				res.status(200).json(returnJson);
				return;
			  }
			  var iepDiagnoseId = iepDiagnose.id;
			  logParam = {"operateUserId":opreateUserId,"operateModule":"教育诊断","operateType":"删除","operateObjectId":iepDiagnoseId,"operateObjectCode":iepDiagnose.code};
				  commOpreate.insertAndUpdate(logParam,iepDiagnose,req,function(iepDiagnoseId,iepDiagnose){
					iepDiagnoseDao.deleteIepDiagonseAndLog(iepDiagnoseId,iepDiagnose,opreateUserId,operateAccount,req,function(err,data,message,fields){     
						if(err){
							var returnJson = {"code": 500, "data":data,"message":message, "error": err };  
							console.log(returnJson);
							res.status(200).json(returnJson);
						}else{
							var returnJson = {"code": 0, "data":{}, "message":message,"error":err};
							console.log(returnJson);
							res.status(200).json(returnJson);
						}	
					})
				})
			}
		})    
	}catch (error) {
		var returnJson = {"code": 1, "data":{}, "error":error.message};
		console.log(returnJson);
		res.status(200).json(returnJson);
		console.error(error.message);
		log.error();
	}
  });

// app.get('/selectOneLevelModule', function (req, res, next) {
//     try {
//       token.tokenIsExit(req, function (isExit) {
//         if (!isExit) {
//           var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
//           res.status(200).json(returnJson);
//           return;
//         } else {
//             systemModuleDao.selectOneLevelMoudle(function (err, results, fields) {
// 				var systemModuleJson = JSON.parse(JSON.stringify(results));
// 				console.log("systemModuleJson:" + systemModuleJson);
// 				returnJson = { "code": 0, "data": { "systemModuleJson": systemModuleJson }, "error": '' };
// 				console.log(returnJson);
// 				res.status(200).json(returnJson);
//           });
//         }
//       });
//     } catch (error) {
//       var returnJson = { "code": 1, "data": {}, "error": error.message };
//       console.log(returnJson);
//       res.status(200).json(returnJson);
//       console.error(error.message);
//       log.info("查询系统模块列表错误：" + error.message);
//       log.error("查询系统模块列表错误：" + error.message);
//     }
//   })
  

// app.get('/moduleList', function (req, res, next) {
//     try {
//       token.tokenIsExit(req, function (isExit) {
//         if (!isExit) {
//           var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
//           res.status(200).json(returnJson);
//           return;
//         } else {
//             systemModuleDao.selectModuleList(function (err, results, fields) {
//                 var systemModules = JSON.parse(JSON.stringify(results));
//                 console.log("systemModules:"+systemModules);   
//                 returnJson = { "code": 0, "data": { "systemModules": systemModuless }, "error": '' };
//                 console.log(returnJson);
//                 res.status(200).json(returnJson);			
//           });
//         }
//       });
//     } catch (error) {
//       var returnJson = { "code": 1, "data": {}, "error": error.message };
//       console.log(returnJson);
//       res.status(200).json(returnJson);
//       console.error(error.message);
//       log.info("查询系统模块列表错误：" + error.message);
//       log.error("查询系统模块列表错误：" + error.message);
//     }
//   })

// app.get('/selectModuleByRole', function (req, res, next) {
//     try {
//       token.tokenIsExit(req, function (isExit) {
//         if (!isExit) {
//           var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
//           res.status(200).json(returnJson);
//           return;
//         } else {
			
// 			var parentId=0;
//             systemModuleDao.selectModuleList(parentId,function (err, results, fields) {
//             var systemModules = JSON.parse(JSON.stringify(results));
// 			async.mapLimit(systemModules,1, function(systemModule, calDateListcallback) {
// 				parentId=systemModule.fd_id
// 				systemModuleDao.selectModuleList(parentId,function (err, results, fields) {
// 					var childrens= JSON.parse(JSON.stringify(results));
// 					systemModule.chilrens=childrens
// 					calDateListcallback(null,null);		
// 				})
// 			},function(err,results){
// 				console.log("systemModules:" + systemModules);	
// 				returnJson = { "code": 0, "data": { "systemModules": systemModules }, "error": '' };
// 				console.log(returnJson);
// 				res.status(200).json(returnJson);			
// 			})
//           });
//         }
//       });
//     } catch (error) {
//       var returnJson = { "code": 1, "data": {}, "error": error.message };
//       console.log(returnJson);
//       res.status(200).json(returnJson);
//       console.error(error.message);
//       log.info("查询系统模块列表错误：" + error.message);
//       log.error("查询系统模块列表错误：" + error.message);
//     }
//   })

                              /*                          Post方法                             */
/**
 * 新增学校
 */
/* app.post('/insertModule', function (req, res, next) {
    try {
        token.tokenIsExit(req, function(isExit,opreateUserId){
            if(!isExit){
              var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
              res.status(200).json(returnJson);
              return;
            }else{
              var module = req.body;
			  console.log('body:'+JSON.stringify(req.body))
			  console.log('module'+JSON.stringify(module))
              if (!module || JSON.stringify(module)=="{}") {
                var returnJson = {"code": 1, "data":{}, "error":"模块信息不能为空"};
                console.log(returnJson);
                res.status(200).json(returnJson);
                return;
              }
              var moduleId = module.id - 0 || 0;
              if(moduleId == 0 || moduleId == null || moduleId == ""){
                moduleId =primaryKeyUtils.generatePrimaryKey();//统一生产主键
              }
              var logParam = {"operateUserId":opreateUserId,"operateModule":"学校","operateType":"新增","operateObjectId":moduleId,"operateObjectCode":"","operateObjectName":module.name};
              commOpreate.insertAndUpdate(logParam,module,req,function(moduleId,module){systemModuleDao.insertModule(moduleId,module,function(){
                  var returnJson = {"code": 0, "data":{"id":moduleId}, "error": '' };
                  console.log(returnJson);
                  res.status(200).json(returnJson);
              })})
            }
        })    
    }catch (error) {
    var returnJson = {"code": 1, "data":{}, "error":error.message};
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.error();
  }
}); */


app.put('/updateModule/:moduleId', function (req, res, next) {
  try {
      token.tokenIsExit(req, function(isExit,opreateUserId){
          if(!isExit){
            var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
            res.status(200).json(returnJson);
            return;
          }else{
            var module = req.body;
  
            if (!module || JSON.stringify(module)=="{}") {
              var returnJson = {"code": 1, "data":{}, "error":"模块信息不能为空"};
              console.log(returnJson);
              res.status(200).json(returnJson);
              return;

            }
            var moduleId = req.params.moduleId;
            console.log("schoolId:"+moduleId);
            var logParam = {"operateUserId":opreateUserId,"operateModule":"模块","operateType":"修改","operateObjectId":moduleId,"operateObjectCode":"","operateObjectName":module.name};
            commOpreate.insertAndUpdate(logParam,module,req,function(moduleId,module){systemModuleDao.updateModule(moduleId,module,function(){
                var returnJson = {"code": 0, "data":{"id":moduleId}, "error": '' };
                console.log(returnJson);
                res.status(200).json(returnJson);
            })})
          }
      })    
  }catch (error) {
  var returnJson = {"code": 1, "data":{}, "error":error.message};
  console.log(returnJson);
  res.status(200).json(returnJson);
  console.error(error.message);
  log.error();
}
});

app.delete('/delModule/:moduleId', function (req, res, next) {
  try {
    token.tokenIsExit(req, function (isExit, opreateUserId) {
      if (!isExit) {
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      } else {
        var module = req.query;
        console.log("请求删除模块数据接口,请求参数为: " + JSON.stringify(module));
        if (!module || JSON.stringify(module) == "{}") {
          var returnJson = { "code": 1, "data": {}, "error": "模块信息不能为空" };
          console.log(returnJson);
          res.status(200).json(returnJson);
          return;
        }
        var moduleId = req.params.moduleId;
        console.log("moduleId:" + moduleId);
        var logParam = { "operateUserId": opreateUserId, "operateModule": "模块", "operateType": "删除", "operateObjectId": moduleId,"operateObjectName": module.name };
        console.log("logParam: " + logParam);
        commOpreate.insertAndUpdate(logParam, module, req, function (moduleId, module) {
          systemModuleDao.deleteModule(moduleId, module, function () {
            var returnJson = { "code": 0, "data": {moduleId}, "error": '' };
            console.log(returnJson);
            res.status(200).json(returnJson);
          })
        })
      }
    })
  } catch (error) {
    var returnJson = { "code": 1, "data": {}, "error": error.message };
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.error();
  }
});

/**
 * 根据Id查询学校详情
 */
app.get('/moduleDetail/:moduleId', function (req, res, next) { 
  try {
    token.tokenIsExit(req, function(isExit){
      if(!isExit){
        var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
        res.status(200).json(returnJson);
        return;
      }else{
        var moduleId =req.params.moduleId;
        systemModuleDao.moudleDetail(moduleId,function(err, results, fields){
          var returnJson ={};
          if(results.length==0){
            returnJson = { "code":1, "data":{}, "error": '未找到对应'+moduleId+'模块！' };
            console.log(returnJson);
            res.status(200).json(returnJson);
            return 
          }
          var moudleDetailJson =JSON.parse(JSON.stringify(results[0])); 
          console.log("moudleDetailJson:"+moudleDetailJson);
          returnJson = { "code": 0, "data": moudleDetailJson, "error": '' };
          console.log(returnJson);
          res.status(200).json(returnJson);       
        });
      }
    });
  }catch (error) {
    var returnJson = {"code": 1, "data":{}, "error":error.message};
    console.log(returnJson);
    res.status(200).json(returnJson);
    console.error(error.message);
    log.info("查询模块详情错误："+error.message);
    log.error("查询模块详情错误："+error.message);
  }
});


app.get('/',function(req,resp){
	resp.send('首页')
})

app.listen(3000,function(){
	console.log('打开')
})


app.get('/importExcel',function(req,resp){
    var excel=req.params
    console.log(excel)
    importExcel('./static/a.xlsx', function (err, data) {
        if(err){
            console.log(err);
        } else {
            console.log(data)
        }
    })
})

function importExcel(filePath, callback) {
    var data = [];
    var err = null;
    try {
        // Everything went fine
        var workbook = XLSX.readFile(filePath);　//整个　excel　文档
        var sheetNames = workbook.SheetNames; //获取所有工作薄名

        //console.log(sheetNames);

        //解析
        var sheet1 = workbook.Sheets[sheetNames[0]]; //根据工作薄名获取工作薄

        /*
         sheet1['!ref']　获取工作薄的有效范围　'A1:C20'
         XLSX.utils.decode_range 将有效范围转为　range对象
         range: {s: {r:0, c:0}, e: {r:10, 3}}
         */
        var range = XLSX.utils.decode_range(sheet1['!ref']);

        //循环获取单元格值
        for(var R = range.s.r; R <= range.e.r; ++R) {
            var row = [],flag = false;
            for(var C = range.s.c; C <= range.e.c; ++C) {
                var row_value = null;
                var cell_address = {c:C, r:R}; //获取单元格地址
                var cell = XLSX.utils.encode_cell(cell_address); //根据单元格地址获取单元格
                if(sheet1[cell]) //获取单元格值
                    row_value = sheet1[cell].v;
                else
                    row_value = '';
                row.push(row_value);
            }
            //判断整行是否都为空，是则去掉
            for(var i = 0; i < row.length; i++){
                if(row[i] != '') {
                    flag = true;
                    break;
                }
            }
            if(flag) data.push(row);
        }
    } catch (e) {
        err = '解析出错' + e.toString();
    }

    callback(err, data);
}


app.get('/exportExcel', function(req, res, next) {
	// write
	var data = [[1,2,3],[true],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
	const range0 = {s: {c: 0, r:0 },e: {c:1, r:0}}
	const options = {'!merges': [range0]}
	var buffer = xlsx.build([{name: "mySheetName", data: data}],options);
	fs.writeFileSync('b.xlsx', buffer, 'binary');
	
	res.send('export successfully!');

});

app.post('/import',function(req,res,next){
	var url = path.resolve();
	var storeFolder = url+ '/temp/importFolder/'+uuid.v1();
	uploadFile(req,storeFolder,function(err,filePath){
	  if(err){
		var returnJson = {"code": 1, "data":{}, "error":err.message};
		console.log(returnJson);
		res.status(200).json(returnJson);
		console.error(err.message);
		log.error();
	  }else{
		  console.log("-------------"+filePath)
		var obj = xlsx.parse(filePath,{
			type: "binary",
			cellDates: true,//设为true，将天数的时间戳转为时间格式

		});//配置excel文件的路径
		var excelObj=obj[0].data;//excelObj是excel文件里第一个sheet文档的数据，obj[i].data表示excel文件第i+1个sheet文档的全部内容
		deleteFolderRecursive(storeFolder);
		var excelObj= excelObj.slice(2);
		console.log(excelObj)
		for(var x in excelObj){
			if(excelObj[x].length!=8){
				returnJson = { "code":1, "data":{}, "error": '请检查是否有必填项漏填或者是否使用正确的模板来导入' };
				res.status(200).json(returnJson);
				return
			}
			
		}
		var index=2
		//通过Excel数据录入对应的课程表内容
		async.mapLimit(excelObj,1, function(rawData, calDateListcallback) {
			var importJson = {};
			var insertJson={};
			index++;
			for(var j=0;j<rawData.length;j++){
				importJson.semester = rawData[0];
				importJson.gradeName = rawData[1];
				importJson.className = rawData[2];
				insertJson.course=rawData[3]
				importJson.teacherName = rawData[4];
				importJson.teacherNo = rawData[5];
				importJson.weekName = rawData[6];
				insertJson.number = rawData[7];
				
			}
			console.log(JSON.stringify(importJson))
			//查询年级对应的codeValue
			codeDao.selectGradeCodeValue(importJson.gradeName,function(err, results, fields){
				var returnJson ={};
				if(results.length==0){
					returnJson = { "code":1, "data":{}, "error": '在第'+index+'行中未找到名称为（'+importJson.gradeName+'）的年级信息！' };
					calDateListcallback(returnJson,null);
					return 
				}
				insertJson.gradeNo=results[0].fd_value
				console.log(JSON.stringify(insertJson))
				
				//查询班级对应的codeValue
				codeDao.selectClassCodeValue(importJson.className,function(err, results, fields){
					var returnJson ={};
					if(results.length==0){
						returnJson = { "code":1, "data":{}, "error": '在第'+index+'行中未找到名称为（'+importJson.gradeName+'）的班级信息！' };
						calDateListcallback(returnJson,null);
						return 
					}
					insertJson.classNo=results[0].fd_value
					console.log(JSON.stringify(insertJson))

					//查询班级id
					classDao.selectClassByGradeNoAndClassNo(insertJson.classNo,insertJson.gradeNo,function(err, results, fields){
						var returnJson ={};
						if(results.length==0){
							returnJson = { "code":1, "data":{}, "error": '在第'+index+'行中未找到班级号为（'+insertJson.classNo+'）且年级号为（'+insertJson.gradeNo+'）的班级信息！' };
							calDateListcallback(returnJson,null);
							return 
						}
						insertJson.classId=JSON.stringify(results[0].fd_id) 
						console.log(JSON.stringify(insertJson))
						//查询星期对应的value
						codeDao.selectWeekCodeValue(importJson.weekName,function(err, results, fields){
							var returnJson ={};
							if(results.length==0){
								 returnJson = { "code": 1, "data": {}, "error": '在第' + index + '行中未找到名称为（' + importJson.weekName + '）的星期信息！PS:只支持周一到周五' };
								calDateListcallback(returnJson,null);
								return 
							}
							insertJson.week=results[0].fd_value
							console.log(JSON.stringify(insertJson))
							
							//查询学期id
							semesterCalendarDao.selectSemesterByName(importJson.semester,function(err, results, fields){
								var returnJson ={};
								if(results.length==0){
									returnJson = { "code":1, "data":{}, "error": '在第'+index+'行中未找到名称为（ '+importJson.semester+'）的学期信息！'};
									calDateListcallback(returnJson,null);
									return 
								}
								insertJson.sCalendarId=JSON.stringify(results[0].fd_id) 
								console.log(JSON.stringify(insertJson))
								
								 //查询老师id
								if (importJson.teacherNo != '' && importJson.teacherNo != undefined) {
								  userDao.selectUserByNameAndJobNumber(importJson.teacherName, importJson.teacherNo, function (err, results, fields) {
									var returnJson = {};
									if (results.length == 0) {
									  returnJson = { "code": 1, "data": {}, "error": '在第' + index + '行中未找到名称为（' + importJson.teacherName + '）且教师号为（' + importJson.teacherNo + '）的老师信息！' };
									  calDateListcallback(returnJson, null);
									  return
									}
									insertJson.teacherName= importJson.teacherName
									insertJson.cTeacherId = JSON.stringify(results[0].fd_id)
									console.log(JSON.stringify(insertJson))
									calDateListcallback(null, insertJson)
								  })
								} else {
								  userDao.selectUserByName(importJson.teacherName, function (err, results, fields) {
									var returnJson = {};
									if (results.length == 0) {
									  returnJson = { "code": 1, "data": {}, "error": '在第' + index + '行中未找到名称为（' + importJson.teacherName + '）的老师信息！' };
									  calDateListcallback(returnJson, null);
									  return
									}
									insertJson.teacherName= importJson.teacherName
									insertJson.cTeacherId = JSON.stringify(results[0].fd_id)
									console.log(JSON.stringify(insertJson))
									calDateListcallback(null, insertJson)
								  })
								}
							  })
							})
						  })
						})
					  })
		},function(err,insertJsons) {
			if(err){
				console.log(err)
				res.status(200).json(err);
			}else{
				//插入操作
				async.mapLimit(insertJsons, 1, function (insertJson, calInsertListcallback) {
				  //检查是否存在
				  var courseId = primaryKeyUtils.generatePrimaryKey();
				  console.log(insertJson)
				  courseDao.getNameExist(courseId, insertJson, function (err, results, fields) {
					if (results != null && results.length > 0) {
					  var returnJson = { "code": 1, "data": {}, "error": '在第' + index + '行中课程（' + insertJson.course + '）或教师（' + insertJson.teacherName + '）时间冲突'};
					  calInsertListcallback(returnJson, null);
					  return;
					}
					courseDao.insertCourse(courseId, insertJson, function (err, results, fields) {
					  returnJson = { "code": 0, "data": '导入成功', "error": '' };
					  calInsertListcallback(err, returnJson)
					})
				  })
				},function(err,results){
					if(err){
						 returnJson = { "code": 1, "data": {}, "error":err.error+',在第' + index + '行之前的数据都已经插入,在第' + index + '行开始往后的没有进行插入,请重新设置好第' + index + '行再继续插入后续的,已经插入的请勿重复插入' };
						 res.status(200).json(returnJson);
					}else{
						res.status(200).json(results);
					}
				})	
			}
		});
	  }
	});
})


/**
 * 上传文件
 * @param {} req 
 * @param {存储文件夹} storeFolder 
 * @param {目标文件地址} url 
 * @param {回调函数} callback 
 */
function uploadFile(req,storeFolder,callback){
  if (!fs.existsSync(storeFolder)) {
    console.log("文件夹不存在创建文件夹");
    makeDir(storeFolder);
  }
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = storeFolder;
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    console.log("files: "+JSON.stringify(files));
    if (err) {
      console.log(err);
      callback&&callback(err,"");
    } else {
      console.log("上传成功");
      var filename = path.basename(files.file.path);
      console.log("filename: "+ filename);
      var oldPath = storeFolder + "/" + filename;
      callback&&callback(err,oldPath);
    }
  });
}

/**
 * 创建多级目录
 * @param {} dirpath 
 */
function makeDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
      var pathtmp;
      dirpath.split("/").forEach(function(dirname) {
          if (pathtmp) {
              pathtmp = path.join(pathtmp, dirname);
          }
          else {
　　　　　　　　　 //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
              if(dirname){
                  pathtmp = dirname;
              }else{
                  pathtmp = "/"; 
              }
          }
          if (!fs.existsSync(pathtmp)) {
              if (!fs.mkdirSync(pathtmp)) {
                  return false;
              }
          }
      });
  }else{
      deleteFolderFiles(dirpath);
  }
  return true;
}

function deleteFolderRecursive(url) {
	console.log("url=:" + url)
  var files = [];
  /**
   * 判断给定的路径是否存在
   */
  if (fs.existsSync(url)) {
      /**
       * 返回文件和子目录的数组
       */
      files = fs.readdirSync(url);
      files.forEach(function (file, index) {

          var curPath = path.join(url, file);
          /**
           * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
           */
          if (fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);

          } else {
              fs.unlinkSync(curPath);
          }
      });
      /**
       * 清除文件夹
       */
      fs.rmdirSync(url);
  } else {
      console.log("给定的路径不存在，请给出正确的路径");
  }
}
