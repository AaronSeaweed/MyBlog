const nodemailer = require('nodemailer');
var checkcode="";
exports.sendmail = function (req, res) {
	var transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
		port: 587, // SMTP 端口
        auth: {
            user: '646264198@qq.com',
            pass: 'flyultofxvxrbcag'
        }
    });
	let arr = [];
	for (let i = 0 ; ; i++) {
		if(arr.length<6){
			rand()
		}else{
			break;
		}
	}
	function rand() {
		num = Math.floor(Math.random() * 9);
		for(var i = 0 ; i < arr.length; i++){ 
		     if(arr[i] == num){ 
		          return false; 
		     }      
		} 
		arr.push(num);
	}
	checkcode = arr.join("")
    transporter.sendMail({
        from: '646264198@qq.com', // sender address
        to: req.body.mail, // list of receivers
        subject: '重设登录密码', // Subject line
        html: '来自<b>老鼠会上树</b>网站的邮件<br>，验证码为:'+checkcode+'' // html body
    }, function(err, response){
		if(err){
			var result={
				"success" : 0, 
				"message" : err
			}
			return res.jsonp(result);
		}else{
			var result={
				"success" : 1, 
				"message" : "邮件发送成功！"
			}
			return res.jsonp(result);
		}
        //console.log('send mail err is ', err, response);
        transporter.close();
    });
}
module.exports=checkcode;