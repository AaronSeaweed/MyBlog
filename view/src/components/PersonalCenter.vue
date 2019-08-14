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
                            <div class="photo_show" :style="{background:'url('+`${this.photo}`+')'}"></div>
                            <div class="action-box">
                                <div class="tips">支持 jpg、png 格式大小 5M 以内的图片</div>
                                <input type="file" name="file" accept=".jpg, .jpeg, .png" @change=uploadAvatar />
                            </div>
                        </div>
                    </li>
                    <template v-for="(Uinfo,index) in this.showinfo">
                        <li>
                            <span class="psct_title">{{Uinfo.title}}</span>
                            <div class="psct_info">
                                <input class="infotext" type="text" :placeholder="Uinfo.placeholder" v-model="Uinfo.name">
                                <div>
                                    <button v-if="Uinfo.u">
                                        <span class="glyphicon glyphicon-pencil">修改</span>
                                    </button>
                                    <button class="savaupdate" v-if="Uinfo.s" :index="index">
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
import bus from '../assets/js/eventbus.js';
import {Gb} from '../assets/js/global.js';
export default {
    data:function(){
        return{
            photo:"",
            showinfo:[],
            infoindex:"",
			token: localStorage.getItem("token"),
			userstatus: localStorage.getItem("userstatus"),
			updatename:false
        }
    },
    methods: {
        getUserInfo:function(){
            var that = this;
            return that.$axios.post("/users/getuserinfo",{id:Gb.b64DecodeUnicode(that.$route.params.userid),token:that.token})
            .then(function (response) {
				if(response.data.status==200){
					that.photo=response.data.data.photo?require('../../../view/src/assets/img/'+response.data.data.photo):require('../../../view/src/assets/img/user.png');
					that.showinfo=[];
					localStorage.setItem("username",response.data.data.username);
					localStorage.setItem("photo",response.data.data.photo);
					$("#username").show().text(response.data.data.username);
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
				}else if(response.data.status==522){
					that.$confirm(response.data.message+',是否重新登录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						bus.$emit("login", "");
					});
				}else{
					that.$message({
						message: response.data.message,
						type: 'error',
						duration:1000
					});
				}
            })
            .catch(function (error) {
                alert(error);
            });
        },
		checkupdate:function(index){
			var that = this;
			if(index){
				async function gck(){
					await that.checkname();
				}
				gck().then(function(){
					if(that.updatename){
						that.toUpdateInfo()
					}
				})
			}else{
				that.toUpdateInfo()
			}
		},
        toUpdateInfo:function(){
            var that = this;
            var updateinfo={username:$(".infotext").eq(0).val(),callname:$(".infotext").eq(1).val(),company:$(".infotext").eq(3).val(),selfintroduction:$(".infotext").eq(4).val(),profes:$(".infotext").eq(2).val(),homepage:$(".infotext").eq(5).val(),id:Gb.b64DecodeUnicode(that.$route.params.userid),token:that.token}
            that.$axios.post("/users/toUpdate",updateinfo)
            .then(function (response) {
				if(response.data.status==200){
					that.$message({
					    message: '修改成功！',
					    type: 'success',
					    duration:1000
					});
					that.getUserInfo();
				}else if(response.data.status==522){
					that.$confirm(response.data.message+',是否重新登录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						bus.$emit("login", "");
					});
				}else{
					that.$message({
						message: response.data.message,
						type: 'error',
						duration:1000
					});
				}
            })
            .catch(function (error) {
                that.$message({
                    message: error,
                    type: 'error',
                    duration:1000
                });
            });
        },
		checkname:function(){
			var that = this;
			if(that.reg_username!=""){
				return that.$axios.post('/users/checkname',{username:$(".infotext").eq(0).val()}).then(res=>{
				    if(res.data.status==200&&res.data.message=="success"){
				       if(res.data.data.count>0){
							that.$message({
							    message: "该用户名已存在,请修改",
							    type: 'error',
							});
							that.updatename=false;
					   }else{
						  that.updatename=true;
					   }
				    }else if(res.data.status==500){
						that.updatename=false;
						that.$message({
						    message: "服务器异常，请刷新页面！",
						    type: 'error',
						});
				    }else{
						that.updatename=false;
						that.$message({
						    message: res.data.message,
						    type: 'error',
						});
				    }
				}).catch(err=>{
					that.updatename=false;
				    that.$message({
				        message: err,
				        type: 'error',
				    });
				})
			}
		},
        settext:function(glyphicon){
            var that =this;
            var infotext = document.getElementsByClassName("infotext");
            
            for (var i = 0; i < glyphicon.length; i++) {
                var a = glyphicon[i];
                var b = infotext[i];
                a.index = b.index =i;//给每个className为child的元素添加index属性;
                document.onclick=function(e){
                    if(e.target.className=="savaupdate"){
                       // that.toUpdateInfo(e.target.attributes.index.value==0)
					   that.checkupdate(e.target.attributes.index.value==0)
                    }
                }
                b.onfocus = a.onclick= function () {
                    that.infoindex=this.index
                    that.showinfo[this.index]['u']=0;
                    that.showinfo[this.index]['s']=1;
                    that.showinfo[this.index]['c']=1;
                    infotext[this.index].select();
                }
                b.onblur = function(){
                    var obj =this;
                    setTimeout(function(){
                        that.infoindex=obj.index
                        that.showinfo[obj.index]['u']=1;
                        that.showinfo[obj.index]['s']=0;
                        that.showinfo[obj.index]['c']=0;
                    },600);
                    
                    setTimeout(function(){var _glyphicon = document.getElementsByClassName("glyphicon")
                    that.settext(_glyphicon)},750)
                }
                
            }
        },
        uploadAvatar:function(avatar){
            var that = this;
            let file = avatar.target.files[0]
            let data = new FormData();
            data.append("file", file, file.name);//很重要 data.append("file", file);不成功
            data.append('userid',Gb.b64DecodeUnicode(that.$route.params.userid))
			data.append('token',that.token)
            that.$axios.post("/dataInpute", data, {
                    headers: { "content-type": "multipart/form-data" }
            }).then(function (response) {
				if(response.data.status==522){
					that.$confirm(response.data.message+',是否重新登录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						bus.$emit("login", "");
					});
				}else{
					that.$message({
						message: response.data.message,
						type: 'error',
						duration:1000
					});
				}
            })
        }

    },
    mounted:function(){
		if (this.userstatus != 1) {
			bus.$emit("login", "");
		}else{
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
}
</script>
