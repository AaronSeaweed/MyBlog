<template v-for="(blcont,index) in this.nblists">
	<div class="conlist" :key="blcont.id">
		<div class="conbg">
			<header>
				<a href="javascript:void(0)">{{blcont.typename}}</a>
				<span class="condatetime coninfo">{{reversedMessage(blcont.datetime)}}</span>
				<span class="conviews coninfo">{{blcont.views}}次</span>
			</header>
			<div class="contitle-box">
				<router-link target="_blank" :to="{ name: 'atct', params:{conid:blcont.article_id}}" class="contitle">{{blcont.article_title}}</router-link>
			</div>
			<div class="artinfo">
				<a href="javascript:void(0)" class="coninfo concommentnum" :class="{'like-up':blcont.likeuserid&&blcont.likeuserid.split(',').indexOf(userid)>-1,'concommentnum2':wantlike===index}"
				 @click="aGood(blcont.article_id,blcont.commentnum,index,blcont.likeuserid)" @mouseover="changecolor1(index)"
				 @mouseout="changecolor2(index)">{{blcont.commentnum}}赞</a>
			</div>
			<br /><br />
		</div>
		<div class="imgbg" v-if="imgSrcFun(blcont.coverimage)">
			<img :src="imgSrcFun(blcont.coverimage)" />
		</div>
	</div>
</template>

<script>
</script>

<style>
</style>
