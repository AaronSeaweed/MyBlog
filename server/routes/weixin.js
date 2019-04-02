
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
 * 获取订单列表
 */
router.post("/getOrder",function(req,res,next){
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
         
            var orarray = {};
            rows.forEach(function (item) {
                if (orarray[item.orderid]) {
                    orarray[item.orderid].img.push(item.img);
                } else {
                    var img = item.img;
                    delete item.img;
                    item.img = [];
                    item.img.push(img);
                    orarray[item.orderid] = item;
                }
            });
            var result = {
                "status": "200",
                "message": "success",
                data:orarray
            }
            return res.jsonp(result);
        }
    });
});


/**
 * 获取订单列表
 */
router.post("/getOrderDateil",function(req,res,next){
    let orderid = req.body.orderid;
    var selsql='select a.orderid,a.ordernum,a.goodtolprice,a.payprice,a.deliveryprice,a.Reciinfo,a.orderdate,a.orderstatus,d.id as addid,d.username,d.Telphone,d.province,d.city,d.Area,d.detailaddress,d.doorplate,b.count,c.foodname,c.price,c.img,c.content,e.statusid,e.statusname from orderlist as a INNER join useraddress as d on a.Reciinfo=d.id left join order_goodlist as b on a.orderid=b.orderid left join food as c on b.foodid=c.foodid left join orderstatus as e on a.orderstatus=e.statusid where a.orderid='+orderid
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
                var items = {};
                var dddarray=["img","count","foodname","price","content"]
                var foodarray={}
                rows.forEach(function (item) {
                    if (items[item.orderid]) {
                        for(var i of dddarray){
                            foodarray[i]=item[i];
                        }
                    } 
                    else {
                        for(var i of dddarray){
                            foodarray[i]=item[i];
                            delete item[i];
                            item.food = [];
                            items[item.orderid] = item;
                        }
                    }
                    if(foodarray){
                        items[item.orderid].food.push(foodarray);
                        foodarray={}
                    }
                });
                var result = {
                    "status": "200",
                    "message": "success",
                    data:items
                }
                return res.jsonp(result);
            }
        });
    });
    /**
     * 取消订单
     */
    router.post("/cancelorder",function(req,res,next){
        let orderid = req.body.orderid;
        var selsql="UPDATE orderlist set orderstatus = 5 where orderid = " + orderid;
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