<template>
  <div class="contact">
		<link rel="stylesheet" href="../components/codeView/vendor/prism.css">
		<link rel="stylesheet" href="../components/codeView/css/defult.css">	
		<!-- <style id="myStyle"></style> -->

    <Header active="contactMe"></Header>

		<el-container>
			<transition  name="fade">
				<el-row style="background: transparent">  
					<el-col :span="24" style="margin: 20px 0px 50px;">
						<h2>Contact Me</h2>
						<p>很荣幸，如果您想与我取得联系，可以扫描下方二维码，添加微信请注明来源</p>
						<p>或者您可以在下方直接给我留言～</p>
					</el-col>
					<el-col :span="10">
						<el-card class="box-card">
							<el-row style="width:100%">
								<el-col :span="12">
									<img class="left" src="../assets/img/WeChat.jpg" style="width: 85%;margin: 33px 0px;">
								</el-col>
								<el-col :span="12" style="margin-top: 60px;">
									<div class="left">
										<p><span>Email: </span>1215721423@qq.com</p>
										<p><span>WeChat: </span>ljl18252089518</p>
										<p><span>Location: </span>江苏 南京</p>
									</div>
								</el-col>
							</el-row>
							<!-- <div v-for="o in 4" :key="o" class="text item">
								{{'列表内容 ' + o }}
							</div> -->
						</el-card>
					</el-col>
					<!-- <el-col :span=""></el-col> -->
					<el-col :span="14" class="message">
						<el-form ref="form" :model="form" label-width="80px">
							<el-form-item label="">
								<el-input v-model="form.name" placeholder="Name"></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input v-model="form.eamil" placeholder="Email"></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input type="textarea" v-model="form.message" placeholder="Leave a Message"></el-input>
								<button class="msg-btn" @click="sendMsg"><i class="el-icon-s-promotion"></i></button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
				
			</transition>
		</el-container>

		<div id="box">
			<pre id="code"></pre>
		</div>

  </div>
</template>

<script src="../components/codeView/js/marked.min.js"></script>
<script src="../components/codeView/js/code.js"></script>
<script src="../components/codeView/vendor/prism.js"></script>
<script src="../components/codeView/js/main.js"></script>
<script>
import Header from '../components/Header';
import { getUserInfo } from '../api/user';
import fun1 from '../components/codeView/js/code'

export default {
  name: 'Contact',
  components: {
		Header
  },
  data () {
    return {
			user: {},
			form: {
				name: '',
				email: '',
				message: ''
			}
    }
  },
  created () {
    getUserInfo().then(res => {
      this.user = res.user
		})		
  },
  methods: {
		sendMsg: function() {
			this.$message({
				message: '留言发送成功',
				type: 'success',
				duration: 1.5 * 1000
			})
			this.$refs.form.resetFields()
		}
	},
	destroyed () {
	}
}
</script>

<style lang="scss">
	.message{
		.el-form{
			.el-input__inner,.el-textarea__inner{
				border: 0px;
				box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
				height: 50px;
				margin-bottom: 10px;
			}
			.el-textarea__inner{
				height: 135px;
			}
		}
		.msg-btn{
			position: absolute;
			top: 0;
			bottom: 10px;
			border: 0;
			background: #333;
			color: #fff;
			font-size: 24px;
			padding: 0px 18px;
			right: 0;
			cursor: pointer;
		}
	} 
	
	.fade-enter-active, .fade-leave-active {
		transition: opacity 5s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
		opacity: 0
	}
</style>

