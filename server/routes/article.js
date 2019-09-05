/**
 * Created by l9600946 on 2018/8/23.
 */
var express = require('express');
var router = express.Router();
var db = require("../config/db");
const chinaTime = require('china-time');
var token = require("./set_token");
var strTra = require("../config/Start_Transaction");
/**
 * 获取全部文章
 */
router.post("/getarticlelist", function(req, res, next) {
	var contentid = req.body.contentid;
	var sqlyj =
		"select A.*,B.typename,GROUP_CONCAT(C.likeuserid) as likeuserid,(select count(*) from artviewcount where artid=A.article_id) as artviewcount from articlelist A LEFT OUTER JOIN contenttype B ON A.contenttype=B.typeid LEFT OUTER JOIN art_likes C ON A.article_id=C.articleid GROUP BY article_id order by datetime desc"
	if (contentid != undefined) {
		sqlyj =
			"select A.*,B.typename,GROUP_CONCAT(C.likeuserid) as likeuserid,(select count(*) from artviewcount where artid=A.article_id) as artviewcount from articlelist A LEFT OUTER JOIN contenttype B ON A.contenttype=B.typeid LEFT OUTER JOIN art_likes C ON A.article_id=C.articleid where A.article_id = " +
			contentid + " GROUP BY article_id";
	}
	var week = "日一二三四五六".charAt(new Date().getDay());
	db.query(sqlyj, function(error, rows) {
		if (error) {
			var result = {
				"status": "500",
				"message": "服务器错误"
			}
			return res.jsonp(result);
		} else {
			var result = {
				"status": "200",
				"message": "success",
				"time": chinaTime('YYYY年MM月DD日') + "星期" + week,
				data: rows
			}
			return res.jsonp(result);
		}
	});
});

/**
 * 获取全部文章类型
 */
router.post("/getarticletype", function(req, res, next) {
	db.query("select *from contenttype", function(error, rows) {
		if (error) {
			var result = {
				"status": "500",
				"message": "服务器错误"
			}
			return res.jsonp(result);
		} else {
			var result = {
				"status": "200",
				"message": "success",
				data: rows
			}
			return res.jsonp(result);
		}
	});
});


/**
 * 提交评论/回复
 */
router.post("/commitcontent", function(req, res, next) {
	var username = req.body.username;//用户id
	var content = req.body.content;//评论内容.仅限评论和回复才有
	var up = req.body.up;
	var date = req.body.date;
	var contentid = req.body.contentid;
	var artid = req.body.artid;
	var index = req.body.index;
	var replytype = req.body.replytype;
	var type = req.body.type//通知类型   1、公告 2、提醒 3、私信,
	var action = req.body.action//1、点赞  2、评论 3、回复 ,
	var user_id = req.body.user_id//消息所属者，如post动态发布者
	var is_read = req.body.is_read//消息是否已读   0未读  1已读
	var nickname = req.body.nickname//发送者昵称
	var avatar_url = req.body.avatar_url//发送者头像
	var comment_id = req.body.comment_id//评论id  评论的时候存储
	var target_type = req.body.target_type//目标类型  1、文章 2、评论 3、回复
	var created_at = chinaTime('YYYY-MM-DD HH:mm:ss');//时间
	var tokenstr = req.body.token;
	if (tokenstr == token) {
			try{
				var comnum;
				var sql1 = []//执行的SQL
				var sql2 = []
				var sql1_param = []; //SQL中找占位符对应的数据集[ [占位数据，占位数据]， [占位数据，占位数据] ]
				var sql2_param = [];
				if(index==undefined){
					sql1.push('insert into commentlist (username,content,up,date,contentid) values (?,?,?,?,?)');
					sql1_param.push([username,content,up,date,contentid]);
				}else{
					sql1.push('insert into replyart(artid,replyusername,replycontent,replyup,replydate,replytype) values (?,?,?,?,?,?)');
					sql1_param.push([artid,username,content,up,date,replytype]);
				}
				sql2.push('insert into msg_notify(content,type,action,sender_id,user_id,is_read,created_at,nickname,avatar_url,comment_id,target_id,target_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
				sql2_param.push([content,type,action,username,user_id,is_read,created_at,nickname,avatar_url,comment_id,contentid,target_type]);
				var param = {sql1:{sql1:sql1,sql1_param},sql2:{sql2:sql2,sql2_param}};//封装成这样是为了module成循环解析
				strTra.To_dbHelper(param,function (err,data) {
					if(err){
						var result = {
							"status": "500",
							"message": err
						}
						return res.jsonp(result)
					}else{
						var result = {
							"status": "200",
							"message": "success",
							"data": data
						}
						return res.jsonp(result)
					}
				});
			}catch(err){
				 console.log(err);
			}
	} else {
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 * 提交评论回复
 */
router.post("/commitreply", function(req, res) {
	var artid = req.body.artid;
	var replyusername = req.body.replyusername;
	var replycontent = req.body.replycontent;
	var replyup = req.body.replyup;
	var replydate = req.body.replydate;
	var replytype = req.body.replytype;
	var tokenstr = req.body.token;
	if (tokenstr == token) {
		db.query("insert into replyart(artid,replyusername,replycontent,replyup,replydate,replytype) values (" + artid +
			",'" + replyusername + "','" + replycontent + "'," + replyup + ",'" + replydate + "'," + replytype + ")",
			function(error, rows) {
				if (error) {
					var result = {
						"status": "500",
						"message": "服务器错误"
					}
					return res.jsonp(result);
				} else {
					var result = {
						"status": "200",
						"message": "success",
						data: rows
					}
					return res.jsonp(result);
				}
			});
	} else {
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 * 获取评论列表
 */
router.post("/getcommentlist", function(req, res, next) {
	var contentid = req.body.contentid;
	//var selsql=`select A.*,B.photo,B.callname,B.username as Uname from commentlist A Left outer join user B on A.username=B.id where contentid=`+contentid+` Order By date Desc`
	var selsql =
		`select A.*,B.photo,B.callname,B.username as Uname,GROUP_CONCAT(C.likeuserid) as likeuserid from commentlist A 
				Left join user B on A.username=B.id 
				Left join comm_likes C on C.commentid=A.id 
				where contentid=` +
		contentid + ` 
				GROUP BY A.id Order By date Desc`
	db.query(selsql, function(error, rows) {
		if (error) {
			var result = {
				"status": "500",
				"message": "服务器错误"
			}
			return res.jsonp(result);
		} else {
			var result = {
				"status": "200",
				"message": "success",
				data: rows
			}
			return res.jsonp(result);
		}
	});
});
/**
 * 获取评论回复列表
 */
router.post("/getreplylist", function(req, res, next) {
	//select A.*,B.photo,B.callname,B.username from replyart A Left outer join user B on A.replyusername=B.id Order By A.replydate Asc
	db.query(
		`select A.*,B.photo,B.callname,B.username,GROUP_CONCAT(C.likeuserid) as likeuserid from replyart A 
			Left join user B on A.replyusername=B.id 
			Left join rep_likes C on C.replyid=A.replyid
			GROUP BY A.replyid
			Order By A.replydate Asc`,
		function(error, rows) {
			if (error) {
				var result = {
					"status": "500",
					"message": "服务器错误"
				}
				return res.jsonp(result);
			} else {
				var result = {
					"status": "200",
					"message": "success",
					data: rows
				}
				return res.jsonp(result);
			}
		});
});
/**
 *新增/修改文章
 */
router.post("/addArticle", function(req, res) {
	var title = req.body.title;
	var content = req.body.content;
	var datetime = chinaTime('YYYY-MM-DD HH:mm:ss');
	var contenttype = req.body.contenttype;
	var userid = req.body.userid;
	var coverimage = req.body.coverimage;
	var arttag = req.body.arttag;
	var optype = req.body.optype;
	var conid = req.body.conid;
	var tokenstr = req.body.token;
	content.replace(/'/g, "\\'");
	var opsql =
		"INSERT into articlelist (article_title,content,datetime,views,commentnum,hot,contenttype,recommend,userid,coverimage,arttag) values ('" +
		title + "','" + content + "','" + datetime + "',0,0,0," + contenttype + ",0," + userid + ",'" + coverimage + "','" +
		arttag + "')"
	if (optype == 1) {
		opsql = "update articlelist set article_title='" + title + "',content='" + content + "',contenttype=" + contenttype +
			",coverimage='" + coverimage + "',arttag='" + arttag + "' where article_id=" + conid + ""
	}
	if (tokenstr == token) {
		db.query(opsql, function(error, rows) {
			if (error) {
				var result = {
					"status": "500",
					"message": "服务器错误",
					"sql": opsql
				}
				return res.jsonp(result);
			} else {
				var result = {
					"status": "200",
					"message": "success",
					data: rows
				}
				return res.jsonp(result);
			}
		});
	} else {
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 * 文章点赞次数修改
 * 记录用户点赞的文章
 * 用户取消点赞的文章
 * **/
router.post('/Article_likes',async function (req,res) {
	var articleid = req.body.articleid;//文章id
	var likeuserid = req.body.likeuserid;//用户id
	var commentnum = req.body.commentnum;//当前点赞次数
	var likedown = req.body.likedown//true:取消点赞;false:点赞
	
	var content = req.body.content//评论内容.仅限评论和回复才有
	var type = req.body.type//通知类型   1、公告 2、提醒 3、私信,
	var action = req.body.action//1、点赞  2、评论 3、回复 ,
	var sender_id = req.body.sender_id//发送者id
	var user_id = req.body.user_id//消息所属者，如post动态发布者
	var is_read = req.body.is_read//消息是否已读   0未读  1已读
	var nickname = req.body.nickname//发送者昵称
	var avatar_url = req.body.avatar_url//发送者头像
	var comment_id = req.body.comment_id//评论id  评论的时候存储
	var target_id = req.body.target_id//目标id （文章id/评论id/回复id）
	var target_type = req.body.target_type//目标类型  1、文章 2、评论 3、回复
	var tokenstr = req.body.token;
	var created_at = chinaTime('YYYY-MM-DD HH:mm:ss');//创建时间
	if (tokenstr == token) {
		try{
			var comnum;
			var sql1 = []//执行的SQL
			var sql2 = []
			var sql3 = []
			var sql1_param = []; //SQL中找占位符对应的数据集[ [占位数据，占位数据]， [占位数据，占位数据] ]
			var sql2_param = [];
			var sql3_param = [];
			if(likedown){
				sql1.push('delete from art_likes where articleid=? and likeuserid=?');
				sql3.push('DELETE FROM msg_notify WHERE user_id = ? AND action =? and target_id=? and target_type = ?')
				sql3_param.push([user_id,action,target_id,target_type]);
				comnum=Number(commentnum - 1)
			}else{
				sql1.push('insert into art_likes (articleid,likeuserid) value(?,?)');
				sql3.push('insert into msg_notify(content,type,action,sender_id,user_id,is_read,created_at,nickname,avatar_url,comment_id,target_id,target_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
				sql3_param.push([content,type,action,sender_id,user_id,is_read,created_at,nickname,avatar_url,comment_id,target_id,target_type]);
				comnum=Number(commentnum + 1)
			}
			sql1_param.push([articleid,likeuserid]);
			sql2.push('update articlelist set commentnum=? where article_id =?');
			sql2_param.push([comnum,articleid]);
			
			var param = {sql1:{sql1:sql1,sql1_param},sql2:{sql2:sql2,sql2_param},sql3:{sql3:sql3,sql3_param}};//封装成这样是为了module成循环解析
			strTra.To_dbHelper(param,function (err,data) {
				if(err){
					var result = {
						"status": "500",
						"message": err
					}
					return res.jsonp(result)
				}else{
					var result = {
						"status": "200",
						"message": "success",
						"data": data
					}
					return res.jsonp(result)
				}
			});
		}catch(err){
			 console.log(err);
		}
	}else{
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 *删除评论
 */
router.post("/delDiscuss", function(req, res) {
	var id = req.body.id;
	var replytype = req.body.replytype;
	var tokenstr = req.body.token;
	if (replytype == 0) {
		sql = "delete from commentlist where id = " + id;
	} else {
		sql = "delete from replyart where replyid = " + id;
	}
	if (tokenstr == token) {
		db.query(sql, function(error, rows) {
			if (error) {
				var result = {
					"status": "500",
					"message": "服务器错误"
				}
				return res.jsonp(result);
			} else {
				var result = {
					"status": "200",
					"message": "success",
					data: rows
				}
				return res.jsonp(result);
			}
		});
	} else {
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 * 文章评论/回复点赞次数修改
 * 记录用户点赞的文章评论/回复
 * 用户取消点赞的文章评论/回复
 * **/
router.post('/ComRep_likes',async function (req,res) {
	var id = req.body.id;//评论id/回复id
	var commentnum = req.body.commentnum;//评论/回复当前点赞次数
	var likedown = req.body.likedown;//true:取消点赞;false:点赞
	var replytype = req.body.replytype;//0:评论;1:回复
	var likeuserid = req.body.likeuserid;//点赞人id
	
	var content = req.body.content//评论内容.仅限评论和回复才有
	var type = req.body.type//通知类型   1、公告 2、提醒 3、私信,
	var action = req.body.action//1、点赞  2、评论 3、回复 ,
	var sender_id = req.body.sender_id//发送者id
	var user_id = req.body.user_id//消息所属者，如post动态发布者
	var is_read = req.body.is_read//消息是否已读   0未读  1已读
	var nickname = req.body.nickname//发送者昵称
	var avatar_url = req.body.avatar_url//发送者头像
	var comment_id = req.body.comment_id//评论id  评论的时候存储
	var target_id = req.body.target_id//目标id （文章id/评论id/回复id）
	var target_type = req.body.target_type//目标类型  1、文章 2、评论 3、回复
	var tokenstr = req.body.token;
	var created_at = chinaTime('YYYY-MM-DD HH:mm:ss');//创建时间
	if (tokenstr == token) {
		try{
			var comnum,sql_1,sql_2,sql_pa,sql2_pa;
			var sql_pa;
			var sql1 = []//执行的SQL
			var sql2 = []
			var sql3 = []
			var sql1_param = []; //SQL中找占位符对应的数据集[ [占位数据，占位数据]， [占位数据，占位数据] ]
			var sql2_param = [];
			var sql3_param = [];
			if(likedown){
				comnum=Number(commentnum - 1)
				if (replytype == 0) {
					sql_2 = 'delete from comm_likes where commentid=? and likeuserid=?'
				} else {
					sql_2 = 'delete from rep_likes where replyid=? and likeuserid=?'
				}
				sql3.push('DELETE FROM msg_notify WHERE user_id = ?  AND action =? and target_id=? and target_type = ?')
				sql3_param.push([user_id,action,target_id,target_type]);
			}else{
				comnum=Number(commentnum + 1)
				if (replytype == 0) {
					sql_2 = 'INSERT into comm_likes (commentid,likeuserid) values (?,?)'
				} else {
					sql_2 = 'INSERT into rep_likes (replyid,likeuserid) values (?,?)'
				}
				sql3.push('insert into msg_notify(content,type,action,sender_id,user_id,is_read,created_at,nickname,avatar_url,comment_id,target_id,target_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
				sql3_param.push([content,type,action,sender_id,user_id,is_read,created_at,nickname,avatar_url,comment_id,target_id,target_type]);
			}
			if (replytype == 0) {
				sql_1 = 'update commentlist set up = ? where id =?';
				sql_pa=[comnum,id]
			} else {
				sql_1 = 'update replyart set replyup = ? where replyid=?';
				sql_pa=[comnum,id]
			}
			sql1.push(sql_1);
			sql1_param.push(sql_pa)
			sql2.push(sql_2);
			sql2_param.push([id,likeuserid])
			var param = {sql1:{sql1:sql1,sql1_param},sql2:{sql2:sql2,sql2_param},sql3:{sql3:sql3,sql3_param}};//封装成这样是为了module成循环解析
			strTra.To_dbHelper(param,function (err,data) {
				if(err){
					var result = {
						"status": "500",
						"message": err
					}
					return res.jsonp(result)
				}else{
					var result = {
						"status": "200",
						"message": "success",
						"data": data
					}
					return res.jsonp(result)
				}
			});
		}catch(err){
			 console.log(err);
		}
	}else{
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});
/**
 * 搜索文章
 */
router.post("/getsearchContent", function(req, res, next) {
	var keyword = req.body.keyword;
	db.query(
		"select A.*,B.typename,GROUP_CONCAT(C.likeuserid) as likeuserid ,(select count(*) from artviewcount where artid=A.article_id) as artviewcount from articlelist A LEFT OUTER JOIN contenttype B ON A.contenttype=B.typeid LEFT OUTER JOIN art_likes C ON A.article_id=C.articleid  where article_title like '%" +
		keyword + "%' or content like '%" + keyword + "%' GROUP BY article_id",
		function(error, rows) {
			if (error) {
				var result = {
					"status": "500",
					"message": "服务器错误"
				}
				return res.jsonp(result);
			} else {
				var result = {
					"status": "200",
					"message": "success",
					data: rows
				}
				return res.jsonp(result);
			}
		});
});

/**
 * 查询浏览记录
 */
router.post("/getviewrecord", function(req, res, next) {
	var userip = req.body.userip;
	var artid = req.body.artid;
	db.query("select count(*) as count from artviewcount where userip = '" + userip + "' and artid=" + artid + "",
		function(error, rows) {
			if (error) {
				var result = {
					"status": "500",
					"message": "服务器错误"
				}
				return res.jsonp(result);
			} else {
				var result = {
					"status": "200",
					"message": "success",
					data: rows
				}
				return res.jsonp(result);
			}
		});
});

/**
 * 新增浏览记录
 */
router.post("/addviewrecord", function(req, res, next) {
	var userip = req.body.userip;
	var artid = req.body.artid;
	db.query("insert into artviewcount (userip,artid) values ('" + userip + "'," + artid + ")", function(error, rows) {
		if (error) {
			var result = {
				"status": "500",
				"message": "服务器错误"
			}
			return res.jsonp(result);
		} else {
			var result = {
				"status": "200",
				"message": "success",
				data: rows
			}
			return res.jsonp(result);
		}
	});
});

/**
 * 获取用户提醒
 */
router.post("/getusernotify", function(req, res, next) {
	var user_id = req.body.user_id;
	var tokenstr = req.body.token;
	if (tokenstr == token) {
		db.query("select *,(select count(*) from msg_notify where user_id=" + user_id +" and is_read=0) as count from msg_notify where user_id=" + user_id + " and is_read=0",
			function(error, rows) {
				if (error) {
					var result = {
						"status": "500",
						"message": "服务器错误"
					}
					return res.jsonp(result);
				} else {
					var result = {
						"status": "200",
						"message": "success",
						data: rows
					}
					return res.jsonp(result);
				}
			});
	} else {
		var result = {
			"status": "522",
			"message": "登录信息过期"
		}
		return res.jsonp(result);
	}
});

module.exports = router
