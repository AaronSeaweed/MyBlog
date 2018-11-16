var Gb = {
    readCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return false;
    },
    createCookie: function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    getQueryString:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getTimediff:function (time) {
       var date=new Date();
       var time2= date.toLocaleDateString()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
       var timeunit=['s','m','h','d','M','y','l'];
       var Timediff = (new Date(time2).getTime()-new Date(time).getTime())/1000/60;//相差的分钟数
       if(Timediff<1){
           return [timeunit[0],Timediff];//刚刚
       }else{
           if(Timediff>=1&&Timediff<60){
               return [timeunit[1],Timediff]//多少分钟前
           }else{
               if(Timediff>=60&&Timediff<1440){
                   return [timeunit[2],Timediff/60]//多少小时前
               }else{
                   if(Timediff>=1440&&Timediff<43200){
                       return [timeunit[3],Timediff/60/24]//多少天前
                   }else{
                       if(Timediff>=43200&&Timediff<518400){
                           return [timeunit[4],Timediff/60/24/30]//多少月前
                       }else{
                           if(Timediff>=518400&&Timediff<1555200){
                               return [timeunit[5],Timediff/60/24/30/12]//多少年前
                           }else{
                               return [timeunit[5],Timediff]//很久前
                           }
                       }
                   }
               }
           }
       }
    },
    getDate:function () {
        Date.prototype.Format = function (fmt) { // author: meizz
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return new Date().Format("yyyy-MM-dd hh:mm:ss");
    },
    b64EncodeUnicode:function(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    },
    b64DecodeUnicode:function(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}
export {Gb}