<template ref="child">
<div class="load-box" v-if="clicklogin">
    <form class="load-form" meths="post" onsubmit="return false">
        <i class="load-close" @click="closelogin()"></i>
        <div>
            <h1 class="load-title">{{title}}</h1>
            <span class="logintip" v-if="logintip">{{tiptext}}</span>
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
                    <input type='password' name='password' v-model="reg_password" placeholder='请输入密码' class='reg_password'/>
                </div>
				<div class='load-input-box' :class="{displaynone:islogin}">
				    <input type='password' name='password' v-model="reg_password2" placeholder='请确认密码' class='reg_password2'/>
				</div>
            </div>
            <!-- <button class="load-btn" @click="login();">{{button}}</button> -->
			<el-button type="primary" class="load-btn" :loading="loading" @click="login">{{button}}</el-button>
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
                reg_password:null,
				reg_password2:null,
				tiptext:"用户名或密码错误",
				style_border:false,
				loading:false
            }
        },
        methods:{
			closelogin:function() {
				this.logintip=this.clicklogin=false;
				this.load_password=this.load_username=this.reg_username=this.reg_phoneemail=this.reg_password="";
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
				this.logintip=false;
				var regsec=0;
				if(!this.isreg){
					if(this.load_username==""||this.load_username==null){
						return this.showtop("请输入用户名",'load_username');
					}
					if(this.load_password==""||this.load_password==null){
						return this.showtop("请输入密码",'load_password');
					}
					var submitdata={name:this.load_username,password:this.load_password}
					this.button="登录中...";
					var url="/users/login";
				}else{
					if(this.reg_username==""||this.reg_username==null){
						 return this.showtop("请输入用户名",'reg_username');
					}
					if(this.reg_phoneemail==""||this.reg_phoneemail==null){
						return this.showtop("请输入邮箱或手机号码",'reg_phoneemail');
					}else{
						var phonereg = new RegExp(/^1[34578]\d{9}$/);
						var EmailReg = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
						if(!phonereg.test(this.reg_phoneemail)&&!EmailReg.test(this.reg_phoneemail)){
							return this.showtop("邮箱或手机号码格式不正确",'reg_phoneemail');
						}
					}
					if(this.reg_password==""||this.reg_password==null){
						return this.showtop("请输入密码",'reg_password');
					}
					if(this.reg_password2==""||this.reg_password2==null){
						return this.showtop("请确认密码",'reg_password2');
					}else{
						if(this.reg_password2!=this.reg_password){
							return this.showtop("两次密码不一致",'reg_password2');
						}
					}
					this.logintip=false;
					this.button = "注册中...";
					submitdata={name:this.reg_username,password:this.reg_password,phonenoemail:this.reg_phoneemail}
					url="/users/add"
				 }
             loginandreg(url,submitdata,this);
             function loginandreg(url,submitdata,that)
             {
				that.loading=true;
                that.$axios.post(url,submitdata).then(res=>{
                    if(res.data.status==200&&res.data.message=="success"){
                        if(that.isreg&&regsec==0){
							that.button="注册成功，自动登录中...";
                            regsec=1;
                            setTimeout(function(){loginandreg("/users/login",{name:res.data.data.name,password:res.data.data.password},that)},2000)
                        }else{
                            localStorage.setItem("userstatus",1);
                            localStorage.setItem("username",res.data.data.username);
                            localStorage.setItem("userid",res.data.data.id);
                            localStorage.setItem("photo",res.data.data.photo);
                            localStorage.setItem("token",res.data.token);
                            location.reload();
							setTimeout(()=>{that.loading=false},2000)
                        }
                    }else if(res.data.status==500){
						that.loading=false;
						that.button=that.isreg?"注册":"登录"
						return that.showtop("服务器异常，请稍后重试！");
                    }else{
						return that.showtop(res.data.message);
                    }
                }).catch(err=>{
					that.loading=false;
					that.button=that.isreg?"注册":"登录"
                    that.$message({
						showClose: true,
                        message: err,
                        type: 'error',
                        duration:0
                    });
                })
             }
          },
		  showtop:function(text,classname){
			  this.logintip=true;
			  this.tiptext=text;
			  classname&&document.getElementsByClassName(classname)[0].focus();
			  return false;
		  }
        }
}
</script>
