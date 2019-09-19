import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../components/HomePage.vue'
import ArticleContent from '../components/ArticleContent.vue'
import PersonalCenter from '../components/PersonalCenter.vue'
import WriteEssay from '../components/WriteEssay.vue'
import Ancement from '../components/Ancement.vue'
import Search from '../components/Search.vue'
import FightEmj from '../components/FightEmoji.vue'
import MyMessages from '../components/MyMessages.vue'
import ResetPw from '../components/ResetPw.vue'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
		path:'/',
		name: 'HomePage',
    	component: HomePage
    },{
		path:'/ArticleContent/:conid',
		name: 'atct',
		component: ArticleContent
    },{
		path:'/ArticleContent/:conid',
		name: 'atct2',
		component: ArticleContent
    },{
		path:'/user/:userid',
		name: 'usct',
		component: PersonalCenter
    },{
		path:'/Essay/:conid',
		name: 'wrae',
		component: WriteEssay
    },{
		path:'/Ancement/:anid',
		name: 'ance',
		component: Ancement
	},{
		path:'/Search/:keyword',
		name: 'sear',
		component: Search
	},{
		path:'/FightEmj',
		name: 'fjmj',
		component: FightEmj
	},{
		path:'/mymsg/:userid',
		name: 'usmsg',
		component: MyMessages
	},{
		path:'/resetpassword',
		name: 'fgpw',
		component: ResetPw
	}
  ]
})
