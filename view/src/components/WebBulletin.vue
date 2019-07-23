<template>
    <div id="Scro_Fixed">
            <!--选项卡-->
			<el-tabs class="webtab" v-model="activeName" >
				<el-tab-pane label="网站公告" name="first">
					<ul>
                        <li v-for="todo in budata" :key="todo.title"><a href="javascript:void(0)">{{todo.title}}</a><span>{{todo.date}}</span>
                        </li>
                        <li><a href="#" class="morebull">更多公告</a></li>
                    </ul>
				</el-tab-pane>
				<el-tab-pane label="会员中心" name="second">此功能正在努力开发中...</el-tab-pane>
				<el-tab-pane label="联系站长" name="third"><span>Email:15570733310@163.com<br/>QQ:646264198</span></el-tab-pane>
			 </el-tabs>
            <!--搜索框-->
            <div class="search">
                    <el-input
						placeholder="请输入内容"
						prefix-icon="el-icon-search"
						v-model="input2">
					</el-input>
                    <el-button type="primary">搜索</el-button>
            </div>
    </div>
</template>
<script>
export default {
    data: function(){
        return{
            budata: [{ title: "欢迎访问豆豆豆博客", date: "2016-12-16" }, { title: "在这里可以看到前端技术，后端程序，网站内容", date: "2016-12-21" }, { title: "在这个小工具中最多可以调用五条", date: "2016-12-22" }, { title: "曾经他是一个王者", date: "2017-01-11" }],
            activeName: 'first',
			input2: ''
        }
    },
	methods: {
		handleIconClick(ev) {
			console.log(ev);
		}
	}
}
</script>
