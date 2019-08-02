<template>
	<div>
		<div class="artucle_title">
			<el-input v-model="conTitle" placeholder="请输入标题"></el-input>
		</div>
    <div id="layout">
      <div id="blog_editormd">
        <textarea style="display: none;" name="test-editormd-markdown-doc" id="content" v-model="AriDetail.content"></textarea>
      </div>
    </div>
		<div class="release">
			<label>
				文章标签:
			</label>
			<div>
				<div class="ari-tag">
					<el-tag :key="tag" size="medium" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model="inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput()">+ 添加标签</el-button>
				</div>
				<p>最多添加五个标签</p>
			</div>
		</div>
		<div class="release">
			<label>
				文章类别:
			</label>
			<el-select v-model="typeid" placeholder="请选择文章类别" class="sel-aritype" size="small">
				<el-option
					v-for="item in options"
					:key="item.typeid"
					:label="item.typename"
					:value="item.typeid">
				</el-option>
			</el-select>
		</div>
		<div class="release">
			<label>
				封面图片:
			</label>
			<el-upload
			  class="avatar-uploader"
			  name="editormd-image-file"
			  :action="postaction"
			  :show-file-list="false"
			  :on-success="handleAvatarSuccess"
			  :before-upload="beforeAvatarUpload">
			  <img v-if="imageUrl" :src="imageUrl" class="avatar">
			  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</div>
		<div class="release">
			<el-button type="primary" @click="releaseArticle()">文章发布</el-button>
		</div>
	</div>
</template>

<script>
	import bus from '../assets/js/eventbus.js';
  export default {
    data() {
      return {
		options: {},
		blogEditor:{},
		conTitle:"",
		typeid:"",
		dynamicTags: [],
        inputVisible: false,
        inputValue: '',
		imageUrl: '',
		coverimage:'',
		postaction:'http://localhost:3000/dataInpute?guid='+(new Date()).getTime(),
		conid:this.$route.params.conid,
		AriDetail:''
      }
    },
    methods: {
		/**
		* 绑定文章类型
		**/
		ArticleType:function(){
			var that = this;
			that.$axios.post("/article/getarticletype")
			.then(function (response) {
				response.data.data.splice(0, 1)
				response.data.data.splice(response.data.data.length-1, 1)
				that.options=response.data.data
			}).catch(function (error) {
				that.$message.error(error);
			});
		},
		/**
		* 发布文章
		**/
		releaseArticle:function(){
			var that = this;
			let userstatus = localStorage.getItem("userstatus");
			if(userstatus!=1){
				that.showlogin();
			}else{
				let conTitle = that.conTitle;
				let htmlContent = that.blogEditor.getMarkdown(); //获取插件生成的html代码
				let typeid=that.typeid;
				let userId = localStorage.getItem("userid");
				let coverimage = that.coverimage;
				let arttag = that.dynamicTags.join()
				let submitdata = {title:conTitle,content:htmlContent,contenttype:typeid,userid:userId,coverimage:coverimage,arttag:arttag};
				if(conTitle==""){
					that.$message({
							message: '标题不能为空！',
							type: 'warning',
							duration:1000
					});
					return false;
				}else if(htmlContent==""){
					that.$message({
							message: '内容不能为空！',
							type: 'warning',
							duration:1000
					});
					return false;
				}else if(typeid==""){
					that.$message({
							message: '请选择文章类型！',
							type: 'warning',
							duration:1000
					});
					return false;
				}else{
					that.$axios.post("/article/addArticle", submitdata)
					.then(function (response) {
						if(response.data.status==200){
							that.$message({
									message: '发布成功！',
									type: 'success',
									duration:1000
							});
						}else{
							that.$message({
									message: response.data.message,
									type: 'error',
									duration:1000
							});
						}
					})
					.catch(function (error) {
							that.$message({
									message: error,
									type: 'error',
									duration:1000
							});
					});
				}
			}
		},
		showlogin:function () {//与兄弟（IndexHead）组件通讯，通过eventbus.js文件让IndexHead组件执行函数
			bus.$emit("login","")
		},
		getartcontent(conid){
			var that = this;
			that.$axios.post("/article/getarticlelist",{contentid: conid})
			.then(function (response) {
				that.AriDetail=response.data.data[0];
				that.conTitle=that.AriDetail.article_title;
			}).catch(function (error) {
				that.$message.error(error);
			});
		},
		handleClose(tag,e) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			if(this.dynamicTags.length<5){//标签数少于5个时允许继续添加
				setTimeout(()=>this.handleInputConfirm(),500);
			}
		},
		showInput(e) {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm(e) {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
			if(this.dynamicTags.length==5){//限制标签数
				this.inputVisible = true;
				e.currentTarget.style.display="none";
			}
			
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			this.coverimage = res.coverimage;
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg'||'image/png'
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
			  this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
			  this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		}
    },
    created(){
      var _this = this;
      _this.$nextTick(() =>{
        const blogEditor = editormd("blog_editormd",{
          placeholder : '既然来了就写点什么吧！',
          width : "80%",
          height : "700",
          syncScrolling : "single",
          emoji :true,
          /* path : '../../../static/editor.md-master/lib/' ,*/
          path : '../static/utils/editor.md-master/lib/',
          //pluginPath:'/plugins',
          saveHTMLToTextarea : true,
          tocm : true,
          tex :true,
          flowChart : true,
          imageUpload : true,
          imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
          imageUploadURL : "http://localhost:3000/dataInpute",
          //crossDomainUpload : true
          previewTheme: "dark",
					watch: false,
					toolbar: true, 
          /**设置主题颜色*/
          /* editorTheme: "pastel-on-dark",
           theme: "gray",
           previewTheme: "dark"*/
        });
        //将刚刚定义的对象 存到vue中，用的时候再取出来
        _this.blogEditor = blogEditor;
      });
    },
		mounted:function(){
			this.ArticleType();
			if(this.conid!=0){
				this.getartcontent(this.conid)
			}
		}
  }
</script>
<style>
</style>
