<template>
  <!-- @select="handleSelect" -->
	<div>
		<el-menu
			:router=true
			:default-active="active"
			@select="handleSelect"
			class="el-menu-demo"
			mode="horizontal"
			background-color="#333"
			active-text-color="#ff4f6b">
			<el-menu-item index="index">主页</el-menu-item>
			<el-menu-item index="push" :disabled="!user">发表</el-menu-item>
			<el-menu-item index="contactMe">联系我</el-menu-item>
			<el-menu-item style="float:right;margin-right: 15px;">
					<!-- <el-badge :value="noticeList.length" :max="10" class="item"> -->
						<i @click="drawer = true" class="el-icon-message-solid" style="font-size: 22px;"></i>
						 <el-badge class="mark" :value="12" />
					<!-- </el-badge> -->
				</el-menu-item >	
			<el-submenu index='4' style="float:right" v-if="user">
				<template slot="title">Hello {{ ', '+user.name }}</template>
				<el-menu-item @click="logout">退出登陆</el-menu-item>
				<el-menu-item>消息</el-menu-item>
			</el-submenu>
			<el-menu-item v-if="!user" index="login" style="float:right">登陆</el-menu-item>
		</el-menu>
		<!-- 通知消息 -->
		<el-drawer
			title="通知消息"
			:visible.sync="drawer"
			size="26%"
			:with-header="false"
			:before-close="handleClose">
			<!-- <h3>消息通知</h3> -->
			<el-card shadow="hover">
				鼠标悬浮时显示
			</el-card>
			<el-card shadow="hover">
				鼠标悬浮时显示
			</el-card>
		</el-drawer>
	</div>
</template>
<!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
<script>
import { logout,getUserInfo } from '../api/user'
export default {
  name: 'Header',
  data () {
    return {
      user: window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')) : null,
      activeIndex: 'index',
			msg: 'Welcome to Your Vue.js App',
			noticeList: [],
			drawer: false
			// active,
    }
	},
	props: {
		active: String
	},
  created() {
		// debugger
		// console.log(this.active)
    // getUserInfo().then(res => {
    //   this.user = res.user
    // })
	},
	mounted() {
		if(this.user){
			// 1. 与服务器端建立连接 （筛选已登陆用户） 链接建立场景：1. 用户发表评论，2.用户发表文章 3.消息推送  返回场景： header中统一获取？
			const socket = io.connect("http://localhost:3389");
			// 获取输入的信息
			let data = this.user;
			// 向服务器端发起连接
			socket.emit("connectToServer", data);
			// 3. 获取服务端发送过来的信息
			socket.on("sendToClient", message => {
				this.noticeList.push(message)
				console.log("this.noticeList: ",this.noticeList);
			});
			/**
			 * 发布订阅(广播), 一端发布, 可以让多端触发
			 */
		}
		
	},
  methods: {
		handleClose(done) {
			//清空消息
			this.noticeList = [];
			done()
		},
		handleSelect(key, keyPath) {
			// this.activeIndex = key
			console.log(key, keyPath);
		},
    logout() {
      this.$confirm('确定登出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout().then(res => {
          // this.$notify({
          //   title: '成功',
          //   message: '登出成功',
          //   type: 'success'
					// });
					this.$message({
						message: '登出成功',
						duration: 2 * 1000,
						type: 'success'
					});
					window.sessionStorage.setItem('user',null)
					this.user = null
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消登出'
        });          
      });
      
    }
  }
}
</script>
<!-- <style type="text/css" src="../assets/css/resset.css"></style>  -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	.el-badge__content{
		position: absolute;
    top: -22px;
    width: 22px;
    height: 14px;
    line-height: 14px;
    left: -8px;
    padding: 0px;
	}
	.el-drawer__open .el-drawer.rtl{
		background-color: #f4f5f5!important;
	}
	.el-drawer{
		.el-drawer__body{
			padding: 0px 15px;
			.el-card {
				border: none;
				margin-bottom: 7px;
			}
		}
	}
  .el-container{
    padding: 15px;
  }
  .el-row{
		width: 80%;
		margin: 0 auto!important;
		background: #fff;
  }
  .el-col{
    margin-bottom: 5px;
	}
	.el-button:focus, .el-button:hover {
    color: #ff4f6b;
    /* border-color: #c6e2ff; */
    background-color: #ffedf0;
	}
	.el-button--text, .el-pager li.active, .el-pager li:hover{
    color: #ff4f6b;
	}
	.el-button--primary,.el-button--primary:focus, .el-button--primary:hover {
    color: #FFF;
    background-color: #ff4f6b;
    border-color: #ff4f6b;
	}
	.el-loading-spinner .el-loading-text {
    color: #ff4f6b;
	}
	.el-loading-spinner .path{
		stroke: #ff4f6b;
	}
	.el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    color: #FFF;
    background-color: #ff899c;
    border-color: #ff899c;
	}
	.el-link.el-link--primary:hover {
    color: #ff899c;
		border: none;
	}
	.el-link.is-underline:hover:after{
		border: none;
	}
	.el-radio-button__inner:hover {
    color: #ff4f6b;
	}
	.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #FFF;
    background-color: #ff4f6b;
    border-color: #ff4f6b;
    -webkit-box-shadow: -1px 0 0 0 #ff4f6b;
    box-shadow: -1px 0 0 0 #ff4f6b;
	}
	.el-message-box .el-button--default:hover, .el-message-box .el-button--default:focus{
		color: #fff;
	}	
	.el-menu,.el-menu li, .el-menu li .el-submenu__title{
		background-color: #1e1e1e!important;
	}
	.el-menu .el-submenu:hover,.el-menu .el-submenu:focus{
		color: #b9b9b9!important;
	}

  .box-card{
    border: 0px;
    width: 100%;
    text-align: left;
  }
  .box-card .el-card__header {
    padding: 15px 20px;
    border-bottom: 0px; 
  }
  .box-card .cont{
    font-size: 14px;
		color: #666666;
  }
  .box-card .footer{
    margin-top: 20px;
    color: #999;
    font-size: 13px;
    margin-top: 15px;
  }
	.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
		color: #909399;
	}
  h1, h2 {
    font-weight: normal;
  }
  p{
    font-size: 14px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: block;
    margin: 0 10px;
  }
	body{
		margin: 0px;
		background-color: #f4f5f5;
	}
	@media screen and (max-width: 900px) {
    .el-row{
    	width: 100%;	
		}
		.el-pagination{
			white-space: normal;
		}
	}	
</style>
