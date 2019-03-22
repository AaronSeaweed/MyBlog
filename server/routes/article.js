/**
 * Created by l9600946 on 2018/8/23.
 */
var express = require('express');
var router = express.Router();
var db = require("../config/db");
const chinaTime = require('china-time');
/**
 * 获取全部文章
 */
router.post("/getarticlelist",function(req,res,next){
    var contentid=req.body.contentid;
    var sqlyj="select A.*,C.typename from articlelist A LEFT OUTER JOIN contenttype C ON A.contenttype=C.typeid"
    if(contentid!=undefined){
        sqlyj="select A.*,C.typename from articlelist A LEFT OUTER JOIN contenttype C ON A.contenttype=C.typeid where article_id = "+contentid;
    }
    var week = "日一二三四五六".charAt(new Date().getDay());
    db.query(sqlyj,function(error,rows){
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
                "time":chinaTime('YYYY年MM月DD日')+"星期"+week,
                data:rows
            }
            return res.jsonp(result);
        }
    });
});

/**
 * 获取全部文章类型
 */
router.post("/getarticletype",function(req,res,next){
    db.query("select *from contenttype",function(error,rows){
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
 * 提交评论
 */
router.post("/commitcontent",function(req,res,next){
    var username=req.body.username;
    var content=req.body.content;
    var up=req.body.up;
    var date=req.body.date;
    var contentid=req.body.contentid;
    db.query("insert into commentlist values (null,'"+username+"','"+content+"',"+up+",'"+date+"',"+contentid+")",function(error,rows){
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
 * 提交评论回复
 */
router.post("/commitreply",function(req,res){
    var artid=req.body.artid;
    var replyusername=req.body.replyusername;
    var replycontent=req.body.replycontent;
    var replyup=req.body.replyup;
    var replydate=req.body.replydate;
    var replytype=req.body.replytype;
    db.query("insert into replyart(artid,replyusername,replycontent,replyup,replydate,replytype) values ("+artid+",'"+replyusername+"','"+replycontent+"',"+replyup+",'"+replydate+"',"+replytype+")",function(error,rows){
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
 * 获取评论列表
 */
router.post("/getcommentlist",function(req,res,next){
    var contentid=req.body.contentid;
    var selsql=`select A.*,B.photo,B.callname from commentlist A Left outer join user B on A.username=B.username where contentid=`+contentid+` Order By date Desc`
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
 * 获取评论回复列表
 */
router.post("/getreplylist",function(req,res,next){
    db.query("select A.*,B.photo,B.callname from replyart A Left outer join user B on A.replyusername=B.username Order By A.replydate Asc",function(error,rows){
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