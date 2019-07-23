<template>
<div class="header">
    <div class="menu">
    </div>
    <div class="head_menu">
        <span>老鼠会上树</span>
        <span @click="showlogin()" :class="{'displaynone':userstatus==1}" class="loginbtn" id="loginbtn">登录 |</span>
        <span @click="showreg()" :class="{'displaynone':userstatus==1}" class="regbtn" id="regbtn">注册</span>
        <div :style='styleObject' :class="{'displaynone':userstatus==0||userstatus==null}" @click="openuserinfo()" id="user"></div>
        <ul class="personalset" :class="{displaynone:persset==true}">
           <div>
               <li>
               <router-link :to="{name:'usct',params:{userid:this.userid}}" class="contitle">个人中心</router-link>
               </li>
               <li><a href="javascript:void(0)" @click="loginout()">退出</a></li>
           </div>
        </ul>
        <div class="menulist">
            <ul>
                <li><a href="../">首页</a></li>
                <li><router-link :to="{ name: 'wrae', params:{userid:this.userid}}" class="contitle">写文章</router-link></li>
                <li><a href="../page/HomePage.html">联系我</a></li>
                <li><a href="../page/HomePage.html">关于</a></li>
            </ul>
        </div>
    </div>
    <login ref="child"></login>
   </div>
</template>
<script>
import login from '../components/login.vue'
import bus from '../assets/js/eventbus.js';
import {Gb} from '../assets/js/global.js';
export default {
        data:function(){
          return{
            xslogin:false,
            userid:Gb.b64EncodeUnicode(localStorage.getItem('userid')),
			userstatus:localStorage.getItem("userstatus"),
			persset:true,
			styleObject:{
			    'background-image':localStorage.getItem("userstatus")==1?'url('+require('../../../view/src/assets/img/'+localStorage.getItem("photo")+'')+')':'url('+require('../../../view/src/assets/img/user.png')+')',
			    'background-size':'3rem 3rem',
			    'background-repeat':'no-repeat',
			    'background-position': '50%',
				'position':'absolute',
				'width': '3rem',
				'height': '3rem',
				'border-radius':'50%',
				'right': '25px',
				'top': '8px',
				'cursor': 'pointer'
			}
          }
        },
        components: {login},
        methods:{
			imgSrcFun:function(value){
				if(value){
					return require('@/assets/img/'+value);
				}else{
					return ""
				}
			},
			showlogin:function() {
				this.$refs.child.clicklogin=true
				this.$refs.child.loginmode();//调用子组件的方法
			},
			showreg:function(){
				this.$refs.child.clicklogin=true
				this.$refs.child.registeredmode();//调用子组件的方法
			},
			loginout:function(){
				localStorage.setItem("userstatus",0);
				localStorage.removeItem('username')
				localStorage.removeItem("userid");
				localStorage.removeItem("photo");
				if(location.href.indexOf("user")>-1){
					window.location.href="/"
				}else{
					location.reload();
				}
			},
			openuserinfo:function(){
				this.persset=false;
			}
        },
        mounted:function(){
             $(document).on("click",(event)=>{
                if(event.target.id!="user"){
                    this.persset=true;
                }
             });
             bus.$on("login",()=>{
                 this.$refs.child.clicklogin=true
                 this.$refs.child.loginmode();//调用子组件的方法
             })
        }
}
</script>
