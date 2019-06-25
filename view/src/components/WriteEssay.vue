<template>
	<div>
		<div class="artucle_title">
			<el-input v-model="conTitle" placeholder="请输入标题"></el-input>
		</div>
    <div id="layout">
      <div id="blog_editormd">
        <textarea style="display: none;"></textarea>
      </div>
    </div>
		<div class="release">
			<el-select v-model="typeid" placeholder="请选择文章类别">
				<el-option
					v-for="item in options"
					:key="item.typeid"
					:label="item.typename"
					:value="item.typeid">
				</el-option>
			</el-select>
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
				typeid:""
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
					let conTitle=this.conTitle;
					let htmlContent = this.blogEditor.getMarkdown(); //获取插件生成的html代码
					let typeid=that.typeid;
					let userId=localStorage.getItem("userid");
					let submitdata={title:conTitle,content:htmlContent,contenttype:typeid,userid:userId};
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
		}
  }
</script>
<style>
</style>
