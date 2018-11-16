var Banner = {
    //焦点图事件
    nextscroll: function () {
        var vcon = $(".v_cont ");
        var offset = ($(".v_cont li").width()) * -1;
        vcon.stop().animate({
            left: offset
        }, "slow", function () {
            var firstItem = $(".v_cont ul li").first();
            vcon.find("ul").append(firstItem);
            $(this).css("left", "0px");
            Banner.circle()
        })
    },
    circle: function () {
        var currentItem = $(".v_cont ul li").first();
        var currentIndex = currentItem.attr("index");
        $(".circle li").removeClass("circle-cur");
        $(".circle li").eq(currentIndex).addClass("circle-cur")
    },
    //选项卡事件
    blogtab: function (a) {
        var oDiv = document.getElementById("tab");
        var oLi = oDiv.getElementsByTagName("div")[0].getElementsByTagName("li");
        var aCon = oDiv.getElementsByTagName("div")[1].getElementsByTagName("div");
        var timer = null;
        for (var i = 0; i < oLi.length; i++) {
            oLi[i].index = i;
            oLi[i].onclick = function () {
                if (this.index != 3) {
                    show(this.index);
                }
            }
        }
        function show(a) {
            var index = a;
            var alpha = 0;
            for (var j = 0; j < oLi.length; j++) {
                if (j != 3) {
                    oLi[j].className = "";
                }
                aCon[j].className = "";
                aCon[j].style.opacity = 0;
                aCon[j].style.zIndex = 0;
                aCon[j].style.filter = "alpha(opacity=0)";
            }
            oLi[index].className = "cur";
            clearInterval(timer);
            timer = setInterval(function () {
                alpha += 2;
                alpha > 100 && (alpha = 100);
                aCon[index].style.opacity = alpha / 100;
                aCon[index].style.zIndex = alpha / 100;
                aCon[index].style.filter = "alpha(opacity=" + alpha + ")";
                alpha == 100 && clearInterval(timer);
            },
            5)
        }
    }

}
$(function () {
    $(".prev a").click(function () {
        var vcon = $(".v_cont ");
        var offset = ($(".v_cont li").width() * -1);
        var lastItem = $(".v_cont ul li").last();
        vcon.find("ul").prepend(lastItem);
        vcon.css("left", offset);
        vcon.animate({
            left: "0px"
        }, "slow", function () {
            Banner.circle()
        })
    });

    var animateEnd = 1;
    $(".circle li").click(function () {
        if (animateEnd == 0) {
            return
        }
        $(this).addClass("circle-cur").siblings().removeClass("circle-cur");
        var nextindex = $(this).index();
        var currentindex = $(".v_cont li").first().attr("index");
        var curr = $(".v_cont li").first().clone();
        if (nextindex > currentindex) {
            for (var i = 0; i < nextindex - currentindex; i++) {
                var firstItem = $(".v_cont li").first();
                $(".v_cont ul").append(firstItem)
            }
            $(".v_cont ul").prepend(curr);
            var offset = ($(".v_cont li").width()) * -1;
            if (animateEnd == 1) {
                animateEnd = 0;
                $(".v_cont").stop().animate({
                    left: offset
                }, "slow", function () {
                    $(".v_cont ul li").first().remove();
                    $(".v_cont").css("left", "0px");
                    animateEnd = 1
                })
            }
        } else {
            var curt = $(".v_cont li").last().clone();
            for (var i = 0; i < currentindex - nextindex; i++) {
                var lastItem = $(".v_cont li").last();
                $(".v_cont ul").prepend(lastItem)
            }
            $(".v_cont ul").append(curt);
            var offset = ($(".v_cont li").width()) * -1;
            $(".v_cont").css("left", offset);
            if (animateEnd == 1) {
                animateEnd = 0;
                $(".v_cont").stop().animate({
                    left: "0px"
                }, "slow", function () {
                    $(".v_cont ul li").last().remove();
                    animateEnd = 1
                })
            }
        }
    })
});
export {Banner}