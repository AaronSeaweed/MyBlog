<template>
	<div>
    <div id="layout">
      <div id="blog_editormd">
        <textarea style="display: none;"></textarea>
      </div>
    </div>
		<div class="release">
			<el-button type="primary" @click="releaseArticle()">文章发布</el-button>
		</div>
	</div>
</template>

<script>
  export default {
    data() {
      return {
		blogEditor:{}
      }
    },
    methods: {
			releaseArticle:function(){
				var htmlContent = this.blogEditor.getHTML(); //获取插件生成的html代码，
				console.log(htmlContent)
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
          imageUploadURL : "",
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
    }
  }
  </script>
<style>
</style>
