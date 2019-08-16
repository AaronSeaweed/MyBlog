<template>
	<div class="emj">
		<div class="emjpkag">
			<img v-for="(img,index) in imgs"
				 v-preview="require('@/assets/img/emj/' + img.picturename)"
				 :src="require('@/assets/img/emj/' + img.picturename)"
				 :alt="img.id"
				 :key="index"
				 preview-title-enable="true"
				 preview-nav-enable="true"
				 v-loading="loading2"
				 element-loading-text="多图预警"
				 >
		</div>
		<div class="tip">
			<span>如有需要可随时拿去装逼，Giao！(不定时更新新图)</span>
		</div>
		<div class="block">
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page.sync="currentPage"
			  :page-size="24"
			  layout="prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import { Loading } from 'element-ui';
	export default {
		data: function() {
			return {
				imgs: [],
				loading2: true,
				currentPage: 1,
				loadingInstance:null,
				pageNo:1,//默认第一页
				pageSize:24,//每页30条数据
				total:0
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
						    type: 'error',
						    duration:1000
						});
						that.loadingInstance.close();
					}
				})
				.catch(function (error) {
				    that.$message({
				        message: error,
				        type: 'error',
				        duration:1000
				    });
					that.loadingInstance.close();
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getpic()
			}
		},
		mounted: function() {
			this.loadingInstance = Loading.service({ 
				fullscreen: true,
				target: document.querySelector('#app'),
				text: '多图预警'
			});
			setTimeout(()=>{this.loadingInstance.close()},3000)
			this.getpic();
		},
		props: {
			
		},
		watch: {
			
		},
		updated:function(){
			var windowHeight=window.innerHeight-180-20-42;//180是页眉和页脚的高度;20是边距
			document.getElementsByClassName("emjpkag")[0].style['min-height']=windowHeight+"px"
		}
	}
</script>
