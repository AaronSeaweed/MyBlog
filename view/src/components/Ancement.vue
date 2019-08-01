<template>
	<el-row :gutter="20" class="body_content container">
		<el-col :span="16">
			<div class="grid-content bg-purple body_left">
				<div class="anceMain">
					<img :src="require('@/assets/img/Notice.png')" />
					<h2>{{budata.ancementtitle}}</h2>
					<div class="anceContent">
						<span>
							{{budata.ancementcontent}}
						</span>
					</div>
					<div class="anceTime">
						<span>{{reversedDatetime}}</span>
						<span>站长发布</span>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="8">
			<div class="grid-content bg-purple body_right">
				<WebBulletin :scro_fixed="scro_fixed"></WebBulletin>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import WebBulletin from './WebBulletin.vue';
	export default{
		data:function(){
			return{
				budata:'',
				scro_fixed:false
			}
		},
		components: {
			WebBulletin
		},
		methods: {
			getAnnounCement(id) 
			{
				var that = this;
				that.$axios.post("/anument/getAncementCent",{id:id})
				.then(function (response) {
				    that.budata=response.data.data[0];
				})
				.catch(function (error) {
				    that.$message({
				        message: error,
				        type: 'error',
				        duration:1000
				    });
				});
			},
			
		},
		mounted:function () {
			this.getAnnounCement(this.$route.params.anid);
		},
		computed: {
			reversedDatetime: function () {
			  return new Date(new Date(this.budata.datetime).getTime()+8*60*60*1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
			}
		},
		updated:function(){
			var windowHeight=window.innerHeight-180-20;//180是页眉和页脚的高度;20是边距
			document.getElementsByClassName("anceMain")[0].style.height=windowHeight+"px"
		}
	}
</script>

