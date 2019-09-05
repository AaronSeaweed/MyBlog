var dbHelpers = require('./Transaction_dbhelper');
exports.To_dbHelper=function (param,cb) {
    var sqlParamsEntity = [];//装载所有待执行的SQL和数据
    /****解析map里面不同的SQL并匹配对应的占位数据***/
    for(var column in param){
        /***第一层取出，map{map{}}***/
        var keyName =[];
        for(var columns in param[column]){//第二层map为{xx:[],xx:[]}
            keyName.push(columns);
        }
        for(var i in param[column][keyName[0]]){
            //console.log('sql====='+param[column][keyName[0]][i]);
            //console.log('whereParam====='+param[column][keyName[1]][i]);
            sqlParamsEntity.push(dbHelpers._getNewSqlParamEntity(param[column][keyName[0]][i],param[column][keyName[1]][i]));
        }
    }
    dbHelpers.execTrans(sqlParamsEntity, function (err, info) {
        if (err) {
            console.error("事务执行失败" + err);
            cb(err, '失败')
        } else {
            cb(null, '成功')
        }
    });
};
