<template ref="child">
    <div class="comment-form-area">
        <div class="userpic"></div>
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
