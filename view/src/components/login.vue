<template ref="child">
<div class="load-box" v-if="clicklogin">
    <form class="load-form" meths="post" onsubmit="return false">
        <i class="load-close" @click="closelogin()"></i>
        <div>
            <h1 class="load-title">{{title}}</h1>
            <span class="logintip" v-if="logintip">用户名或密码错误</span>
            <div class="load-form-box">
                <div class="load-input-box" :class="{displaynone:isreg}" >
                    <input type="text" name="username" v-model="load_username" placeholder="请输入邮箱或手机号码" class="load_username"/>
                </div>
                <div class="load-input-box" :class="{displaynone:isreg}">
                    <input type="password" name="password" v-model="load_password" placeholder="请输入密码" class="load_password"/>
                </div>
                <div class='load-input-box' :class="{displaynone:islogin}">
                    <input type='text' name='username' v-model="reg_username" placeholder='请输入用户名' class='reg_username'/>
                </div>
                <div class='load-input-box' :class="{displaynone:islogin}">
                    <input type='text' name='phonenoemail' v-model="reg_phoneemail" placeholder='请输入邮箱或手机号码' class='reg_phoneemail'/>
                </div>
                <div class='load-input-box' :class="{displaynone:islogin}">
                    <input type='text' name='password' v-model="reg_password" placeholder='请输入密码' class='reg_password'/>
                </div>
            </div>
            <button class="load-btn" @click="login();">{{button}}</button>
            <div class="prompt-box" :class="{displaynone:isreg}">没有帐号？
                <span @click="registeredmode();">注册</span>
                <a href="javascript:void(0)">忘记密码</a>
            </div>
            <div class="prompt-box center" :class="{displaynone:islogin}">
                  <span class="closereg" @click="loginmode()">已有帐号登录</span>
            </div>
        </div>
        <div class="otherloginmode">
            <div class="hint">第三方账号登录：</div>
            <div class="oauth">
                <div class="oauth-bg oauth-bg-weixin"></div>
                <div class="oauth-bg oauth-bg-weibo"></div>
                <div class="oauth-bg oauth-bg-qq"></div>
            </div>
        </div>
    </form>
</div>
</template>
<script>
export default {
        data:function(){
            return{
                isreg:false,
                islogin:true,
                clicklogin:false,
                logintip:false,
                title:"登录",
                button:"登录",
                load_username:null,
                load_password:null,
                reg_username:null,
                reg_phoneemail:null,
                reg_password:null
            }
        },
        methods:{
          closelogin:function() {
             this.logintip=this.clicklogin=false;
             this.load_password=this.load_username=this.reg_username=this.reg_phoneemail=this.reg_password="";
             $(".load-password").css("border","1px #e9e9e9 solid");
             this.isreg=false;
             this.islogin=true;
             this.title=this.button="登录";
          },
          loginmode:function(){
               this.isreg=false;
               this.islogin=true;
               this.logintip=false;
               this.title=this.button="登录";
          },
          registeredmode:function(){
             this.isreg=true;
             this.islogin=false;
             this.logintip=false;
             this.title=this.button="注册";
          },
          login:function(){
              var regsec=0;
             if(!this.isreg){
                if(this.load_username==""||this.load_username==null){
                    $(".logintip").text("请输入用户名").show();
                    $(".load_username").focus();
                    return false;
                }
                if(this.load_password==""||this.load_password==null){
                    $(".logintip").text("请输入密码").show();
                    $(".load_password").focus();
                    return false;
                }
                
                var submitdata={name:this.load_username,password:this.load_password}
                var tip="登录中...";
                var top2="登录";
                var url="/users/login";
             }else{
                 if(this.reg_username==""||this.reg_username==null){
                    $(".logintip").text("请输入用户名").show();
                    $(".reg_username").focus();
                    return false;
                }
                if(this.reg_phoneemail==""||this.reg_phoneemail==null){
                    $(".logintip").text("请输入邮箱或手机号码").show();
                    $(".reg_phoneemail").focus();
                    return false;
                }
                if(this.reg_password==""||this.reg_password==null){
                    $(".logintip").text("请输入密码").show();
                    $(".reg_password").focus();
                    return false;
                }
                 this.logintip=false;
                 tip = "注册中...";
                 top2 = "注册";
                 submitdata={name:this.reg_username,password:this.reg_password,phonenoemail:this.reg_phoneemail}
                 url="/users/add"
             }
             loginandreg(url,submitdata,this);
             function loginandreg(url,submitdata,that)
             {
                    that.$axios.post(url,submitdata).then(res=>{
                        if(res.data.status==200&&res.data.message=="success"){
                            if(that.isreg&&regsec==0){
                                $(".logintip").text("注册成功，自动登录中...").css("color","black").show();
                                regsec=1;
                                setTimeout(function(){loginandreg("/users/login",{name:res.data.data.name,password:res.data.data.password},that)},2000)
                            }else{
                                localStorage.setItem("userstatus",1);
                                localStorage.setItem("username",res.data.data.username);
                                localStorage.setItem("userid",res.data.data.id);
                                localStorage.setItem("photo",res.data.data.photo);
                                localStorage.setItem("token",res.data.token);
                                location.reload();
                            }
                        }else if(res.data.status==500){
                            that.logintip=true;
                            $(".logintip").text("服务异常，请稍后重试！").show();
                            $(".load_password").css("border","1px red solid");
                            $(".load-btn").text(top2).attr('disabled',false);
                        }else{
                            that.logintip=true;
                            $(".logintip").text(res.data.message).show();
                            $(".load_password").css("border","1px red solid");
                            $(".load-btn").text(top2).attr('disabled',false);
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
             }
          }
        },
        mounted:function(){
            $(".load_password").on("focus",function () {
                $(".load_password").css("border","1px #e9e9e9 solid");
            }).on("blur",function () {
                $(".load_password").css("border","1px #e9e9e9 solid");
            });
        }
}
</script>
