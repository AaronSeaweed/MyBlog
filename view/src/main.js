// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './assets/css/bootstrap.min.css'
import './assets/css/Blogs.css'
import './assets/js/jquery-1.9.1.min.js'
import router from './router'
import axios from 'axios'


Vue.config.productionTip = false

Vue.prototype.$axios = axios;
// 正式
axios.defaults.baseURL = 'http://localhost:3000';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
