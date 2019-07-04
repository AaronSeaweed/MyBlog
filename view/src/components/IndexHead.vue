<template>
<div class="header">
    <div class="menu">
    </div>
    <div class="head_menu">
        <span>老鼠会上树</span>
        <span></span>
        <span @click="showlogin()" id="loginbtn">登录 |</span>
        <span @click="showreg()" id="regbtn">注册</span>
        <i></i>
        <span id="username"></span>
        <ul class="personalset">
           <div>
               <li>
               <router-link :to="{ name: 'usct', params:{userid:this.userid}}" class="contitle">个人中心</router-link>
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
            userid:Gb.b64EncodeUnicode(localStorage.getItem('userid'))
          }
        },
        components: {
             login
        },
        methods:{
          showlogin() {
            this.$refs.child.clicklogin=true
            this.$refs.child.loginmode();//调用子组件的方法
          },
          showreg(){
           this.$refs.child.clicklogin=true
           this.$refs.child.registeredmode();//调用子组件的方法
          },
          loginout(){
            localStorage.setItem("userstatus",0);
            localStorage.removeItem('username')
            localStorage.removeItem("userid");
            window.location.href="/"
          }
        },
        mounted:function(){
             var userstatus = localStorage.getItem("userstatus");
             if(userstatus==1){
                $("#loginbtn,#regbtn,.comment-form-panel").css("display","none");
                $("#username").show().text(localStorage.getItem("username"));
                $(".comment-form-area").show();
                $(".userpic").css("background-image",localStorage.getItem("photo"))
             }
             $("#username").on("click",function(){
                $(".personalset").show();
             });
             $(document).on("click",function(event){
                if(event.target.id!="username"){
                    $(".personalset").hide();
                }
             });
             var that=this;
             bus.$on("login",function(){
                 that.$refs.child.clicklogin=true
                 that.$refs.child.loginmode();//调用子组件的方法
             })
        }
}
</script>
