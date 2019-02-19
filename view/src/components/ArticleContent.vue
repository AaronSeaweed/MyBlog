<template>
<div class="body_content container">
    <div class="body_left col-md-8 art_style">
        <template v-for="(aridetail) in this.AriDetail">
        <article id="artContent" :key="aridetail.article_id">
                <h3>{{aridetail.title}}</h3>
                <p>{{reversedMessage(aridetail.datetime)}}，{{aridetail.views}}次阅读，归类于<a href="javascript:void(0)"> {{aridetail.typename}}</a></p>
                <p>本文可全文转载，但需要同时保留原作者和出处。</p><br/>
                <p class="aricon">{{aridetail.content}}</p>
        </article>
        </template>
        <div class="comment-foot">
            <ul>
                <li>
                    <a>微信</a>
                </li>
                <li>
                    <a>Node.js</a>
                </li>
                <li>
                    <a>webpack</a>
                </li>
            </ul>
        </div>
        <div class="comment-box">
            <div class="comment-title">
                评论
            </div>
            <div class="comment-form">
                <div class="comment-form-panel">
                    <span>你有什么想说的吗？</span>
                    <button class="comment-login" @click="showlogin()">登录</button>
                </div>
                <CommentPanel ref="child"></CommentPanel>
            </div>
            <ul class="comment-list">
                <template v-for="(comlist,index) in this.comments[0]">
                    <li :key="index">
                        <div class="comment" >
                            <div class="userAvatar">
                                <a><div class="lazy avatar avatar loaded" :style="{background: 'url('+require(`../../../view/src/assets/img/${comlist.photo||'user.png'}`)+')'}" ></div></a>
                            </div>
                            <div class="content-box">
                                <div class="content-header">
                                    <div class="user-info">
                                        <div class="user-Avatar-box"><a class="username">{{comlist.username}}</a></div>
                                        <div class="position">{{comlist.callname || ""}}</div>
                                    </div>
                                </div>
                                <div class="content">
                                    <span class="content-html">{{comlist.content}}</span>
                                </div>
                                <div class="content-foot">
                                    <div class="like-btn"><i></i><span>{{comlist.up}}</span></div>
                                    <span class="sub-comment-btn text-pointer">
                                        <span class="title" :replytype="0" :artid="comlist.id">回复</span>
                                    </span>
                                    <span class="date">{{changetime(comlist.date)}}</span>
                                </div>
                                <CommentPanel ref="child"></CommentPanel>
                                <div class="replylist">
                                    <template v-for="(replylist,index2) in getReplysList(comlist.id)">
                                        <div :key="index2">
                                        <div class="reply">
                                            <div class="comment" >
                                                <div class="userAvatar">
                                                    <a><div class="lazy avatar avatar loaded" :style="{background: 'url('+require(`../../../view/src/assets/img/${replylist.photo||'user.png'}`)+')'}" ></div></a>
                                                </div>
                                                <div class="content-box">
                                                    <div class="content-header">
                                                        <div class="user-info">
                                                            <div class="user-Avatar-box"><a class="username">{{replylist.replyusername}}</a></div>
                                                            <div class="position">{{replylist.callname || ""}}</div>
                                                        </div>
                                                    </div>
                                                    <div class="content">
                                                        <span class="content-html">回复&nbsp;{{replylist.replytype==0?comlist.username:getname(replylist.artid)}}：{{replylist.replycontent}}</span>
                                                    </div>
                                                    <div class="content-foot">
                                                        <div class="like-btn"><i></i><span>{{replylist.replyup}}</span></div>
                                                        <span class="sub-comment-btn text-pointer">
                                                            <span class="title" :replytype="1" :artid="replylist.replyid">回复</span>
                                                        </span>
                                                        <span class="date">{{changetime(replylist.replydate)}}</span>
                                                    </div>
                                                    <CommentPanel ref="child"></CommentPanel>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- <div class="fetch-more" v-if="index2==1"><a href="javascript:void(0)">加载更多</a></div> -->
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
    <div class="body_right col-md-4 hidden-xs hidden-sm">
        <div class="emptyPlace art_style">
            这就是一个用来撑高度的容器
        </div>
        <div class="relatedArt art_style">
            <div class="relatedArt-title">相关文章</div>
            <div class="relatedArt-body"></div>
        </div>
    </div>
</div>
</template>
<script>
import {Gb} from '../assets/js/global.js';
import bus from '../assets/js/eventbus.js';
import CommentPanel from './CommentPanel.vue';
export default {
        data:function(){
            return {
                comments:[],
                AriDetail:[],
                replys:[],
                replysubmit:[],
                replycount:0
            }
        },
        wacth:{
            replycount:function(){
                alert(this.replycount)
            }
        },
        components:{
            CommentPanel
        },
        methods:{
            changetime:function (time) {
                var timearr=Gb.getTimediff(time);
                switch (timearr[0]){
                    case "s":
                        return "刚刚"
                        break;
                    case "m":
                        return Math.floor(timearr[1])+"分钟前"
                        break;
                    case "h":
                        return Math.floor(timearr[1])+"小时前"
                        break;
                    case "d":
                        return Math.floor(timearr[1])+"天前"
                        break;
                    case "M":
                        return Math.floor(timearr[1])+"个月前"
                        break;
                    case "y":
                        return Math.floor(timearr[1])+"年前"
                        break;
                    case "l":
                        return Math.floor(timearr[1])+"很久前"
                        break;
                }
            },getcomment:function(){//获取文章详情、评论列表、回复列表
                var that = this;
                function getArticleList() {
                    return that.$axios.post('/article/getarticlelist',{contentid:that.$route.params.conid});
                }
                function getCommentList() {
                    return that.$axios.post('/article/getcommentlist',{contentid:that.$route.params.conid});
                }
                function getReplyList() {
                    return that.$axios.post('/article/getreplylist',{contentid:that.$route.params.conid});
                }
                return that.$axios.all([getArticleList(), getCommentList(),getReplyList()])
                    .then(that.$axios.spread(function (articlelist, commentlist,replylist) {
                        that.AriDetail=[];
                        that.comments=[];
                        that.replys=[];
                        that.AriDetail.push(articlelist.data.data[0]);
                        that.comments.push(commentlist.data.data);
                        that.replys.push(replylist.data.data);
                    })).catch(function (error) {
                        console.log(error);
                    });;
            },showlogin:function () {//与兄弟（IndexHead）组件通讯，通过eventbus.js文件让IndexHead组件执行函数
                bus.$emit("login","")
            },
            reversedMessage:function(datetime){//转换json的时间格式
                return Gb.getDate(datetime);
            },CommitComment:function (index) {//新增评论
                var that = this;
                var commentcontent=$(".usercomment").eq(index).val()||$(".usercomment").eq(0).val();
                if(commentcontent.trim()==""){alert("你输入评论！")}else{
                    var nowdate=Gb.getDate();//获取当前时间
                    var username=localStorage.getItem("username");
                    var submitdata={artid:that.replysubmit.artid,replyusername:username,replycontent:commentcontent,replyup:0,replydate:nowdate,replytype:that.replysubmit.replytype}
                    var posturl='/article/commitreply';
                    if(index==undefined){
                        commentcontent=$(".usercomment").eq(0).val();
                        submitdata={username:username,content:commentcontent,up:0,date:nowdate,contentid:that.$route.params.conid}
                        posturl='/article/commitcontent';
                    }
                    that.$axios.post(posturl, submitdata)
                    .then(function (response) {
                         $(".usercomment").eq(index).val("");
                         that.getcomment();
                    })
                    .catch(function (error) {
                        alert(error);
                    });

                }
            },getReplysList(id){
                var that = this;
                var nowreplys=[]
                for(var i=0;i<that.replys[0].length;i++){
                    if(that.replys[0][i]["replytype"]==0){
                        if(that.replys[0][i]["artid"]==id){
                            nowreplys.push(that.replys[0][i])
                        }
                    }
                }
                for(var n=0;n<that.replys[0].length;n++){
                    for(var j=0;j<nowreplys.length;j++){
                        if(that.replys[0][n]["artid"]==nowreplys[j]["replyid"]){
                            nowreplys.push(that.replys[0][n])
                        }
                    }
                }
                nowreplys.sort(function(a,b){//按时间排序显示回复
                    if(a.replydate>b.replydate){
                        return 1;
                    }else{
                        return -1;
                    }
                });
                that.replycount=nowreplys.length;
                //if(nowreplys.length>2){//超过两条回复只显示两条
                //    return nowreplys.slice(0,2);
                //}else{
                    return nowreplys;
                //}
            },getname(artid){
                var that = this;
                for(var i=0;i<that.replys[0].length;i++){
                    if(that.replys[0][i]["replyid"]==artid){
                        return that.replys[0][i]["replyusername"]
                    }
                }
            },ReplyArt(index,text){
                var userstatus = localStorage.getItem("userstatus");
                if(userstatus!=1){
                    this.showlogin();
                }else{
                    if(text!=undefined){
                        $(".comment-form-area").eq(index+1).css({"display":"block"}).end().not($(".comment-form-area").eq(index+1)).not($(".comment-form-area").eq(0)).css({"display":"none"})
                        $(".comment-form-area").eq(index+1).children(1).focus()
                        this.$refs.child[0].ArtFromUser(index+1,text);
                    }else{
                        $(".comment-form-area").eq(index+1).css({"display":"none"})
                    }
                    
                }
            }
        },
        mounted:function () {
            var that = this;
            var userstatus = localStorage.getItem("userstatus");
            if(userstatus==1){
                $(".comment-form-panel").css("display","none");
                $(".comment-form-area").eq(0).show();
            }
            async function gcent(){
                await that.getcomment(that.$route.params.conid);
            }
            gcent().then(function(){
                var child = document.getElementsByClassName("title");
                var childcomment = document.getElementsByClassName("comment-form-area");
                var timer=null;
                var blurobj=null;
                for (var i = 0; i < child.length; i++) {
                    childcomment[i+1].style.display="none"
                    var a = child[i];
                    a.index = childcomment[i+1].children[1].index = i;//给每个className为child的元素添加index属性;
                    a.onclick = function () {
                        blurobj=this;//记录当前回复框对象
                        clearTimeout(timer);
                        that.replysubmit=[]
                        that.replysubmit.replytype=child[this.index].getAttribute("replytype");
                        that.replysubmit.artid=child[this.index].getAttribute("artid");
                        that.ReplyArt(this.index,child[this.index].parentNode.parentNode.parentNode.children[0].children[0].children[0].innerText)
                    }
                    childcomment[i+1].children[1].onblur=function(){
                        timer=setTimeout(function(){
                            that.ReplyArt(blurobj.index)
                        },120);
                    }
                }
            })
        }
}
</script>
