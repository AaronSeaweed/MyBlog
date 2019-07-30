<template>
<div>
  <IndexHead :fixd="fixd"></IndexHead>
  <div id="app">
      <router-view @update="fixEle" />
  </div>
  <IndexFoot></IndexFoot>
</div>
</template>
<script>
import IndexHead from './components/IndexHead.vue'
import IndexFoot from './components/IndexFoot.vue'
export default {
  data:function(){
	  return{
		  fixd:false
	  }
  },
  name: 'App',
  components:{
    IndexHead,IndexFoot
  },
  methods: {//接受子组件修改的新值
  	fixEle(val) {
  		this.fixd=val;
  	}
  },
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
