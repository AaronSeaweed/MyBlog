
var express = require('express');
var router = express.Router();
var db = require("../config/db");


/**
 * 获取全部食物类型
 */
router.post("/getfoodtype",function(req,res,next){
    db.query("select *from menulist",function(error,rows){
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
 * 获取食物列表
 */
router.post("/getfood",function(req,res,next){
    var foodtypeid = req.body.foodtypeid;
    var selsql="select *from food where foodtypeid ="+foodtypeid
    if(foodtypeid===1){
        selsql="select *from food where eatnum>2"
    }
    db.query(selsql,function(error,rows){
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
 * 获取收货人信息
 */
router.post("/getuserinfo",function(req,res,next){
    let type=req.body.type;
    let addid=req.body.addid;
    var selsql="select *from useraddress where usestatus = 1";
    if(type){
        selsql="select *from useraddress";
    }else if(addid){
        selsql="select *from useraddress where id="+addid;
    }
    db.query(selsql,function(error,rows){
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
 * 设置收货人信息
 */
router.post("/setuserinfo",function(req,res,next){
    var selsql="UPDATE useraddress set usestatus=0 where usestatus = 1";
    db.query(selsql,function(error,rows){
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
 * 修改收货人信息
 */
router.post("/updateuserinfo",function(req,res,next){
    var selsql="UPDATE useraddress set username='"+req.body.username+"',Telphone='"+req.body.Telphone+"',province='"+req.body.province+"',city='"+req.body.city+"',Area='"+req.body.Area+"',detailaddress='"+req.body.detailaddress+"',usestatus="+req.body.usestatus+" where id = "+req.body.id+"";
    db.query(selsql,function(error,rows){
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
 * 新增收货人信息
 */
router.post("/adduserinfo",function(req,res,next){
    var selsql="INSERT into useraddress(username,Telphone,province,city,Area,detailaddress,addresstype,doorplate,usestatus) values ('"+req.body.username+"','"+req.body.Telphone+"','"+req.body.province+"','"+req.body.city+"','"+req.body.Area+"','"+req.body.detailaddress+"','"+req.body.addresstype+"','"+req.body.doorplate+"',0)";
    db.query(selsql,function(error,rows){
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
 * 删除收货人信息
 */
router.post("/deluserinfo",function(req,res,next){
    var selsql="DELETE from useraddress where id = "+req.body.id;
    db.query(selsql,function(error,rows){
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