<template>
	<div class="reset-password-form">
		<div class="reset_way">
			<h3>重置密码</h3>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="邮箱重置" name="emailreset">
					<div class="emailway">
						<el-input placeholder="请输入邮箱" v-model="emilinput" clearable></el-input>
						<el-input placeholder="请输入验证码" class="check-code" clearable></el-input>
						<el-button v-if="sendstatus==0" type="primary" class="send-email" @click="sendmail">发送邮件</el-button>
						<el-button v-if="sendstatus==1" type="primary" class="send-email" disabled>{{remtime}}s后重新发送</el-button>
						<el-input placeholder="请输入新密码" show-password v-model="passwordinput" clearable></el-input>
						<el-button type="primary" class="confirm" @click="updatepw">确定</el-button>
						<a href="../">返回首页</a>
					</div>
				</el-tab-pane>
				<el-tab-pane label="手机重置" name="phonereset">
					<div class="phoneway">
						<el-input placeholder="请输入手机号" clearable></el-input>
						<el-input placeholder="请输入验证码" class="check-code"></el-input>
						<el-button type="primary" class="get-check-code">获取验证码</el-button>
						<el-input placeholder="请输入新密码" clearable></el-input>
						<el-button type="primary" class="confirm">确定</el-button>
						<a href="../">返回首页</a>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import bus from '../assets/js/eventbus.js';
export default {
	data() {
		return {
			activeName: 'emailreset',
			emilinput:"",
			passwordinput:"",
			token: localStorage.getItem("token"),
			sendstatus:0,
			remtime:60
		};
	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event);
		},
		sendmail:function(){
			var that = this;
			var EmailReg = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
			if(!EmailReg.test(that.emilinput)){
				that.$message({
					type: 'error',
					message: "邮箱格式不正确"
				});
			}else{
				that.$axios.post("/sendmail", {mail:that.emilinput})
					.then((response)=>{
						if(response.data.status==200){
							that.$message({
								type: 'success',
								message: "邮件发送成功！"
							});
							that.sendstatus=1;
							var remaining = setInterval(()=>{
								if(that.remtime>0){
									that.remtime-=1;
								}else{
									that.sendstatus=0;
									clearInterval(remaining)
								}
							},1000)
						}else{
							that.$message({
								type: 'error',
								message: response.data.message
							});
						}
					})
					.catch(function(error) {
						that.$message({
							type: 'error',
							message: error.message
						});
					});
			}
		},
		updatepw:function(){
			that.$axios.post("/user/updatepw", {phonenoemail:that.emilinput,password:that.passwordinput})
				.then((response)=>{
					if(response.data.status==200){
						that.$message({
							type: 'success',
							message: "修改成功"
						});
					}else{
						that.$message({
							type: 'error',
							message: response.data.message
						});
					}
				})
				.catch(function(error) {
					that.$message({
						type: 'error',
						message: error.message
					});
				});
		}
	},
	mounted: function() {
		
	}
};
</script>