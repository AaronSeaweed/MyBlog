<template>
<el-row :gutter="20"  class="body_content container">
    <el-col :span="16">
        <div class="grid-content bg-purple body_left">
            <el-carousel :interval="5000" arrow="always">
                <el-carousel-item v-for="(item,index) in banner" :key="index">
                <img :src="imgSrcFun(item.src)"/>
                </el-carousel-item>
            </el-carousel>
                <div class="recarti">
                    <!--<div class="recomtoday">
                        <h2><span>【今日推荐】</span><a>{{title}}</a></h2>
                        <p>{{message}}</p>
                    </div>-->
                    <div class="conttil">
                        <!--<span>最新发布</span>-->
                        <a href="javascript:void(0)" @click="sorting(1)">热度</a>
                        <a href="javascript:void(0)" @click="sorting(3)">新鲜度</a>
                    </div>
                    <div class="bloglist">
                        <div class="blogtypemenu">
                            <div class="menulist">
                            </div>
                            <ul class="contenttypemenu">
                                <li v-for="(contype,index) in contenttype" :key="contype.typeid" @click="changecontent(index)">{{contype.typename}}</li>
                            </ul>
                        </div>

                        <template v-for="(blcont) in this.nblists">
                            <div class="conlist"  :key="blcont.id">
                                <div class="imgbg">
                                    <img src="../assets/img/contentimg.png"/>
                                </div>
                                <div class="conbg">
                                    <header>
                                        <a href="javascript:void(0)">{{blcont.typename}}</a>
                                        <router-link :to="{ name: 'atct', params:{conid:blcont.article_id}}" class="contitle">{{blcont.article_title}}</router-link>
                                    </header>
                                    <span class="condatetime coninfo">{{reversedMessage(blcont.datetime)}}</span>
                                    <span class="conviews coninfo">有{{blcont.views}}人阅读</span>
                                    <a href="javascript:void(0)" class="coninfo concommentnum" @mouseover="changecolor($event)"
                                    @mouseout="changecolor2($event)" @click="AContent(blcont.id)">{{blcont.commentnum}}条评论</a>
                                    <br/><br/>
                                </div>
                            </div>
                        </template>

                        <div class="loadmore">
                        </div>
                    </div>
                </div>
        </div>
    </el-col>
    <el-col :span="8">
        <div class="grid-content bg-purple body_right">
            <WebBulletin></WebBulletin>
            <!--每日一句-->
            <div class="daysen">
                <div class="ds_title">
                    每日一句
                </div>
                <div class="ds_cont">
                    <div>
                        <p></p>
                        <span>{{contdate[0].cont_en}}</span>
                        <span>{{contdate[0].cont_zh}}({{contdate[0].author}})</span>
                    </div>
                </div>
            </div>
            <!--热门文章-->
            <div class="hotcont">
                <div class="hc_title" id="w">
                    精华
                </div>
                <template v-for="hotcont in hotblcontlists">
                    <div v-if="hotcont.hot==true" :key="hotcont.id">
                        <div class="hc_cont">
                            <div class="hc_imgbg"><img src="../assets/img/contentimg.png"/></div>
                            <div class="hc_concont">
                                <a href="javascript:void(0)">{{hotcont.article_title}}</a>
                                <span>{{hotcont.datetime}}</span>　　<span class="views">{{hotcont.views}}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        </div>
    </el-col>
</el-row>

</template>
<script>
import WebBulletin from './WebBulletin.vue';
import {Gb} from '../assets/js/global.js'
export default {
    //绑定最新发布文章和事件
            data:function(){
                return{
                    newblcontlist: [],//BlogContent,//绑定文章简要数据
                    contenttype: [],//绑定文章类型数据
                    startindex: 0,//默认从第0条开始加载
                    stopindex: 10,//默认一组10条数据
                    whetherloadmore: 0,//判断是否还有剩余数据
                    datagroup: 1,//记录当前是加载到了第几组数据
                    whetherscr: 0,//判断是否加载过第二页数据
                    contenttypeid: 5,//文章类型id
                    fristload: 1,//是否首次加载
                    currentdatatypelength: "",//当前类型数据的条数
                    sortingtype: 0,//默认排序方式
                    isnsorting: 0,//默认不启用排序功能
                    contdate: [{datetime:"2017年01月13日星期五",cont_en:"Do not let what you cannot do interfere with what you can do.",cont_zh:"别让你不能做的事妨碍到你能做的事。",author:"John Wooden"}]
                    ,hotblcontlist:"",
                    nblists:[],
                    banner:[{ src:"banner_1.jpg"},{src:"banner_2.jpg"},{src:"banner_3.jpg"}]
                }
            },
            components:{
                WebBulletin
            },
            methods: {
                imgSrcFun(value){
                    return require('@/assets/img/'+value);
                },
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
                            $(".loadmore").append('<div class="loadgif"></div>');
                            var nblist = "";
                            if (this.contenttypeid == 5) {
                                nblist = this.newblcontlist[0].length;
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
                                    that.nblists.push();
                                } else {
                                    that.stopindex = nblist;
                                    that.nblists.push();
                                    that.whetherloadmore = 1;
                                }
                                that.blcontlist();
                            } else {
                                $(".loadmore").append("无更多数据");
                            }
                        }
                    }
                },
                AContent:function (id) {
                    this.$router.push({
                        name: 'atct',
                        params:{conid:id}
                    })
                },
                changecontent: function (index) {
                    this.contenttypeid = index;
                    this.fristload = 0;
                    if (index == 5) {
                        this.isnsorting = 5;
                    }
                    $(".contenttypemenu li").eq(index).css("color", "#3399CC").siblings().css("color", "black");
                    this.blcontlist();
                },
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
                    this.fristload = 0;
                    this.blcontlist();
                },
                blcontlist: function () {
                    var nblist = "";//分页显示最新发布文章（默认显示前10条）
                    var that = this;
                    function getArticleList() {
                        return that.$axios.post('/article/getarticlelist');
                    }
                    function getArticleType() {
                        return that.$axios.post('/article/getarticletype');
                    }
                    that.$axios.all([getArticleList(), getArticleType()])
                    .then(that.$axios.spread(function (articlelist, articletype) {
                        that.newblcontlist=[];
                        that.newblcontlist.push(articlelist.data.data);
                         $(".ds_cont div p").text(articlelist.data.time);
                        //that.contenttype.push(articletype.data.data);
                         that.contenttype=articletype.data.data;
                        Pagingsort();
                    }));
                    function Pagingsort(){
                        if (that.newblcontlist[0].length < 10) {//不够10条显示全部
                            that.stopindex = that.newblcontlist[0].length;
                        }
                        if (that.contenttypeid === 5) {//首页时加载全部类型文章
                            that.nblists = that.newblcontlist[0].slice(that.startindex, that.stopindex);
                        }else {//加载用户选择的类型文章
                            var newblcontlist2 = new Array();//创建一个新数组用来放筛选后的文章
                            for (var i = 0; i < that.newblcontlist[0].length; i++) {//遍历所有文章
                                if (that.newblcontlist[0][i].contenttype == that.contenttypeid + 1) {//在所有文章中匹配用户选择的文章类型
                                    //放进新的数组
                                    newblcontlist2.push(that.newblcontlist[0][i]);
                                    that.currentdatatypelength = newblcontlist2.length;//记录当前选择文章类型数据的条数
                                }
                            }
                            $(".conttil span").eq(0).text($(".contenttypemenu li,.contenttypemenu2 li").eq(that.contenttypeid).text());
                            that.nblists = newblcontlist2.slice(that.startindex, that.stopindex);
                        }
                        if (that.isnsorting != 0) {
                            if (that.sortingtype == 1) {
                                that.nblists.sort(function (a, b) {
                                    return (a.commentnum < b.commentnum) ? 1 : -1  //降序
                                });
                            } else if (that.sortingtype == 2) {
                                that.nblists.sort(function (a, b) {
                                    return (a.commentnum > b.commentnum) ? 1 : -1  //升序
                                });
                            } else if (that.sortingtype == 3) {
                                that.nblists.sort(function (a, b) {
                                    return Date.parse(b.datetime) - Date.parse(a.datetime);//时间正序
                                });
                            } else if (that.sortingtype == 4) {
                                that.nblists.sort(function (a, b) {
                                    return Date.parse(a.datetime) - Date.parse(b.datetime);//时间倒序
                                });
                            }
                        }
                    }
                },sethead: function () {
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
                reversedMessage:function(datetime){
                    return Gb.getDate(datetime);
                }
            },
            computed: {
                hotblcontlists: function () {
                    var hotblcontlist2 = new Array();
                    hotblcontlist2 = $.extend(true, hotblcontlist2, this.nblists);//深度合并数组,修改新数组时不会使旧数组数据发生变化
                    for (var s = 0; s < hotblcontlist2.length; s++) {
                        hotblcontlist2[s].datetime = hotblcontlist2[s].datetime.toString().substring(0, 10);
                    }
                    return hotblcontlist2.slice(0, 9);
                }
            },
            mounted: function () {
                var that = this;
                $(document).scroll(this.loadmoredata);//绑定监听鼠标滚动事件
                $(window).scroll(function () {
                    that.sethead();
                });
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
                this.blcontlist();
            },
            updated: function () {
               // PageMb.Skinning();
            }
}
</script>

