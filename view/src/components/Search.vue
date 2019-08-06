<template>
	<el-row :gutter="20" class="body_content container">
		<el-col :span="16">
			<div class="grid-content bg-purple body_left">
				<div class="SeaMain">
					<template v-for="(todo,index) in budata">
						<div class="conlist" :key="todo.article_id">
							<div class="conbg">
								<header>
									<a href="javascript:void(0)">{{todo.typename}}</a>
									<span class="condatetime coninfo">{{reversedMessage(todo.datetime)}}</span>
									<span class="conviews coninfo">{{todo.views}}次</span>
								</header>
								<div class="contitle-box">
									<router-link v-html="makekeyword(todo.article_title)" target="_blank" :to="{ name: 'atct', params:{conid:todo.article_id}}" class="contitle">{{makekeyword(todo.article_title)}}</router-link>
									<span v-html="makekeyword(todo.content)">{{makekeyword(todo.content)}}</span>
								</div>
								<div class="artinfo">
									<a href="javascript:void(0)" class="coninfo concommentnum" :class="{'like-up':todo.likeuserid&&todo.likeuserid.split(',').indexOf(userid)>-1,'concommentnum2':wantlike===index}"
									 @click="aGood(todo.article_id,todo.commentnum,index,todo.likeuserid)" @mouseover="changecolor1(index)"
									 @mouseout="changecolor2(index)">{{todo.commentnum}}赞</a>
								</div>
							</div>
						</div>
					</template>
					<img v-if="budata==''" :src="require('@/assets/img/nodata.jpg')"/>
				</div>
			</div>
		</el-col>
		<el-col :span="8">
			<div class="grid-content bg-purple body_right">
				<WebBulletin :keyword="keyword"></WebBulletin>
			</div>
		</el-col>
	</el-row>
</template>
<script>
	import WebBulletin from './WebBulletin.vue';
	import {Gb} from '../assets/js/global.js'
	export default{
		data:function(){
			return{
				budata:'',
				scro_fixed:false,
				userid: localStorage.getItem("userid"),
				wantlike: "",
				keyword:""
			}
		},
		components: {
			WebBulletin
		},
		methods: {
			getAnnounCement:function() 
			{
				var that = this;
				that.$axios.post("/article/getsearchContent",{keyword:this.keyword})
				.then(function (response) {
					if(response.data.data.length>0){
						that.budata=response.data.data;
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
			makekeyword:function(words){
				var patt = /<[^>]+>/g;
				var newStr = words.replace(patt, '');//过滤html标签
				var keywordindex = newStr.indexOf(this.keyword);
				if(keywordindex>-1){
					var spstr=["#","*","。","!","?","？","！","...","\n"]//根据特殊字符提取一段完整字符串
					for(var i = keywordindex;i<newStr.length;i++){
						if(spstr.indexOf(newStr[i])>-1){
							newStr=newStr.substring(0,i)
							break;
						}
					}
					for(var i = keywordindex;i>0;i--){
						if(spstr.indexOf(newStr[i])>-1){
							newStr=newStr.substring(i+1,newStr.length)
							break;
						}
					}
				}
				var newword=newStr.replace(this.keyword,"<em>"+this.keyword+"</em>")//在完整字符串中将关键字设置高亮
				return newword;
			},
			reversedMessage: function(datetime) {
				return Gb.changetime(datetime);
			},
			changecolor1: function(index) {
				if (this.like === "" || this.like !== index) {
					this.wantlike = index;
				}
			},
			changecolor2: function(index) {
				if (this.like === "" || this.like !== index) {
					this.wantlike = "";
				}
			}
		},
		mounted:function () {
			this.keyword = this.$route.params.keyword;
			this.getAnnounCement();
		},
		computed: {
			
		},
		updated:function(){
			var windowHeight=window.innerHeight-180-20;//180是页眉和页脚的高度;20是边距
			document.getElementsByClassName("SeaMain")[0].style.height=windowHeight+"px"
		}
	}
</script>
