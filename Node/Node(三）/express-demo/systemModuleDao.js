var db = require('./db'); //引入数据库封装模块

//查询菜单
function selectModuleList(query,callback){
	console.log('query:'+query)
  var page = query.page -0 || 0;
  var perpage = query.perpage -0 || 0;
  var queryCountSql="select count(*) as total FROM system_module  where 1=1  and fd_name like ? and fd_parent_id in "
  +" (select distinct smm.fd_id from system_module smm left join system_module smmm on smmm.fd_parent_id=smm.fd_id where smm.fd_name like ?)";  
  
  console.log("queryCountSql:" + queryCountSql);
  db.query(queryCountSql, ['%'+query.name+'%','%'+query.parentName+'%'], function (err, results, fields) { 
    var total=0;//总条数
    if(results){  
      total =results[0].total;       
    }  
    console.log("开始调用system_module请求参数："+results[0].total);
    //查询班级
    var selectModuleList = "select sm.*,smm.fd_name as fd_parent_name"
    +" from system_module sm"
    +" left join system_module smm"
    +" on smm.fd_id=sm.fd_parent_id where sm.fd_name like ? and smm.fd_name like ? limit "+(page-1)*perpage+","+perpage;
    //选择班级
    db.query(selectModuleList,['%'+query.name+'%','%'+query.parentName+'%'],function (err, results, fields) {
      callback && callback(err,results,fields,total);
    });
  });
}

//
//根据老师名称查询用户id
function selectOneLevelMoudle(callback){
    console.log("selectOneLevelMoudle: "+selectOneLevelMoudle);
    //查询班级
   var selectOneLevelMoudle = "select sm.* from system_module sm where sm.fd_parent_id is null"
    //选择班级
    db.query(selectOneLevelMoudle, [], function (err, results, fields) {
      callback && callback(err,results,fields);
    })
}



//查找一级目录
function selectModuleByRole(callback){
  console.log("selectModuleByRole: "+selectModuleByRole);
 var selectModuleByRole = "select sm.* from system_module sm where sm.fd_id in (select fd_)"
  db.query(selectModuleByRole, [], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

/**
 * 插入模块
 * @param {插入学校的数据}} school 
 * @param {插入学校的回调} callback 
 */
function insertModule(moduleId,module,callback){
	console.log(module)
    var addUpdateDate = new Date();//注册时间
    var insertModuleSql = 'insert into system_module (fd_id' 
      +',fd_parent_id' 
      +',fd_name'
      +',fd_icon'    
      +',fd_link_url' 
      +',fd_sequence' 
	  +',fd_state' 
	  +',fd_remark' 
      +')values('
      +'?,?,?,?,?,?,?,?'
      +') ';
    var insertModuleData = [moduleId
      ,module.parentId -0 || 0
      ,module.name || ''
	  ,module.icon || ''
      ,module.linkUrl ||''
      ,module.sequence-0 || 0
      ,module.state-0 || 0
      ,module.remark || ''
    ];
    db.query(insertModuleSql, insertModuleData, function (err, results, fields) {
      callback && callback(err,results,fields);
    });
  }




  /**
 * 更新模块信息
 * @param {模块Id} schoolId 
 * @param {模块更新信息} school 
 * @param {*} callback 
 */
function updateModule(moduleId,module,callback){
  var addUpdateDate = new Date();
  var updateModuleSql = 'update system_module set '
  +'fd_parent_id= ?'
  +',fd_name= ?'
  +',fd_icon= ?'
  +',fd_link_url = ?'
  +',fd_sequence= ?'
  +',fd_state= ?'
  +',fd_remark= ?'
  +'where fd_id = ?';

  var updateModuleData = [module.parentId -0 || 0
    ,module.name || ''
	,module.icon || ''
	,module.linkUrl ||''
	,module.sequence-0 || 0
	,module.state-0 || 0
	,module.remark || ''
    ,moduleId
  ];

  db.query(updateModuleSql, updateModuleData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}

/**
 * 删除学校
 * @param {学校Id} schoolId 
 * @param {} school 
 * @param {回调参数} callback 
 */
function deleteModule(moduleId,module,callback){
  var deleteModuleSql = 'delete from system_module WHERE fd_id=?';
  var deleteModuleData = [moduleId]
  db.query(deleteModuleSql, deleteModuleData, function (err, results, fields) {
    callback && callback(err,results,fields);
  });
}


function moudleDetail(moduleId,callback){
  //查询school 详情
  var getmoudleDetailSql = "select sm.* from system_module sm where sm.fd_id=?";
  //查询学校
  db.query(getmoudleDetailSql, [moduleId], function (err, results, fields) {
    callback && callback(err,results,fields);
  })
}

     


module.exports = {
	selectModuleList:selectModuleList,
	selectOneLevelMoudle:selectOneLevelMoudle,
	insertModule:insertModule,
	updateModule:updateModule,
	deleteModule:deleteModule,
	moudleDetail:moudleDetail
}
