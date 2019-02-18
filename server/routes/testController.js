
var db = require("../config/db");
var muilter = require('./multerUtil');
//multer有single()中的名称必须是表单上传字段的name名称。
 var upload=muilter.single('file');       	   
      exports.dataInput = function (req, res) {
      upload(req, res, function (err) {
        //添加错误处理
        if (err) {
            return  console.log(err);
        } else{
             //文件信息在req.file或者req.files中显示。
           // console.log(req);
            db.query("UPDATE user set photo='"+req.file.filename+"' where id = "+req.body.userid+"",function(error,rows){
                //console.log("error:"+error)
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
                //console.log(result)
            });
        }
       
      });
}
