<template>
    <div id="Scro_Fixed">
            <!--选项卡-->
            <div id="tab">
                <div class="tabList">
                    <ul>
                        <li class="cur">网站公告</li>
                        <li>会员中心</li>
                        <li>联系站长</li>
                        <li></li>
                    </ul>
                </div>
                <div class="tabCon">
                    <div class="cur" id="Bulletin">
                        <ul>
                            <li v-for="todo in budata" :key="todo.title"><a href="javascript:void(0)">{{todo.title}}</a><span>{{todo.date}}</span>
                            </li>
                            <li><a href="#" class="morebull">更多公告</a></li>
                        </ul>
                    </div>
                    <div id="MemberCentre">
                        此功能正在努力开发中...
                    </div>
                    <div id="ContactWeb">
                        <span>Email:15570733310@163.com<br/>QQ:646264198</span>
                    </div>
                    <div></div>
                </div>
            </div>
            <!--搜索框-->
            <div class="search">
                <div class="inpout_container">
                    <input type="text" id="ss" placeholder="请输入关键字"/>
                    <button type="submit">搜索</button>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    data: function(){
        return{
            budata: [{ title: "欢迎访问豆豆豆博客", date: "2016-12-16" }, { title: "在这里可以看到前端技术，后端程序，网站内容", date: "2016-12-21" }, { title: "在这个小工具中最多可以调用五条", date: "2016-12-22" }, { title: "曾经他是一个王者", date: "2017-01-11" }]
        }
    }
}
</script>
