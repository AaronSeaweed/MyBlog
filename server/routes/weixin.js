
var express = require('express');
var router = express.Router();
var db = require("../config/db");
var common = require("./common");

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

/**
 * 获取所有订单
 */
router.post("/getOrder",function(req,res,next){
//     var selsql=`select 
// a.orderid,a.ordernum,a.goodtolprice,a.payprice,a.deliveryprice,a.Reciinfo,a.orderdate,a.orderstatus,
// d.id as addid,d.username,d.Telphone,d.province,d.city,d.Area,d.detailaddress,
// b.orderid as food_orderid,b.foodid,b.count,
// c.foodid as foodinfoid,c.foodname,c.foodtypeid,c.price,c.img,c.content,
// e.statusid,e.statusname
// from orderlist as a 
// INNER join useraddress as d on a.Reciinfo=d.id 
// left join order_goodlist as b on a.orderid=b.orderid 
// left join food as c on b.foodid=c.foodid 
// left join orderstatus as e on a.orderstatus=e.statusid
// `;
var selsql=`select a.orderid,a.payprice,a.orderdate,s.statusname,f.img from orderlist as a
left join order_goodlist as c on a.orderid=c.orderid
left join orderstatus as s on s.statusid=a.orderstatus
left join food as f on f.foodid = c.foodid`
    db.query(selsql,function(error,rows){
        if (error) {
            var result = {
                "status": "500",
                "message": "服务器错误"
            }
            return res.jsonp(result);
        }
        else{
            for(var i = 0;i<rows.length;i++){
                rows[i].orderdate=new Date(+rows[i].orderdate+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            }
            var orarray=[];
            var ss=0;
            for(var i in rows){
                if(orarray.length>0){
                    for(var j=ss;j<orarray.length;j++){
                        if(orarray[j].orderid==rows[i].orderid){
                            if(!(orarray[j].img instanceof Array)){
                                var str=orarray[j].img
                                orarray[j].img=[]
                                orarray[j].img.push(str)
                                orarray[j].img.push(rows[i].img)
                            }else{
                                orarray[j].img.push(rows[i].img)
                            }
                        }else{
                            orarray.push(rows[i])
                            ss=orarray.length-1
                            break;
                        }
                    }
                }else{
                    orarray.push(rows[i])
                }
            }
            var result = {
                "status": "200",
                "message": "success",
                data:orarray
            }
            return res.jsonp(result);
        }
    });
});

module.exports = router