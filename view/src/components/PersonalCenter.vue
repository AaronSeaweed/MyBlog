<template>
    <div class="body_content container">
        <div class="body_left col-md-8 psct_style">
            <div class="body_left_psct">
                <h3>个人资料</h3>
                <ul>
                    <li>
                        <span class="psct_title">头像</span>
                        <div class="psct_photobox">
                            <input type="file" class="input" style="display: none">
                            <div class="photo_show" :style="{background:'url('+`${this.photo||''}`+')'}"></div>
                            <div class="action-box">
                                <div class="tips">支持 jpg、png 格式大小 5M 以内的图片</div>
                                <button>点击上传</button>
                            </div>
                        </div>
                    </li>
                    <template v-for="(Uinfo) in this.showinfo">
                        <li>
                            <span class="psct_title">{{Uinfo.title}}</span>
                            <div class="psct_info">
                                <input class="infotext" type="text" :placeholder="Uinfo.placeholder" v-model="Uinfo.name">
                                <div>
                                    <button v-if="Uinfo.u">
                                        <span class="glyphicon glyphicon-pencil">修改</span>
                                    </button>
                                    <button class="savaupdate" v-if="Uinfo.s">
                                        保存
                                    </button>
                                    <button class="cancelupdate" v-if="Uinfo.c">
                                        取消
                                    </button>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {Gb} from '../assets/js/global.js';
export default {
    data:function(){
        return{
            photo:"",
            showinfo:[]
        }
    },
    components:{
                
    },
    methods: {
        getUserInfo:function(){
            var that = this;
            return that.$axios.post("/users/getuserinfo",{name:Gb.b64DecodeUnicode(that.$route.params.userid)})
            .then(function (response) {
                that.photo=require('../../../view/src/assets/img/'+response.data.data.photo)
                that.showinfo.push({
                    "title":"用户名","name":response.data.data.username,"placeholder":"填写你的用户名","u":1,"s":0,"c":0
                },{
                    "title":"头衔","name":response.data.data.callname,"placeholder":"填写你的头衔","u":1,"s":0,"c":0
                },{
                    "title":"职位","name":response.data.data.profes,"placeholder":"填写你的职位","u":1,"s":0,"c":0
                },{
                    "title":"公司","name":response.data.data.company,"placeholder":"填写你的公司","u":1,"s":0,"c":0
                },{
                    "title":"个人介绍","name":response.data.data.selfintroduction,"placeholder":"填写职业技能、擅长的事情、喜欢的事情等","u":1,"s":0,"c":0
                },{
                    "title":"个人主页","name":response.data.data.homepage,"placeholder":"填写你的个人主页","u":1,"s":0,"c":0
                });
            })
            .catch(function (error) {
                alert(error);
            });
        },
        toUpdateInfo:function(){
            var that = this;
            //var updateinfo={username:,callname:,photo:,company:,selfintroduction:,profes:,homepage:,id:}
            that.$axios.post("/users/toUpdate",{})
            .then(function (response) {
                
            })
            .catch(function (error) {
                alert(error);
            });
        },
        settext:function(glyphicon){
            var that =this;
            var infotext = document.getElementsByClassName("infotext")
            for (var i = 0; i < glyphicon.length; i++) {
                var a = glyphicon[i];
                var b = infotext[i];
                a.index = b.index = i;//给每个className为child的元素添加index属性;
                a.onclick = b.onclick = function () {
                    that.showinfo[this.index]['u']=0;
                    that.showinfo[this.index]['s']=1;
                    that.showinfo[this.index]['c']=1;
                    infotext[this.index].select()
                }
                b.onblur = function(){
                    that.showinfo[this.index]['u']=1;
                    that.showinfo[this.index]['s']=0;
                    that.showinfo[this.index]['c']=0;
                    var _glyphicon = document.getElementsByClassName("glyphicon")
                    that.settext(_glyphicon)
                }
            }
        }

    },
    mounted:function(){
        var that =this;
        async function gcent(){
            await that.getUserInfo();
        }
        gcent().then(function(){
            var glyphicon = document.getElementsByClassName("glyphicon")
            that.settext(glyphicon);
        })
    }
}
</script>
