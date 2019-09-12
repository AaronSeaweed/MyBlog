<template>
	<el-row :gutter="20" class="body_content container">
		<el-col :span="24">
			<div class="body_right">
				<div class="msglist">
					<el-tabs :tab-position="tabPosition" @tab-click="handleClick">
						<template  v-for="(msgtype,index) in [{name:'评论'},{name:'点赞'},{name:'私信'},{name:'公告'},{name:'系统通知'}]">
							<el-tab-pane :label="msgtype.name" :key="index">
								<MessageList ref="child" :tabindex="index"></MessageList>
							</el-tab-pane>
						</template>
					</el-tabs>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import MessageList from './MessageList.vue';
	export default {
		data: function() {
			return {
				tabPosition:'left',
				tabindex:"0"
			}
		},
		components:{
			MessageList
		},
		methods: {
			handleClick:function(tab, event){
				this.$refs.child[tab.index].getmsg(tab.index)
			}
		},
		mounted: function() {
			var windowHeight=window.innerHeight-180-20;//180是页眉和页脚的高度;20是边距
			document.getElementsByClassName("msglist")[0].style.height=windowHeight+"px"
			//this.getmsg();
		}
	}
</script>
