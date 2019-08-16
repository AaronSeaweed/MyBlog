var express = require('express');
var router = express.Router();
var db = require("../config/db");

/**
 * 获取表情
 */
router.post("/getPictureAndEmj",function(req,res,next){
	var pictype = req.body.pictype;
	var pageNo = req.body.pageNo;
	var pageSize = req.body.pageSize;
	var pagestart = (pageNo-1)*pageSize;
    db.query("select *,(select count(*) from picandemj) count from picandemj where picturetype = "+pictype+"  limit "+pagestart+", "+pageSize+"",function(error,rows){
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