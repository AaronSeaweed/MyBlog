var express = require('express');
var router = express.Router();
var db = require("../config/db");

/**
 * 获取网站公告列表
 */
router.post("/getAncementList",function(req,res,next){
    db.query("select *from ancement",function(error,rows){
        if (error) {
            var result = {
                "status": "500",
                "message": "服务器错误"
            }
            return res.jsonp(result);
        }
        else{
            var result = {
                "status": "200",
                "message": "success",
                data:rows
            }
            return res.jsonp(result);
        }
    });
});
/**
 * 获取网站公告内容
 */
router.post("/getAncementCent",function(req,res,next){
	var id = req.body.id;
    db.query("select *from ancement where id ="+id+"",function(error,rows){
        if (error) {
            var result = {
                "status": "500",
                "message": "服务器错误"
            }
            return res.jsonp(result);
        }
        else{
            var result = {
                "status": "200",
                "message": "success",
                data:rows
            }
            return res.jsonp(result);
        }
    });
});
module.exports = router