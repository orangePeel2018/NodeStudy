var express = require('express');
var router = express.Router();
var token = require('../utils/tokenValidate');
var systemModuleDao = require('../dao/systemModuleDao');

/*                          Get方法                             */
/**
 * 菜单列表
 */
// app.get('/moduleList', function (req, res, next) { 
//     try {
//       token.tokenIsExit(req, function(isExit){
//         if(!isExit){
//           var returnJson = { "code": 1, "data": {}, "error": 'token不存在,请先登录' };
//           res.status(200).json(returnJson);
//           return;
//         }else{
//           log.info("开始调用moduleList请求参数："+JSON.stringify(req.query));
//           console.log("开始调用moduleList请求参数："+JSON.stringify(req.query));
//           var page = req.query.page; //请求的页数
//           var perpage=req.query.perpage;////每页的数量
                 
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
            commOpreate.insertAndUpdate(logParam,module,req,function(moduleId,module){schoolDao.updateModule(schoolId,school,function(){
                var returnJson = {"code": 0, "data":{"id":schoolId}, "error": '' };
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

module.exports = router;
