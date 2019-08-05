<template>
<div class="header">
    <div class="menu">
    </div>
    <div :class="{head_menu:1,fixd:head_menu}">
        <span>老鼠会上树</span>
        <span @click="showlogin()" :class="{'displaynone':ustatus==1}" class="loginbtn" id="loginbtn">登录 |</span>
        <span @click="showreg()" :class="{'displaynone':ustatus==1}" class="regbtn" id="regbtn">注册</span>
        <div :style='styleObject' :class="{'displaynone':ustatus==0||ustatus==null}" @click="show1 = true" id="user"></div>
		<el-collapse-transition>
			<ul class="personalset" v-show="show1">
			   <div>
				   <li>
				   <router-link :to="{name:'usct',params:{userid:this.userid}}" class="contitle">个人中心</router-link>
				   </li>
				   <li><a href="javascript:void(0)" @click="loginout()">退出</a></li>
			   </div>
			</ul>
		</el-collapse-transition>
        <div class="menulist">
            <ul>
                <li><a href="../">首页</a></li>
                <li><router-link :to="{ name: 'wrae', params:{conid:0}}">写文章</router-link></li>
                <li><a href="../page/HomePage.html">联系我</a></li>
                <li><a href="../page/HomePage.html">关于</a></li>
            </ul>
        </div>
    </div>
    <login ref="child" :clicklogin="clicklogin"></login>
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
			ustatus:localStorage.getItem("userstatus"),
			persset:true,
			clicklogin:false,
			head_menu:true,
			styleObject:{
			    'background-image':(localStorage.getItem("userstatus")==1&&localStorage.getItem("photo")!="null")?'url('+require('../../../view/src/assets/img/'+localStorage.getItem("photo")+'')+')':'url('+require('../../../view/src/assets/img/user.png')+')',
			    'background-size':'3rem 3rem',
			    'background-repeat':'no-repeat',
			    'background-position': '50%',
				'position':'absolute',
				'width': '3rem',
				'height': '3rem',
				'border-radius':'50%',
				'right': '25px',
				'top': '8px',
				'cursor': 'pointer',
			},
			show1: false
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
			}
        },
        mounted:function(){
             $(document).on("click",(event)=>{
                if(event.target.id!="user"){
					this.show1 = false;
                }
             });
             bus.$on("login",()=>{
                 this.$refs.child.clicklogin=true
                 this.$refs.child.loginmode();//调用子组件的方法
             })
        },
		props : {
			fixd:{
				type:Boolean
			}
		},
		watch:{
			fixd: {//监听父组件数据变化更新子组件数据
			  handler (newValue, oldValue) {
				  this.head_menu=newValue;
			  }
			}
		}
}
</script>
