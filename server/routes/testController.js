
var db = require("../config/db");
var muilter = require('./multerUtil');
var token = require("./set_token");
//multer有single()中的名称必须是表单上传字段的name名称。
var upload=muilter.single('file');
var upload2=muilter.single('editormd-image-file');       	   
	exports.dataInput = function (req, res) {
	if(req.query.guid){
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
		upload(req, res, function (err) {
			var tokenstr = req.body.token;
		//文件信息在req.file或者req.files中显示。
			if(tokenstr==token){
				db.query("UPDATE user set photo='"+req.file.filename+"' where id = "+req.body.userid+"",function(error,rows){
					if (error) {
						var result = {
							"status": "500",
							"message": "服务器错误"
						}
						return result;
					}
					else{
						var result = {  
							"status": "200",
							"message": "success"
						}
						return result;
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
	}
}
