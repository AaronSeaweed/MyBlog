var express = require('express');
var router = express.Router();
var db = require("../config/db");
var token = require("./set_token");
/**
 * 获取表情
 */
router.post("/getPictureAndEmj",function(req,res,next){
	var pictype = req.body.pictype;
	var pageNo = req.body.pageNo;
	var pageSize = req.body.pageSize;
	var pagestart = (pageNo-1)*pageSize;
    db.query("select A.*,(select count(*) from picandemj) count,GROUP_CONCAT(B.userid) as likeuserid from picandemj A LEFT OUTER JOIN emj_likes B ON A.id=B.emjid where A.picturetype = "+pictype+" GROUP BY A.id limit "+pagestart+", "+pageSize+"",function(error,rows){
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
 * 设置表情show值
 */
router.post("/setEmjshow",function(req,res,next){
	var emjid = req.body.emjid;
	var settype = req.body.settype;
	var showvalue = req.body.showvalue;
	var tokenstr = req.body.token;
	if(settype==0){
		sql = "update picandemj set showvalue = "+ Number(showvalue+1)+" where id ="+emjid;
	}else{
		sql = "update picandemj set showvalue = "+ Number(showvalue-1)+" where id ="+emjid;
	}
	if(tokenstr==token){
		db.query(sql,function(error,rows){
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
	}else{
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});

/**
*记录用户点show的表情
*/
router.post("/likeEmj",function(req,res){
    var emjid=req.body.emjid;
    var likeuserid=req.body.likeuserid;
	var settype=req.body.settype;
	var tokenstr=req.body.token;
	if(settype){
		sql = "delete from emj_likes where emjid="+emjid+" and userid="+likeuserid+""
	}else{
		sql = "INSERT into emj_likes (emjid,userid) values ("+emjid+","+likeuserid+")"
	}
	if(tokenstr==token){
		db.query(sql,function(error,rows){
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
	}else{
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
module.exports = router