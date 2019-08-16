<template>
<div class="mainbox">
  <IndexHead :fixd="fixd"></IndexHead>
  <div id="app">
      <router-view @update="fixEle" />
	  <lg-preview></lg-preview>
  </div>
	<div :class="{displaynone:top,pagetop:true}" @click="pagetop">
			<img :src="require('@/assets/img/top.png')" />
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
		  fixd:false,
			top:true
	  }
  },
  name: 'App',
  components:{
    IndexHead,IndexFoot
  },
  methods: {//接受子组件修改的新值
  	fixEle(val) {
  		this.fixd=val;
  	},
		loadmoredata(){
			if ($(document).scrollTop() >  $(window).height()) {
					this.top=false;
			}else{
					this.top=true;
			}
		},
		pagetop(){
			window.scrollTo(0,0);
		}
  },
	mounted:function(){
		$(document).scroll(this.loadmoredata);
	}
}
</script>