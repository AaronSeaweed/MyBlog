
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
    var selsql="select *from useraddress where usestatus = 1";
    if(type){
        selsql="select *from useraddress";
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
 * 修改收货人信息
 */
router.post("/setuserinfo",function(req,res,next){
    var selsql="UPDATE useraddress set usestatus=0 where usestatus = 1";
    let promise = new Promise((resolve, reject) =>{
        db.query(selsql,function(error,rows){
            if (error) {
                var result = {
                    "status": "500",
                    "message": "服务器错误"
                }
                reject(res.jsonp(result));
            }
            else{
                var result = {
                    "status": "200",
                    "message": "success",
                    data:rows
                }
                resolve(req)
            }
        });
    });
    promise.then(function(req) {
        let username=req.body.username;
        let Telphone=req.body.Telphone;
        let province=req.body.province;
        let city=req.body.city;
        let Area=req.body.Area;
        let detailaddress=req.body.detailaddress;
        let usestatus=req.body.usestatus;
        let id=req.body.id;
        var selsql="UPDATE useraddress set username='"+username+"',Telphone='"+Telphone+"',province='"+province+"',city='"+city+"',Area='"+Area+"',detailaddress='"+detailaddress+"',usestatus="+usestatus+" where id = "+id+"";
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
    },function(){
        return res.jsonp(req);
    });
});
module.exports = router