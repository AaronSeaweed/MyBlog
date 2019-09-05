/**
 * 数据库事务工具
 */
var mysql = require('mysql');
var SqlString = require('sqlstring');
var async = require("async");
var config = {
	 mysql: {
        // 默认配置
        default: {
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'test'
		}
    }
};
module.exports = {
    /**
     * 组装SQL_map
     * @param sql sql语句
     * @param params 数组，如果存在占位符，传入[xx,xx,xx],如果没有传入[]
     * @param callback
     * @returns {*}
     * @private
     */
    _getNewSqlParamEntity:function(sql, params, callback) {
        if (callback) {
            return callback(null, {
                sql: sql,
                params: params
            });
        }
        return {
            sql: sql,
            params: params
        };
    },
    /**
     * 事务管理
     * @param sqlparamsEntities SQL_map {sql： param：}
     * @param callback 回调
     */
    execTrans:function  (sqlparamsEntities, callback) {
        var db_config = config['mysql']['default'];
        db_config.queryFormat = function (query, values) {
            //console.log(query, values);
            if (query.indexOf('?') != -1) {
                return SqlString.format(query, values, db_config.stringifyObjects, db_config.timezone);
            }
            else {
                return query.replace(/\:(\w+)/g, function (txt, key) {
                    if (values && values.hasOwnProperty(key)) {
                        return this.escape(values[key]);
                    }
                    return txt;
                }.bind(this));
            }
        };
        var pool = mysql.createPool(db_config);
        pool.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null);
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    return callback(err, null);
                }
                //console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql_param) {
                    var temp = function (cb) {
                        var sql = sql_param.sql;
                        var param = sql_param.params;
                        connection.query(sql, param, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    return  callback(tErr,"事务失败，" + sql_param + "，ERROR：" + tErr);
                                });
                            } else {
                                return cb (null, 'ok');
                            }
                        })
                    };
                    funcAry.push(temp);
                });

                async.series(funcAry, function (err, result) {
                    if (err) {
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            connection.release();
                            return callback(err, null);
                        });
                    } else {
                        connection.commit(function (err, info) {
                            //console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    return callback(err, null);
                                });
                            } else {
                                connection.release();
                                return callback(null, info);
                            }
                        })
                    }
                })
            });
        });
    }
};
