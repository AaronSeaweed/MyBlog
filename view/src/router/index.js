import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../components/HomePage.vue'
import ArticleContent from '../components/ArticleContent.vue'
import PersonalCenter from '../components/PersonalCenter.vue'
import WriteEssay from '../components/WriteEssay.vue'
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
      path:'/Essay/:userid',
      name: 'wrae',
      component: WriteEssay
    }
  ]
})
