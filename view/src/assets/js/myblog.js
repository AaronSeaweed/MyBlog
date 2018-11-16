import Vue from 'vue'
//import Banner from './banner.js'
$(function () {
    //Pages.PageInit();
    setInterval(Banner.nextscroll, 5000);//焦点图自动滚动
    $(".next a").click(function () {//手动滚动
        Banner.nextscroll()
    });
    $(window).scroll(function () {
        PageMb.sethead();
    });
    Banner.blogtab();
    PageMb.LoadBulletin();
    PageMb.Skinning();
});
var PageMb = {
    LoadBulletin: function () {
        new Vue({
            el: "#Bulletin",
            data: {
                budata: Bulletin
            }
        });
        Vue.component('my_email', {
            template: "<span>Email:15570733310@163.com<br/>QQ:646264198</span>"
        });
        new Vue({
            el: "#ContactWeb",
        });

        new Vue({
            el: "#MemberCentre",
            data: {
                message: "此功能正在努力开发中..."
            }
        });
        //排序
        var sort = new Vue({
            el: ".conttil",
            data: {
                sortingtype: 0,//默认排序方式
                isnsorting: 0//默认不启用排序功能
            },
            methods: {
                sorting: function (ortype) {
                    if (this.sortingtype == ortype) {
                        if (ortype == 1) {
                            this.sortingtype = 2;
                        } else if (ortype == 2) {
                            this.sortingtype = 1;
                        } else if (ortype == 3) {
                            this.sortingtype = 4;
                        } else if (ortype == 4) {
                            this.sortingtype = 3;
                        }
                    } else {
                        this.sortingtype = ortype;
                    }
                    this.isnsorting = 1;
                    mainfun.$data.fristload = 0;
                }
            }
        });
        //绑定最新发布文章和事件
        var mainfun = new Vue({
            el: ".bloglist",
            data: {
                newblcontlist: [],//BlogContent,//绑定文章简要数据
                contenttype: [],//绑定文章类型数据
                startindex: 0,//默认从第0条开始加载
                stopindex: 10,//默认一组10条数据
                whetherloadmore: 0,//判断是否还有剩余数据
                datagroup: 1,//记录当前是加载到了第几组数据
                whetherscr: 0,//判断是否加载过第二页数据
                contenttypeid: 5,//文章类型id
                fristload: 1,//是否首次加载
                currentdatatypelength: ""//当前类型数据的条数
            },
            methods: {
                checkback_over: function (event) {
                        $(event.currentTarget).css({"color": "#3399CC"});
                },
                checkback_out: function (event) {
                        $(event.currentTarget).css({"color": "#000"});
                },
                changecolor: function (evevt) {
                    $(event.currentTarget).addClass("concommentnum2").removeClass("concommentnum");
                },
                changecolor2: function (evevt) {
                    $(event.currentTarget).addClass("concommentnum").removeClass("concommentnum2");
                },
                loadmoredata: function () {//加载更多数据
                    if ($(document).scrollTop() >= ($(document).height() - $(window).height())) {//判断浏览器滚动条靠近到底部
                        this.whetherscr = 1;
                        if ($(".conlist").length >= 10) {
                            $(".loadmore").html("");
                            $(".loadmore").append('<img src="../assets/img/loading.gif"/>');
                            var nblist = "";
                            if (this.contenttypeid == 5) {
                                nblist = this.newblcontlist.length;
                            } else {
                                nblist = this.currentdatatypelength;
                            }
                            var that = this;
                            window.setTimeout(function () {
                                setloaddata(nblist, that);
                            }, 1000);
                        }
                        /*
                         【Bug】
                         nblist是全部类型文章数据，当选择对应的类型文章时,不能用全部类型文章数据的条数
                         【已解决:Date:2017-04-17】
                         记录当前选择的文章类型数据的条数，当不是首页时，将该条数赋值给nblist
                         */
                        function setloaddata(nblist, that) {
                            that.datagroup++;
                            $(".loadmore").html("");
                            if (that.whetherloadmore == 0) {
                                if (nblist > that.stopindex * that.datagroup) {
                                    that.stopindex = 10 * that.datagroup;
                                    that.blcontlist.push();
                                } else {
                                    that.stopindex = nblist;
                                    that.blcontlist.push();
                                    that.whetherloadmore = 1;
                                }
                            } else {
                                $(".loadmore").append("无更多数据");
                            }
                        }
                    }
                },
                AContent:function (id) {
                  // window.open("ArticleContent.html?contentid="+id)
                  //   this.$router.push({
                  //       path: '/ArticleContent/${id}',
                  //   })
                },
                changecontent: function (index) {
                    this.contenttypeid = index;
                    this.fristload = 0;
                    if (index == 5) {
                        sort.$data.isnsorting = 5;
                    }
                    $(".contenttypemenu li").eq(index).css("color", "#3399CC").siblings().css("color", "black");
                }
            },
            computed: {
                blcontlist: function () {//分页显示最新发布文章（默认显示前10条）
                    $.ajax({
                        url:'/article/getarticlelist',
                        data:"",
                        type:"post",
                        async:false,
                        success:function(data){
                            newblcontlist = data.data;
                            $(".ds_cont div p").text(data.time);
                        },
                        error:function(e){
                            alert(e);
                        }
                    });
                    this.newblcontlist=newblcontlist;
                    $.ajax({
                        url:'/article/getarticletype',
                        data:"",
                        type:"post",
                        async:false,
                        success:function(data){
                            contenttype = data.data;
                        },
                        error:function(e){
                            alert(e);
                        }
                    });
                    this.contenttype=contenttype;
                    var nblist = "";
                    if (this.newblcontlist.length < 10) {//不够10条显示全部
                        this.stopindex = this.newblcontlist.length;
                    }
                    if (this.contenttypeid === 5) {//首页时加载全部类型文章
                        nblist = this.newblcontlist.slice(this.startindex, this.stopindex);
                    }
                    else {//加载用户选择的类型文章
                        var newblcontlist2 = new Array();//创建一个新数组用来放筛选后的文章
                        for (var i = 0; i < this.newblcontlist.length; i++) {//遍历所有文章
                            if (this.newblcontlist[i].contenttype == this.contenttypeid + 1) {//在所有文章中匹配用户选择的文章类型
                                //放进新的数组
                                newblcontlist2.push(this.newblcontlist[i]);
                                this.currentdatatypelength = newblcontlist2.length;//记录当前选择文章类型数据的条数
                            }
                        }
                        $(".conttil span").eq(0).text($(".contenttypemenu li,.contenttypemenu2 li").eq(this.contenttypeid).text());
                        nblist = newblcontlist2.slice(this.startindex, this.stopindex);
                    }

                    if (sort.$data.isnsorting != 0) {
                        if (sort.$data.sortingtype == 1) {
                            nblist.sort(function (a, b) {
                                return (a.commentnum < b.commentnum) ? 1 : -1  //降序
                            });
                        } else if (sort.$data.sortingtype == 2) {
                            nblist.sort(function (a, b) {
                                return (a.commentnum > b.commentnum) ? 1 : -1  //升序
                            });
                        } else if (sort.$data.sortingtype == 3) {
                            nblist.sort(function (a, b) {
                                return Date.parse(b.datetime) - Date.parse(a.datetime);//时间正序
                            });
                        } else if (sort.$data.sortingtype == 4) {
                            nblist.sort(function (a, b) {
                                return Date.parse(a.datetime) - Date.parse(b.datetime);//时间倒序
                            });
                        }
                    }
                    return nblist;
                }
            },
            mounted: function () {
                $(document).scroll(this.loadmoredata);//绑定监听鼠标滚动事件
                $(".contenttypemenu li").eq(5).css("color", "#3399CC");
                //菜单收缩事件
                $(".menulist").on('click', function () {
                    if ($(".blogtypemenu div").hasClass("menulist")) {
                        $(".blogtypemenu").animate({height: "250px"}, 300);
                        $(".blogtypemenu div").removeClass("menulist").addClass("menulist2");
                        $(".contenttypemenu").removeClass("contenttypemenu").addClass("contenttypemenu2");
                    } else {
                        $(".blogtypemenu").animate({height: "50px"}, 300);
                        $(".blogtypemenu div").addClass("menulist").removeClass("menulist2");
                        $(".contenttypemenu2").removeClass("contenttypemenu2").addClass("contenttypemenu");
                    }
                })
            },
            updated: function () {
               // PageMb.Skinning();
            }
        });
        //绑定每日一句
        new Vue({
            el: ".ds_cont",
            data: {
                contdate:DailySentence[0]
            }
        });
        //绑定热门文章
        new Vue({
            el: ".hotcont",
            data: {
                hotblcontlist: BlogContent
            },
            computed: {
                hotblcontlists: function () {
                    var hotblcontlist2 = new Array();
                    hotblcontlist2 = $.extend(true, hotblcontlist2, this.hotblcontlist);//深度合并数组,修改新数组时不会使旧数组数据发生变化
                    for (var s = 0; s < hotblcontlist2.length; s++) {
                        hotblcontlist2[s].datetime = hotblcontlist2[s].datetime.toString().substring(0, 10);
                    }
                    return hotblcontlist2.slice(0, 9);
                }
            }
        });
    },
    sethead: function () {
        if (___getPageScroll() > 100) {
            $(".head_menu").addClass("fixd");
            if (___getPageScroll() > 1154) {
                $("#Scro_Fixed").addClass("scro_fixed");
            }
        }
        if (___getPageScroll() < 1154) {
            $("#Scro_Fixed").removeClass("scro_fixed");
            if (___getPageScroll() < 100) {
                $(".head_menu").removeClass("fixd");
            }
        }

        function ___getPageScroll() {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                yScroll = document.documentElement.scrollTop;
                xScroll = document.documentElement.scrollLeft;
            } else if (document.body) {// all other Explorers
                yScroll = document.body.scrollTop;
                xScroll = document.body.scrollLeft;
            }
            return yScroll;
        };
    },
    //网页换肤
    Skinning: function () {
        var colorid = localStorage.getItem("colorid");
        if (colorid == 2) {
            $("#stylelink").attr({"href": "../css/blogs_black.css"});
            $(".imgbg img,.hc_imgbg img").attr({"src": "../assets/img/weixin.png"});
        } else {
            $("#stylelink").attr({"href": "../css/blogs.css"});
            $(".imgbg img,.hc_imgbg img").attr({"src": "../assets/img/contentimg.png"});
        }
        $(".head_menu span").eq(1).click(function () {
            var colorid = localStorage.getItem("colorid");
            if (colorid == 2) {
                $("#stylelink").attr({"href": "../css/blogs.css"});
                $(".imgbg img,.hc_imgbg img").attr({"src": "../assets/img/contentimg.png"});
                localStorage.setItem('colorid', 1);
            } else {
                $("#stylelink").attr({"href": "../css/blogs_black.css"});
                $(".imgbg img,.hc_imgbg img").attr({"src": "../assets/img/weixin.png"});
                localStorage.setItem('colorid', 2);
            }
        });
    }
}
