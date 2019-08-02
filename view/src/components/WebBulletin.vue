<template>
    <div id="Scro_Fixed" :class="{'scro_fixed':scro_}">
        <!--选项卡-->
		<el-tabs class="webtab" v-model="activeName" >
			<el-tab-pane label="网站公告" name="first">
				<ul>
                    <li v-for="todo in budata" :key="todo.title">
						<router-link :to="{ name: 'ance', params:{anid:todo.id}}" @click.native="$router.go(0)" class="contitle" :title="todo.ancementtitle">{{todo.ancementtitle}}</router-link>
						<span>{{new Date(new Date(todo.datetime).getTime()+8*60*60*1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')}}</span>
                    </li>
                    <li><a href="#" class="morebull">更多公告</a></li>
                </ul>
			</el-tab-pane>
			<el-tab-pane label="会员中心" name="second">此功能正在努力开发中...</el-tab-pane>
			<el-tab-pane label="联系站长" name="third">
				<img :src="require('@/assets/img/wxQRcode.png')" />
			</el-tab-pane>
		 </el-tabs>
        <!--搜索框-->
        <div class="search">
                <el-input
					placeholder="请输入内容"
					prefix-icon="el-icon-search"
					v-model="input2"
					>
					{{input2}}
				</el-input>
                <el-button type="primary" @click="SearchArt()">搜索</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data: function(){
        return{
            budata:'',
            activeName: 'first',
			input2:'',
			scro_:'',
			//[{ title: "欢迎访问豆豆豆博客", date: "2016-12-16" }, { title: "在这里可以看到前端技术，后端程序，网站内容", date: "2016-12-21" }, { title: "在这个小工具中最多可以调用五条", date: "2016-12-22" }, { title: "曾经他是一个王者", date: "2017-01-11" }]
        }
    },
	methods: {
		getAnnounCement() {
			var that = this;
			that.$axios.post("/anument/getAncementList")
			.then(function (response) {
			    that.budata=response.data.data;
			})
			.catch(function (error) {
			    that.$message({
			        message: error,
			        type: 'error',
			        duration:1000
			    });
			});
		},
		SearchArt(){
			this.$router.push({name: 'sear',params: {keyword:this.input2} })
		}
	},
	props : {
		scro_fixed:{
			type:Boolean
		},
	},
	watch:{
		scro_fixed: {//监听父组件数据变化更新子组件数据
			handler (newValue, oldValue) {
			  this.scro_=newValue;
			}
		},
		keyword:{
			handler (newValue, oldValue) {
			  this.input2=newValue;
			}
		},
		'$route' (to, from) {
			this.$router.go(0);   
		}
	},
	mounted:function (){
		this.getAnnounCement();
	}
}
</script>
