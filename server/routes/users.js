var express = require('express');
var router = express.Router();
var db = require("../config/db");
var token = require("./set_token");
/**
 * 登录
 */
router.post("/login",function(req,res,next){
    var phonenoemail=req.body.phonenoemail;
    var password=req.body.password;
    db.query("select * from user where phonenoemail='"+phonenoemail+"' and password="+password+"",function(error,rows){
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
                data:rows[0],
                token:token
            }
            if(rows[0]==""||rows[0]==null){
                result = {
                    "status": "401",
                    "message": "用户名或密码错误",
                    data:rows[0]
                }
            }
            return res.jsonp(result);
        }
    });
});

/**
 * 添加用户
 */
router.post("/add",function(req,res,next){
    var name=req.body.name;
    var phonenoemail=req.body.phonenoemail;
    var password=req.body.password;
    db.query("insert into user(username,password,phonenoemail) values('"+name+"','"+ password +"','"+phonenoemail+"')",function(error,rows){
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
                data:{name:name,password:password,phonenoemail:phonenoemail}
            }
            return res.jsonp(result);
        }
    });
});

/**
*获取用户信息
*/
router.post("/getuserinfo",function(req,res,next){
    var id=req.body.id;
	var tokenstr=req.body.token;
	if(tokenstr==token){
		db.query("select *from user where id='"+id+"'",function(error,rows){
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
		            data:rows[0]
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
*验证用户名是否存在
*/
router.post("/checkname",function(req,res,next){
	var username=req.body.username;
	db.query("select count(*) count from user where username='"+username+"'",function(error,rows){
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
	            data:rows[0]
	        }
	        return res.jsonp(result);
	    }
	});
});
/**
 * 删除用户
 */
router.get("/del/:id",function(req,res){
    var id = req.body.id;
    db.query("delete from user where id = " + id,function(err,rows){
        if(err){
            res.send("删除失败"+err);
        }else {
            res.redirect("/users");
        }
    });
});

/**
 * 修改
 */
router.post("/toUpdate",function(req,res,next){
    var id = req.body.id;
    var username = req.body.username;
    var callname = req.body.callname;
    var company = req.body.company;
    var selfintroduction = req.body.selfintroduction;
    var profes = req.body.profes;
    var homepage = req.body.homepage;
	var tokenstr=req.body.token;
    var sql = "UPDATE user set username ='"+username+"',callname='"+callname+"',company='"+company+"',selfintroduction='"+selfintroduction+"',profes='"+profes+"',homepage='"+homepage+"' where id = "+id+"";
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
					data:rows[0]
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
 * 修改密码
 * */
router.post("/updatepw",function(req,res,next){
    var password = req.body.password;
    var phonenoemail = req.body.phonenoemail;
    var sql = "update user set password = '"+ password +"',phonenoemail = '"+ phonenoemail +"'";
    db.query(sql,function(err,rows){
        if(err){
            res.send("修改失败 " + err);
        }else {
            res.redirect("/users");
        }
    });
});


/**
 * 查询
 */
router.post("/search",function(req,res,next){
    var name = req.body.s_name;
    var age = req.body.s_age;
    var sql = "select * from user";
    if(name){
        sql += " where name = '"+ name +"'";
    }
    db.query(sql,function(err,rows){
        if(err){
            res.send("查询失败: "+err);
        }else{
            res.render("users",{title:"用户列表",datas:rows,s_name:name,s_age:age});
        }
    });
})
module.exports = router;
