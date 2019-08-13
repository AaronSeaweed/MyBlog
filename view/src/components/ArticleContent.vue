<template>
	<el-row :gutter="20" class="body_content container">
		<el-col :span="16" class="art_style">
			<div class="body_left">
				<loading v-if="loadinggif"></loading>
				<template v-for="(aridetail) in this.AriDetail">
					<div :key="aridetail.article_id">
						<article id="artContent">
							<h3>{{aridetail.article_title}}</h3>
							<p>{{reversedMessage(aridetail.datetime)}}发布，{{aridetail.artviewcount}}次阅读，归类于<a href="javascript:void(0)">
									{{aridetail.typename}}</a></p>
							<p>本文可全文转载，但需要同时保留原作者和出处。</p><br />
							<p class="aricon" id="aridetailCon"><img :src="imgSrcFun(aridetail.coverimage)"><br><br><br><textarea style="display:none;"
								 name="test-editormd-markdown-doc">{{aridetail.content}}</textarea> </p>
						</article>
						<div class="comment-foot">
							<ul>
								<template v-for="(tag,index) in aridetail.arttag?aridetail.arttag.split(','):[]">
									<li :key="index">
										<a>{{tag}}</a>
									</li>
								</template>
							</ul>
						</div>
					</div>
				</template>
				<div class="comment-box">
					<div class="comment-title">
						评论
					</div>
					<div class="comment-form">
						<div class="comment-form-panel">
							<span>你有什么想说的吗？</span>
							<button class="comment-login" @click="showlogin()">登录</button>
						</div>
						<CommentPanel ref="child" v-on:commitcomment="commitcomment"></CommentPanel>
					</div>
					<ul class="comment-list">
						<template v-for="(comlist,index) in this.comments[0]">
							<li :key="index">
								<div class="comment">
									<div class="userAvatar">
										<a>
											<div class="lazy avatar avatar loaded" :style="imgUrlFun(comlist.photo)"></div>
										</a>
									</div>
									<div class="content-box">
										<div class="content-opt">
											<div class="content-header">
												<div class="user-info">
													<div class="user-Avatar-box"><a class="username">{{comlist.Uname}}</a></div>
													<div class="position">{{comlist.callname || ""}}</div>
												</div>
											</div>
											<div class="content">
												<span class="content-html">{{comlist.content}}</span>
											</div>
											<div class="content-foot">
											<div class="like-btn" @click="aGood(0,comlist.id,comlist.up,comlist.likeuserid)">
												<span :class="{'like-up':comlist.likeuserid&&comlist.likeuserid.split(',').indexOf(userid)>-1,'rephover':wantlike===index+'f'}"
												 @mouseover="changecolor1(index+'f')" @mouseout="changecolor2(index+'f')">
													{{comlist.up}}
												</span>
											</div>
											<div :class='classObj(comlist.Uname)'>
												<span class="title" :replytype="0" :artid="comlist.id">回复</span>
											</div>
											<div :class='classObj(comlist.Uname,"del")'>
												<span class="del-title" @click="delcom(comlist.id,0)" :replytype="0" :artid="comlist.id">删除</span>
											</div>
											<span class="replydate">{{reversedMessage(comlist.date)}}</span>
										</div>
										</div>
										<CommentPanel ref="child" v-on:commitcomment="commitcomment"></CommentPanel>
										<div class="replylist">
											<template v-for="(replylist,index2) in getReplysList(comlist.id)">
												<div :key="index2">
													<div class="reply">
														<div class="comment">
															<div class="userAvatar">
																<a>
																	<div class="lazy avatar avatar loaded" :style="imgUrlFun(replylist.photo)"></div>
																</a>
															</div>
															<div class="content-box">
																<div class="content-opt">
																	<div class="content-header">
																		<div class="user-info">
																			<div class="user-Avatar-box"><a class="username">{{replylist.username}}</a></div>
																			<div class="position">{{replylist.callname || ""}}</div>
																		</div>
																	</div>
																	<div class="content">
																		<span class="content-html">回复&nbsp;<a class="content-user" href="javascript:void(0)">{{getname(replylist.artid)}}</a>：{{replylist.replycontent}}</span>
																	</div>
																	<div class="content-foot">
																	<div class="like-btn" @click="aGood(1,replylist.replyid,replylist.replyup,replylist.likeuserid)">
																		<span :class="{'like-up':replylist.likeuserid&&replylist.likeuserid.split(',').indexOf(userid)>-1,'rephover':wantlike===index+index2+1}"
																		 @mouseover="changecolor1(index+index2+1)" @mouseout="changecolor2(index+index2+1)">
																			{{replylist.replyup}}
																		</span>
																	</div>
																	<div :class='classObj(replylist.username)'>
																		<span class="title" :replytype="1" :artid="replylist.replyid">回复</span>
																	</div>
																	<div :class='classObj(replylist.username,"del")'>
																		<span class="del-title" @click="delcom(replylist.replyid,1)" :replytype="1" :artid="replylist.replyid">删除</span>
																	</div>
																	<span class="replydate">{{reversedMessage(replylist.replydate)}}</span>
																</div>
																</div>
																<CommentPanel ref="child" v-on:commitcomment="commitcomment"></CommentPanel>
															</div>
														</div>
													</div>
													<!-- <div class="fetch-more" v-if="index2==1"><a href="javascript:void(0)">加载更多</a></div> -->
												</div>
											</template>
										</div>
									</div>
								</div>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</el-col>
		<el-col :span="8">
			<div class="body_right">
				<div class="emptyPlace art_style">
					这就是一个用来撑高度的容器
				</div>
				<div class="relatedArt art_style">
					<div class="relatedArt-title">相关文章</div>
					<div class="relatedArt-body"></div>
				</div>
			</div>
		</el-col>
	</el-row>
</template>
<script>
	import {Gb} from '../assets/js/global.js';
	import bus from '../assets/js/eventbus.js';
	import CommentPanel from './CommentPanel.vue';
	import Loading from './loading.vue';
	export default {
		data: function() {
			return {
				comments: [],
				AriDetail: [],
				replys: [],
				replysubmit: [],
				replycount: 0,
				uname: localStorage.getItem("username"),
				aridetailContent: "",
				userstatus: localStorage.getItem("userstatus"),
				userid: localStorage.getItem("userid"),
				wantlike: "",
				loadinggif:true,
				token: localStorage.getItem("token")
			}
		},
		wacth: {
			replycount: function() {
				alert(this.replycount)
			}
		},
		components: {
			CommentPanel,
			Loading
		},
		methods: {
			imgSrcFun: function(value) {
				if (value) {
					return require('@/assets/img/' + value);
				} else {
					return ""
				}
			},
			imgUrlFun:function(value){
				if (value) {
					return {'background': 'url("'+require('@/assets/img/' + value)+'")'};
				} else {
					return {'background': 'url("'+require('@/assets/img/user.png')+'")'}
				}
			},
			classObj: function(name, op) {
				if (name == this.uname) {
					return op ? "sub-comment-btn text-pointer" : "displaynone sub-comment-btn text-pointer"
				} else {
					return op ? "displaynone sub-comment-btn text-pointer" : "sub-comment-btn text-pointer"
				}
			},
			delcom: function(id, replytype) { //删除评论/回复
				var that = this;
				that.$confirm('你确定要删除这条评论吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$axios.post("/article/delDiscuss", {
							"id": id,
							"replytype": replytype,
							"token":that.token
						})
						.then((response) => {
							if (response.data.status == 200) {
								that.$message({
									type: 'success',
									message: '删除成功!'
								});
								that.getcomment();
							}else if(response.data.status==522){
								that.$confirm(response.data.message+',是否重新登录?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									bus.$emit("login", "");
								});
							}else {
								that.$message({
									type: 'error',
									message: response.data.message
								});
							}
						}).catch(function(error) {
							that.$message({
								type: 'error',
								message: error
							});
						});
				}).catch(() => {})
			},
			toHtml: function() {
				var testEditormdView2 = editormd.markdownToHTML("aridetailCon", {
					htmlDecode: "style,script,iframe", // you can filter tags decode
					emoji: true,
					taskList: true,
					tex: true, // 默认不解析
					flowChart: true, // 默认不解析
					sequenceDiagram: true, // 默认不解析
				});
			},
			getcomment: function() { //获取文章详情、评论列表、回复列表
				var that = this;

				function getArticleList() {
					return that.$axios.post('/article/getarticlelist', {
						contentid: that.$route.params.conid
					});
				}

				function getCommentList() {
					return that.$axios.post('/article/getcommentlist', {
						contentid: that.$route.params.conid
					});
				}

				function getReplyList() {
					return that.$axios.post('/article/getreplylist', {
						contentid: that.$route.params.conid
					});
				}
				return that.$axios.all([getArticleList(), getCommentList(), getReplyList()])
					.then(that.$axios.spread(function(articlelist, commentlist, replylist) {
						that.AriDetail = [];
						that.comments = [];
						that.replys = [];
						that.AriDetail.push(articlelist.data.data[0]);
						that.comments.push(commentlist.data.data);
						that.replys.push(replylist.data.data);
						document.getElementsByTagName("title")[0].text=that.AriDetail[0].article_title;
						that.loadinggif=false;
					})).catch(function(error) {
						that.$message({
							type: 'error',
							message: error
						});
					});;
			},
			showlogin: function() { //与兄弟（IndexHead）组件通讯，通过eventbus.js文件让IndexHead组件执行函数
				bus.$emit("login", "")
			},
			reversedMessage: function(datetime) {
				return Gb.changetime(datetime);
			},
			commitcomment: function(index) { //新增评论
				var that = this;
				var commentcontent = $(".usercomment").eq(index).val() || $(".usercomment").eq(0).val();
				if (commentcontent.trim() == "") {
					that.$message({
						type: 'error',
						message: '内容不能为空'
					});
				} else {
					var nowdate = Gb.getDate(); //获取当前时间
					var userid = localStorage.getItem("userid");
					var submitdata = {
						artid: that.replysubmit.artid,
						replyusername: userid,
						replycontent: commentcontent,
						replyup: 0,
						replydate: nowdate,
						replytype: that.replysubmit.replytype,
						token:that.token
					}
					var posturl = '/article/commitreply';
					if (index == undefined) {
						commentcontent = $(".usercomment").eq(0).val();
						submitdata = {
							username: userid,
							content: commentcontent,
							up: 0,
							date: nowdate,
							contentid: that.$route.params.conid,
							token:that.token
						}
						posturl = '/article/commitcontent';
					}
					that.$axios.post(posturl, submitdata)
						.then(function(response) {
							if(response.data.status=200){
								if (index == undefined) {
									$(".usercomment").eq(0).val("");
								} else {
									$(".usercomment").eq(index).val("");
								}
								that.getcomment();
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
				}
			},
			getReplysList: function(id) {
				var that = this;
				var nowreplys = []
				for (var i = 0; i < that.replys[0].length; i++) {
					if (that.replys[0][i]["replytype"] == 0) {
						if (that.replys[0][i]["artid"] == id) {
							nowreplys.push(that.replys[0][i])
						}
					}
				}
				for (var n = 0; n < that.replys[0].length; n++) {
					for (var j = 0; j < nowreplys.length; j++) {
						if (that.replys[0][n]["artid"] == nowreplys[j]["replyid"]) {
							nowreplys.push(that.replys[0][n])
						}
					}
				}
				nowreplys.sort(function(a, b) { //按时间排序显示回复
					if (a.replydate > b.replydate) {
						return 1;
					} else {
						return -1;
					}
				});
				that.replycount = nowreplys.length;
				//if(nowreplys.length>2){//超过两条回复只显示两条
				//    return nowreplys.slice(0,2);
				//}else{
				return nowreplys;
				//}
			},
			getname: function(artid) {
				var that = this;
				for (var i = 0; i < that.replys[0].length; i++) {
					if (that.replys[0][i]["replyid"] == artid) {
						return that.replys[0][i]["username"]
					}
				}
				for (var y = 0; y < that.comments[0].length; y++) {
					if (that.comments[0][y]["id"] == artid) {
						return that.comments[0][y]["Uname"]
					}
				}

			},
			ReplyArt: function(index, text) {
				if (this.userstatus != 1) {
					this.showlogin();
				} else {
					if (text != undefined) {
						$(".comment-form-area").eq(index + 1).css({
							"display": "block"
						}).end().not($(".comment-form-area").eq(index + 1)).not($(".comment-form-area").eq(0)).css({
							"display": "none"
						})
						$(".comment-form-area").eq(index + 1).children(1).focus()
						this.$refs.child[0].ArtFromUser(index + 1, text);
					} else {
						$(".comment-form-area").eq(index + 1).css({
							"display": "none"
						})
					}

				}
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
			},
			aGood: function(replytype, id, num, likeuserid) {
				var that = this;
				var likedown;
				var poturl;
				var Haslike = likeuserid && likeuserid.split(',').indexOf(that.userid) > -1
				if (this.userstatus != 1) {
					this.showlogin();
				} else {
					if (Haslike) {
						likedown = true;
						poturl = "/article/cancel_CommLikeRecording"
					} else {
						likedown = false
						poturl = "/article/like_CommRecording"
					}

					this.$axios.post("/article/thumb-CommUp", {
						"id": id,
						"commentnum": num,
						"likedown": likedown,
						"replytype": replytype,
						"token":that.token
					})
					.then((response) => {
						if(response.data.status==522){
							that.$confirm(response.data.message+',是否重新登录?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								that.showlogin();
							});
						}else{
							that.$message({
								type: 'error',
								message: response.data.message
							});
						}
					}).catch(function(error) {
						that.$message({
							type: 'error',
							message: error
						});
					});
					this.$axios.post(poturl, {
						"id": id,
						"likeuserid": that.userid,
						"replytype": replytype,
						"token":that.token
					})
					.then((response) => {
						if(response.data.status=200){
							that.getcomment();
						}else if(response.data.status==522){
							that.$confirm(response.data.message+',是否重新登录?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								that.showlogin();
							});
						}else{
							that.$message({
								type: 'error',
								message: response.data.message
							});
						}
					}).catch(function(error) {
						that.$message({
							type: 'error',
							message: error
						});
					});
				}
			},
			getviewrecord:function(){
				var userip=localStorage.getItem("userip")||"0.0.0.0";
				this.$axios.post("/article/getviewrecord", {userip:userip,artid:this.$route.params.conid})
					.then((response)=>{
						if(response.data.status==200){
							if(response.data.data[0].count==0){
								this.addviewrecord()
							}
						}
						//that.getcomment();
					})
					.catch(function(error) {
						//alert(error);
					});
			},
			addviewrecord:function(){
				var userip=localStorage.getItem("userip")||"0.0.0.0";
				this.$axios.post("/article/addviewrecord", {userip:userip,artid:this.$route.params.conid})
					.then(function(response) {
						//if(response.data.status==200){
							//that.getcomment();
						//}
					})
					.catch(function(error) {
						//alert(error);
					});
			}
		},
		mounted: function() {
			var that = this;
			if (that.userstatus == 1) {
				$(".comment-form-panel").css("display", "none");
				$(".comment-form-area").eq(0).show();
			}
			async function gcent() {
				await that.getcomment(that.$route.params.conid);
			}
			gcent().then(function() {
				var child = document.getElementsByClassName("title");
				var childcomment = document.getElementsByClassName("comment-form-area");
				var timer = null;
				var blurobj = null;
				for (var i = 0; i < child.length; i++) {
					//childcomment[i+1].style.display="none"
					var a = child[i];
					a.index = childcomment[i + 1].children[1].index = i; //给每个className为child的元素添加index属性;
					a.onclick = function() {
						blurobj = this; //记录当前回复框对象
						clearTimeout(timer);
						that.replysubmit = []
						that.replysubmit.replytype = child[this.index].getAttribute("replytype");
						that.replysubmit.artid = child[this.index].getAttribute("artid");
						that.ReplyArt(this.index, child[this.index].parentNode.parentNode.parentNode.children[0].children[0].children[0].innerText)
					}
					childcomment[i + 1].children[1].onblur = function() {
						timer = setTimeout(function() {
							that.ReplyArt(blurobj.index)
						}, 220);
					}
				}
				that.toHtml();
			})
			this.getviewrecord();
		}
	}
</script>
