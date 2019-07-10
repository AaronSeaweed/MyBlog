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
    var sqlyj="select A.*,B.typename,GROUP_CONCAT(C.likeuserid) as likeuserid from articlelist A LEFT OUTER JOIN contenttype B ON A.contenttype=B.typeid LEFT OUTER JOIN likes C ON A.article_id=C.articleid GROUP BY article_id"
    if(contentid!=undefined){
        sqlyj="select A.*,B.typename,GROUP_CONCAT(C.likeuserid) as likeuserid from articlelist A LEFT OUTER JOIN contenttype B ON A.contenttype=B.typeid LEFT OUTER JOIN likes C ON A.article_id=C.articleid where A.article_id = "+contentid+" GROUP BY article_id";
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
    var selsql=`select A.*,B.photo,B.callname,B.username as Uname from commentlist A Left outer join user B on A.username=B.id where contentid=`+contentid+` Order By date Desc`
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
    db.query("select A.*,B.photo,B.callname,B.username from replyart A Left outer join user B on A.replyusername=B.id Order By A.replydate Asc",function(error,rows){
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
*新增文章
*/
router.post("/addArticle",function(req,res){
    var title=req.body.title;
    var content=req.body.content;
    var datetime=chinaTime('YYYY-MM-DD HH:mm:ss');
    var contenttype=req.body.contenttype;
    var userid=req.body.userid;
	var coverimage=req.body.coverimage;
	var arttag=req.body.arttag;
    db.query("INSERT into articlelist (article_title,content,datetime,views,commentnum,hot,contenttype,recommend,userid,coverimage,arttag) values ('"+title+"','"+content+"','"+datetime+"',0,0,0,"+contenttype+",0,"+userid+",'"+coverimage+"','"+arttag+"')",function(error,rows){
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
 * 文章点赞次数修改
 */
router.post("/thumb-Up",function(req,res,next){
    var article_id = req.body.article_id;
    var commentnum = req.body.commentnum;
	var likedown = req.body.likedown;
	var sql = "";
	if(likedown){
		sql = "update articlelist set commentnum = "+Number(commentnum-1)+" where article_id="+article_id;
	}else{
		sql = "update articlelist set commentnum = "+Number(commentnum+1)+" where article_id="+article_id;
	}
	console.log(sql)
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
});
/**
*记录用户点赞的文章
*/
router.post("/likeRecording",function(req,res){
    var articleid=req.body.articleid;
    var likeuserid=req.body.likeuserid;
    db.query("INSERT into likes (articleid,likeuserid) values ("+articleid+","+likeuserid+")",function(error,rows){
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
*用户取消点赞的文章
*/
router.post("/cancelLikeRecording",function(req,res){
    var articleid=req.body.articleid;
    var likeuserid=req.body.likeuserid;
    db.query("delete from likes where articleid="+articleid+" and likeuserid="+likeuserid+"",function(error,rows){
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
*删除评论
*/
router.post("/delDiscuss",function(req,res){
    var id=req.body.id;
    var replytype=req.body.replytype;
	if(replytype==0){
		sql = "delete from commentlist where id = "+id;
	}else{
		sql = "delete from replyart where replyid = "+id;
	}
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
});
module.exports = router