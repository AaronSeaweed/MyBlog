
var db = require("../config/db");
var muilter = require('./multerUtil');
var token = require("./set_token");
const chinaTime = require('china-time');
//multer有single()中的名称必须是表单上传字段的name名称。
var upload=muilter.single('file');
var upload2=muilter.single('editormd-image-file');
var upload3=muilter.single('user-image-file');

exports.dataInput = function (req, res) {
	if(req.query.guid){//上传文章图片
		upload2(req, res, function (err) {
			if(err){
				return err;
			}else{
				var result={
					"success" : 1, 
					"message" : "上传成功！",
					"url": "../../view/src/assets/img"+req.file.filename,
					"coverimage":req.file.filename
				}
				return res.jsonp(result);
			}
		})
	}else{
		var imgtype = req.query.imgtype;
		var querytoken = req.query.token||req.body.token;
		if(imgtype=="emj"){//上传表情包
			if(querytoken==token){
				upload(req, res, function (err) {
					//文件信息在req.file或者req.files中显示。
					db.query("insert into picandemj (picturename,picturetype,datetime) value ('"+req.file.filename+"',0,'"+chinaTime('YYYY-MM-DD HH:mm:ss')+"')",function(error,rows){
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
								"message": "success"
							}
							return res.jsonp(result);
						}
					});
				});
			}else{
				var result = {
					"status": "522",
					"message": "登录信息过期"
				}
				return res.jsonp(result);
			}
		}else{
			upload3(req, res, function (err) {
				var tokenstr = req.body.token||req.token;
				var userid = req.body.userid||req.userid;
				console.log("tokenstr:"+tokenstr)
				console.log("userid:"+userid)
				//文件信息在req.file或者req.files中显示。
				if(tokenstr==token){//上传用户头像
					//var result="";
					//async function modifyphoto(){
						/* await */ db.query("UPDATE user set photo='"+req.file.filename+"' where id = "+req.body.userid+"",function(error,rows){
							if (error) {
								result = {
									"status": "500",
									"message": "服务器错误"
								}
								return res.jsonp(result);
							}
							else{
								result = {  
									"status": "200",
									"message": "success",
									"filename":req.file.filename
								}
								return res.jsonp(result);
							}
						});
					//}
					//modifyphoto().then(function(){
					//	return result;
					//})
				}else{
					var result = {
						"status": "522",
						"message": "登录信息过期"
					}
					return res.jsonp(result);
				}
			});
		}
	}
}
