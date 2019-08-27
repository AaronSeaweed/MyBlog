<template>
	<div class="emj">
		<div class="emjpkag">
			<div v-for="(img,index) in imgs" :key="index" class="emjbox" @mouseover="showcz(index)" @mouseout="showcz2()">
				<img
					 v-preview="replaceemj(img.picturename)"
					 :src="replaceemj(img.picturename)"
					 :onerror="require('@/assets/img/emj/emj404.png')"
					 :alt="img.id"
					 preview-title-enable="true"
					 preview-nav-enable="true"
					 element-loading-text="多图预警"
					 @load="loademj()"
					 >
				<transition name="el-zoom-in-bottom">
					<div v-show="index==i" class="emjsqz">
						<span :class="{'upsao2':img.likeuserid&&img.likeuserid.split(',').indexOf(userid)>-1,'upsao':1}" title="够秀" @click="showup(img.id,img.showvalue,img.likeuserid)"></span>
						<span class="saovalue">秀气值：<em>{{img.showvalue}}</em></span>
					</div>
				</transition>
			</div>
		</div>
		<div class="tip">
			<span>如有需要可随时拿去装逼，Giao！(不定时更新新图)</span>
			<el-button v-if="userid==8" @click="openMessageBox">上传表情</el-button>
		</div>
		<div class="block">
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page.sync="currentPage"
			  :page-size="pageSize"
			  layout="prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		</div>
		<transition name="el-zoom-in-center">
        <div v-show="show" class="transition-box" :style='winwidth'>
			<el-upload
				class="upload-demo"
				ref="upload"
				name="file"
				:action="postaction"
				:data="parseData"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:on-error="handleAvatarError"
				:on-change="handleChange"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload"
				:auto-upload="false">
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
			</el-upload>
		</div><!-- :headers="headers" -->
      </transition>
	</div>
</template>
<script>
	import { Loading } from 'element-ui';
	import bus from '../assets/js/eventbus.js';
	import {Gb} from '../assets/js/global.js';
	export default {
		data: function() {
			return {
				imgs: [],
				currentPage: 1,
				loadingInstance:null,
				pageNo:1,//默认第一页
				pageSize:20,//每页30条数据
				total:0,
				show:false,
				show2:false,
				parseData:{},
				postaction:'http://localhost:3000/dataInpute?imgtype=emj&token='+localStorage.getItem("token"),
				fileList:[],
				winwidth:{'left':document.body.clientWidth&&document.documentElement.clientWidth/2-150+'px'},
				userid: localStorage.getItem('userid'),
				loadcount:0,
				i:-1
			}
		},
		components: {
		},
		methods: {
			getpic:function(){
				var that = this;
				that.$axios.post("/picemj/getPictureAndEmj",{pictype:0,pageNo:that.pageNo,pageSize:that.pageSize})
				.then(function (response) {
					if(response.data.status==200){
						that.imgs=response.data.data;
						that.total=response.data.data[0].count;
					}else{
						that.$message({
						    message: response.data.message,
						    type: 'error'
						});
						that.loadingInstance.close();
					}
				})
				.catch(function (error) {
				    that.$message({
				        message: error,
				        type: 'error'
				    });
					that.loadingInstance.close();
				});
			},
			replaceemj:function(picturename){
				try{
					return require('@/assets/img/emj/' + picturename)
				}catch(err){
					return require('@/assets/img/emj/emj404.png')
				}
			},
			handleSizeChange:function(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange:function(val) {
				this.pageNo = val;
				this.getpic()
			},
			openMessageBox:function(){
				this.show=!this.show;
			},
			loademj:function(){
				this.loadcount++;
				if(this.total<=this.pageSize){
					if(this.loadcount==this.total){
						this.loadingInstance.close();
						this.loadcount=0;
					}
				}else{
					if(this.loadcount==this.pageSize){
						this.loadingInstance.close();
						this.loadcount=0;
					}
				}
			},
			showup(emjid,showvalue,likeuserid){
				var Haslike = likeuserid && likeuserid.split(',').indexOf(this.userid) > -1
				var that = this;
				var settype;
				if(Haslike==null||!Haslike){
					settype=0;
				}else{
					settype=1;
				}
				that.$axios.post("/picemj/setEmjshow",{emjid:emjid,settype:settype,showvalue:showvalue,token:localStorage.getItem("token")})
				.then(function (response) {
					if(response.data.status==522){
						that.$confirm(response.data.message+',是否重新登录?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							bus.$emit("login", "");
						});
					}else if(response.data.status==200){
						that.$axios.post('/picemj/likeEmj', {
							"emjid": emjid,
							"likeuserid": that.userid,
							"settype":settype,
							"token":localStorage.getItem("token")
						})
						.then((response) => {
							if(response.data.status==522){
								that.$confirm(response.data.message+',是否重新登录?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									bus.$emit("login", "");
								});
							}else{
								//that.blcontlist();
							}
						}).catch(function(error) {
							alert(error);
						});
					}else{
						that.$message({
						    message: response.data.message,
						    type: 'error'
						});
					}
				})
				.catch(function (error) {
				    that.$message({
				        message: error,
				        type: 'error'
				    });
				});
			},
			showcz(index){
				this.i=index;
			},
			showcz2(){
				this.i=-1;
			},
			submitUpload(res) {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleChange(file, fileList) {
				this.fileList.push(file.name);
			},
			handleAvatarSuccess(res, file) {
				if(res.status==200){
					this.getpic()
				}else if(res.status==522){
					this.$refs.upload.clearFiles();
					this.$confirm(res.message+',是否重新登录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						bus.$emit("login","")
					});
				}else{
					this.$message({
						message: res.message,
						type: 'warning',
						duration:0,
						showClose:true
					});
				}
			},
			handleAvatarError(res, file){
				this.$message({
					message: res.message,
					type: 'warning',
					duration:0,
					showClose:true
				});
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg'||'image/png'
				const isLt1M = file.size / 1024 / 1024 < 1;
				if (!isJPG) {
				  this.$message.error('上传表情图片只能是 JPG/PNG 格式!');
				}
				if (!isLt1M) {
				  this.$message.error('上传表情图片大小不能超过 1MB!');
				}
				return isJPG && isLt1M;
			}
		},
		mounted: function() {
			var that = this;
			that.loadingInstance = Loading.service({ 
				fullscreen: true,
				target: document.querySelector('#app'),
				text: '多图预警'
			});
			that.getpic();
			window.onresize = (function(){
				that.winwidth.left=document.body.clientWidth&&document.documentElement.clientWidth/2-150+'px'
			});
		},
		props: {
			
		},
		watch: {
			
		},
		updated:function(){
			var windowHeight=window.innerHeight-180-20-53;//180是页眉和页脚的高度;20是边距
			document.getElementsByClassName("emjpkag")[0].style['min-height']=windowHeight+"px"
		}
	}
</script>
