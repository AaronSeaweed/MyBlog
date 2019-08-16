<template>
	<div class="header">
		<div class="menu">
		</div>
		<div :class="{head_menu:1,fixd:head_menu}">
			<a href="../" class="logo" alt="老鼠会上树"></a>
			<div class="menulist">
				<ul>
					<li><a href="../">首页</a></li>
					<li><a href="../">博客文章</a></li>
					<li v-if="userid=='OA=='">
						<router-link :to="{ name: 'wrae', params:{conid:0}}">写文章</router-link>
					</li>
					<li>
						<router-link :to="{ name: 'fjmj', params:{}}">斗图宝典</router-link>
					</li>
					<li><a href="../">美图分享</a></li>
				</ul>
			</div>
			<div class="loginmod">
				<span @click="showlogin()" v-if="ustatus!=1" :class="{'displaynone':ustatus==1}" class="loginbtn" id="loginbtn">登录</span>
				<span @click="showreg()" v-if="ustatus!=1" :class="{'displaynone':ustatus==1}" class="regbtn" id="regbtn">注册</span>
				<div :style='styleObject' :class="{'displaynone':ustatus==0||ustatus==null}" @click="show1 = true" id="user"></div>
				<el-collapse-transition>
					<ul class="personalset" v-show="show1">
						<div>
							<li>
								<router-link :to="{name:'usct',params:{userid:this.userid}}" class="setuserinfo" alt="编辑资料" title="编辑资料"></router-link>
							</li>
							<li><a href="javascript:void(0)" class="mymessage" alt="我的消息" title="我的消息"></a></li>
							<li><a href="javascript:void(0)" class="loginout" alt="退出" title="退出" @click="loginout()"></a></li>
							
						</div>
					</ul>
				</el-collapse-transition>
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
		data: function() {
			return {
				xslogin: false,
				userid: Gb.b64EncodeUnicode(localStorage.getItem('userid')),
				ustatus: localStorage.getItem("userstatus"),
				persset: true,
				clicklogin: false,
				head_menu: true,
				styleObject: {
					'background-image': (localStorage.getItem("userstatus") == 1 && localStorage.getItem("photo") != "null") ? 'url(' +
						require('../../../view/src/assets/img/' + localStorage.getItem("photo") + '') + ')' : 'url(' + require(
							'../../../view/src/assets/img/user.png') + ')',
					'background-size': '3rem 3rem',
					'background-repeat': 'no-repeat',
					'background-position': '50%',
					'position': 'absolute',
					'width': '3rem',
					'height': '3rem',
					'border-radius': '50%',
					'right': '10px',
					'top': '0px',
					'cursor': 'pointer',
					'z-index':'1000'
				},
				show1: false
			}
		},
		components: {
			login
		},
		methods: {
			imgSrcFun: function(value) {
				if (value) {
					return require('@/assets/img/' + value);
				} else {
					return ""
				}
			},
			showlogin: function() {
				this.$refs.child.clicklogin = true
				this.$refs.child.loginmode(); //调用子组件的方法
			},
			showreg: function() {
				this.$refs.child.clicklogin = true
				this.$refs.child.registeredmode(); //调用子组件的方法
			},
			loginout: function() {
				localStorage.setItem("userstatus", 0);
				localStorage.removeItem('username')
				localStorage.removeItem("userid");
				localStorage.removeItem("photo");
				localStorage.removeItem("token");
				if (location.href.indexOf("user") > -1) {
					window.location.href = "/"
				} else {
					location.reload();
				}
			},
			changecontent: function(index) {
				this.contenttypeid = index;
				this.fristload = 0;
				if (index == 5) {
					this.isnsorting = 5;
				}
				$(".contenttypemenu li").eq(index).css("color", "#3399CC").siblings().css("color", "black");
				this.blcontlist();
			}
		},
		mounted: function() {
			$(document).on("click", (event) => {
				if (event.target.id != "user") {
					this.show1 = false;
				}
			});
			bus.$on("login", () => {
				this.$refs.child.clicklogin = true
				this.$refs.child.loginmode(); //调用子组件的方法
			})
		},
		props: {
			fixd: {
				type: Boolean
			}
		},
		watch: {
			fixd: { //监听父组件数据变化更新子组件数据
				handler(newValue, oldValue) {
					this.head_menu = newValue;
				}
			}
		}
	}
</script>
