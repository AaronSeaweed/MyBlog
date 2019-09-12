<template>
	<ul>
		<li v-for="likelist in list" :key="likelist.id">
			<div class="likelist">
				<div class="userAvatar">
					<div class="userphoto">
						<img :src="imgSrcFun(likelist.photo)">
					</div>
					<div class="userinfo">
						<span class="username">{{likelist.username}}</span>
						<div>
							<span class="callname">{{likelist.callname}}</span>
							<span>·</span>
							<span class="created_at">{{reversedMessage(likelist.created_at)}}</span>
						</div>
					</div>
				</div>
				<div class="content-box">
					<span>
						<em>{{likelist.action|option}}了你的{{likelist.target_type|target}}:</em>
						<router-link v-if="likelist.action==1" target="_blank" :to="{ name: 'atct2', params:{conid:likelist.avatar_url}}" class="contitle">{{likelist.target_type|liketype(likelist.ctcontent,likelist.replycontent,likelist.article_title)}}</router-link>
						<router-link v-if="likelist.action==2||likelist.action==3" target="_blank" :to="{ name: 'atct2', params:{conid:likelist.avatar_url}}" class="contitle">{{likelist.action|liketype2(likelist.content,likelist.replycontent,likelist.article_title)}}</router-link>
					</span>
				</div>
			</div>
		</li>
	</ul>
</template>
<script>
	import {Gb} from '../assets/js/global.js';
	import bus from '../assets/js/eventbus.js';
	export default {
	    data: function(){
	        return{
	            token: localStorage.getItem("token"),
	            userid: localStorage.getItem("userid"),
	            list:[]
	        }
	    },
		filters:{
		    target:function (typeid) {
				if(typeid==1){
					return "文章"
				}else if(typeid==2){
					return "评论"
				}else{
					return "回复"
				}
		    },
			option:function(actionid){
				if(actionid==1){
					return "点赞"
				}else if(actionid==2){
					return "评论"
				}else{
					return "回复"
				}
			},
			liketype:function(a,b,c,d){
				if(a==1){
					return d
				}if(a==2){
					return b
				}else{
					return c
				}
			},
			liketype2:function(a,b,c,d){
				if(a==1){
					return d
				}if(a==2||a==3){
					return b
				}else{
					return c
				}
			}
		},
		methods: {
			getmsg:function(index){
				console.log(index)
				var that = this;
				var type,action;
				switch(Number(index)){
					default:
					case 0:
						type=2;
						action=2;
					break;
					case 1:
						type=2;
						action=1;
					break;
					case 2:
						type=3;
						action=4;
					break;
					case 3:
						type=1;
						action=4;
					break;
					case 4:
						type=4;
						action=4;
					break;
				}
				var submitdata={type:type,action:action,userid:that.userid,token:that.token}
				that.$axios.post('/article/getmsg', submitdata)
					.then(function(response) {
						if(response.data.status=200){
							that.list=response.data.data;
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
								type: 'error',
								message: response.data.message
							});
						}
					})
					.catch(function(error) {
						that.$message({
							type: 'error',
							message: error
						});
					});
			},
			imgSrcFun: function(value) {
				if (value) {
					return require('@/assets/img/' + value);
				} else {
					return ""
				}
			},
			reversedMessage: function(datetime) {
				return Gb.changetime(datetime);
			}
		},
		props : {
			tabindex:{
				type: Number
			}
		},
		mounted:function (){
			if(this.tabindex==0){
				this.getmsg(0);
			}
		}
	}
</script>
