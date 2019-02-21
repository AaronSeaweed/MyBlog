<template ref="child">
    <div class="comment-form-area displaynone">
        <div class="userpic" :style="styleObject"></div>
        <textarea placeholder="说点什么吧！" class="usercomment"></textarea>
        <div class="subcomment" id="subcomment">
            <button @click="CommitComment($event)">评论</button>
        </div>
    </div>
</template>
<script>
export default {
    data:function(){
        return{
            styleObject:{
                'background-image':localStorage.getItem("userstatus")?'url('+require('../../../view/src/assets/img/'+localStorage.getItem("photo")+'')+')':'url('+require('../../../view/src/assets/img/user.png')+')',
                'background-size':'3rem 3rem',
                'background-repeat':'no-repeat',
                'background-position': '50%'
            }
        }
    },
    methods:{
        CommitComment:function(e){//调用父组件中的评论方法
            this.$parent.CommitComment($("#subcomment button").eq($(e.target).attr("index")).attr("index"));
        },
        ArtFromUser:function(index,text){
            $("#subcomment button").eq(index).attr("index",index)
            $(".usercomment").eq(index).attr({"placeholder":"回复"+text})
        }
    },
    mounted:function(){
        
    }
}
</script>
