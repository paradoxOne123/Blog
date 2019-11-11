<template>
  <div class="detail">
		<link rel="stylesheet" href="../../static/css/index.classic.css" />
    <Header></Header>
    <!-- article List -->
    <el-container v-loading.fullscreen.lock="loading" 
			element-loading-text="疯狂加载中">
      <el-row :gutter="20">
				<!-- 正文 -->
        <el-col style="margin-bottom: 50px;">
          <h1>{{ cont.title }}</h1>
					<p v-if="cont.time">
						<span style="color:#999">{{ cont.name + ' 发表于 ' + cont.time.minute }}</span>
						<!-- <span>{{ cont.time.minute }}</span> -->
					</p>
					<div id="vditor"></div>
        </el-col>
				<!-- 评论 -->
				<el-col class="comment" style="background: #fafbfc;">
					<el-form ref="form" :model="form" label-width="0px" style="width: 90%;float: left">
						<el-form-item label="" >
							<el-input type="text" :placeholder="(user&&user.name||'')+' 说点什么吧～'" v-model="form.comment" class="content"></el-input>
						</el-form-item>
					</el-form>
					<el-button type="primary" @click="onComment(cont.name,1)" :disabled="!user" style="margin-top: 12px;height: 38px;">发表</el-button>
				</el-col>
				<!-- <el-col :span="3">
					
				</el-col> -->
				<!-- 评论列表 -->
				<el-col class="comment-list">
					<ul>
						<li v-for="item in cont.comments">
							<div>
								<!-- 头像 -->
								<div class="avater">
										<el-avatar :size="35" fit="fill" src="url"></el-avatar>
								</div>
								<!-- 内容 -->
								<div class="cont">
									<div class="cont-info">
										<span>{{ item.username }}</span>
									</div>
									<p>{{ item.cont }}</p>
									<div class="reply">
										<span>{{ item.time }}</span>
										<div style="float:right">
											<el-popover
												placement="bottom-end"
												width="400"
												trigger="click">
												<el-input type="text" :placeholder="'回复@sss'" v-model="curReplay" class="content"></el-input>
												<el-button type="primary" @click="onComment(item.name,2,item.comtid)" :disabled="!user" style="margin-top: 12px;height: 38px;">发表</el-button>
												<el-button slot="reference">
													<span class="reply-btn"><i class="el-icon-chat-round"></i> 回复</span>
												</el-button>
											</el-popover>
										</div>
										
										
									</div>
								</div>
							</div>
							<div class="replay" v-if="item.replays">
								<div v-for="data in item.replays">
									<!-- 头像 -->
									<div class="avater">
											<el-avatar :size="35" fit="fill" src="url"></el-avatar>
									</div>
									<!-- 内容 -->
									<div class="cont">
										<div class="cont-info">
											<span>{{ data.username }}</span>
										</div>
										<p>回复<span style="color: #ff4f6b;">{{ item.atuser }}</span>: {{ data.cont }}</p>
										<div class="reply">
											<span>{{ data.time }}</span>
											<div style="float:right">
												<el-popover
													placement="bottom-end"
													width="400"
													trigger="click">
													<el-input type="text" :placeholder="'回复@sss'" v-model="curReplay" class="content"></el-input>
													<el-button type="primary" @click="onComment(data.name,2,item.comtid)" :disabled="!user" style="margin-top: 12px;height: 38px;">发表</el-button>
													<el-button slot="reference">
														<span class="reply-btn"><i class="el-icon-chat-round"></i> 回复</span>
													</el-button>
												</el-popover>
											</div>
											
										</div>
									</div>
								</div>
							</div>

						</li>
					</ul>
				</el-col>

      </el-row>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/Header';
import { articleDetail,comment } from '../api/article'
// import { getUserInfo } from '../api/user'

import Vditor from 'vditor'

let cont = {}
export default {
  name: 'Detail',
  components: {
    Header,
  },
  data () {
    return {
			cont,
			vditor: {},
			user: window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')) : null,
			form: {
        comment: ''
			},
			curReplay: '',
			loading: true,
    }
  },
  created () {
		var self = this
		console.log(this.$route.params)

    let name = this.$route.params.name
		let title = this.$route.params.title
		let id = this.$route.params.id
		
    articleDetail({name:name, title:title, id:id}).then(res => {
			this.cont = res.list[0]
			
			this.vditor = new Vditor('vditor', {
				cache: false,
				counter: 100,
				// height: 300,
				toolbar: ['preview'],
				editorName: 'vditor',
				hint: {
					emojiPath: 'https://static.hacpai.com/emoji/graphics',
					emojiTail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
					emoji: {
						'+1': '👍',
						'-1': '👎',
						'egg': '🥚',
						'eggplant': '🍆',
						'eight': '8⃣',
						'eight_pointed_black_star': '✴',
						'eight_spoked_asterisk': '✳',
						'electric_plug': '🔌',
						'elephant': '🐘',
						'email': '✉',
						'end': '🔚',
						'envelope': '✉',
						'es': '🇪🇸',
						'euro': '💶',
						'european_castle': '🏰',
						'european_post_office': '🏤',
						'evergreen_tree': '🌲',
						'exclamation': '❗',
						'expressionless': '😑',
						'eyeglasses': '👓',
						'eyes': '👀',
						'facepunch': '👊',
						'factory': '🏭',
						'fallen_leaf': '🍂',
						'family': '👪',
						'fast_forward': '⏩',
						'fax': '📠',
						'fearful': '😨',
						'feet': '🐾',
						'ferris_wheel': '🎡',
						'file_folder': '📁',
						'fire': '🔥',
						'fire_engine': '🚒',
						'fireworks': '🎆',
						'first_quarter_moon': '🌓',
						'first_quarter_moon_with_face': '🌛',
						'fish': '🐟',
						'fish_cake': '🍥',
						'fishing_pole_and_fish': '🎣',
						'fist': '✊',
						'five': '5⃣',
						'flags': '🎏',
						'flashlight': '🔦',
						'floppy_disk': '💾',
						'flower_playing_cards': '🎴',
						'flushed': '😳',
						'foggy': '🌁',
						'football': '🏈',
						'fork_and_knife': '🍴',
						'fountain': '⛲',
						'four': '4⃣',
						'four_leaf_clover': '🍀',
						'fr': '🇫🇷',
						'free': '🆓',
						'fried_shrimp': '🍤',
						'fries': '🍟',
						'frog': '🐸',
						'frowning': '😦',
						'fuelpump': '⛽',
						'full_moon': '🌕',
						'full_moon_with_face': '🌝',
						'trollface': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/trollface.png',
						'huaji': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/huaji.gif',
					},
				},
				tab: '\t',
				upload: {
					accept: 'image/*,.wav',
					token: 'test',
					url: '/api/upload/editor',
					linkToImgUrl: '/api/upload/fetch',
					filename (name) {
						// ? \ / : | < > * [ ] white to -
						return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
					},
					handler (file) {
						console.log(file)
						return 'handler'
					},
				},
				preview: {
					mode: "preview",
					parse: () => {
						LazyLoadImage()
					},
				},
			})
			this.vditor.setValue(this.cont.post)
			this.vditor.disabled()
			setTimeout( ()=> {
				self.loading = false
			},1000)
			// self.loading = false

			const LazyLoadImage = () => {
				const loadImg = (it) => {
					const testImage = document.createElement('img')
					testImage.src = it.getAttribute('data-src')
					testImage.addEventListener('load', () => {
						it.src = testImage.src
						it.style.backgroundImage = 'none'
						it.style.backgroundColor = 'transparent'
					})
					it.removeAttribute('data-src')
				}

				if (!('IntersectionObserver' in window)) {
					document.querySelectorAll('img').forEach((data) => {
						if (data.getAttribute('data-src')) {
							loadImg(data)
						}
					})
					return false
				}

				if (window.imageIntersectionObserver) {
					window.imageIntersectionObserver.disconnect()
					document.querySelectorAll('img').forEach(function (data) {
						window.imageIntersectionObserver.observe(data)
					})
				} else {
					window.imageIntersectionObserver = new IntersectionObserver((entries) => {
						entries.forEach((entrie) => {
							if ((typeof entrie.isIntersecting === 'undefined'
								? entrie.intersectionRatio !== 0
								: entrie.isIntersecting) && entrie.target.getAttribute('data-src')) {
								loadImg(entrie.target)
							}
						})
					})
					document.querySelectorAll('img').forEach(function (data) {
						window.imageIntersectionObserver.observe(data)
					})
				}
			}

    }).catch(err => {
      this.$message({
        message: err,
        type: 'error',
        duration: 2 * 1000
			})
			this.loading = false
    })
  },
  methods: {
    onComment(name, status, comtid) {
			var self = this;
			if((status===1&&this.form.comment==='') || (status===2&&this.curReplay==='')){
				this.$message({
					message: '评论内容不能为空哦',
					type: 'warning',
					duration: 2 * 1000
				})
				return
			}
			console.log(this.form.comment)
			let param = {
				id: this.cont._id,//文章id
				author: this.cont.name,
				title: this.cont.title,
				username: this.user.name, //当前评论用户
				userid: this.user._id,
				mode: status, //当前评论模式 1:评论文章 2:回复
				atuser: name,  //回复的人 可以是文章作者 可以是回复下的聊天
				atuserid: status===1 ? null : comtid,
				comtid: status===1 ? null : comtid,//当前评论ID 若是评论文章则为空
				cont: status===1 ? this.form.comment : this.curReplay //内容
			}

			comment(param).then(res => {
				this.$message({
					message: res.data,
					type: 'success',
					duration: 1 * 1000,
					onClose: function(){
						//重新请求列表 这里评论应该拆分～
						status===1 ? self.form.comment='' : self.curReplay=''
						let name = self.$route.params.name
						let title = self.$route.params.title
						let id = self.$route.params.id
						articleDetail({name:name, title:title, id: id}).then(res => {
							self.cont = res.list[0]
						})
					}
				});
			}).catch(err => {
				this.$message({
					message: err,
					type: 'error',
					duration: 2 * 1000
				})
			})

    }
  }
}
</script>
<!-- <style type="text/css" src="../assets/css/resset.css"></style> -->
<style lang="scss">
	.detail{
		.comment-list{
			li{
				margin: 0;
				padding: 15px 0px 20px;
				border-bottom: 1px solid rgba(178,186,194,.15);
			}
			.avater{
				float: left;
    		margin-right: 10px;
				margin-top: 5px;
			}
			.cont{
				p{
					margin: 0px;
   				margin-top: 7px;
				}
				.cont-info{
					span{
						display: inline-block;
						margin-right: 10px;
						font-size: 12px;
						color: #333;
					}
				}
				.reply{
					margin-top: 10px;
					margin-left: 45px;
					span{
						font-size: 12px;
						color: #999;
						display: inline-block;
					}
					.reply-btn{
						color: #333;
						font-size: 14px;
						float: right;
					}
					button{
						border: none;
						padding: 0px;
					}
				}
			}
			.replay{
				margin-left: 45px;
				padding: 13px;
				background-color: #fafbfc;
				margin-top: 10px;
				border-radius: 3px;
			}
		}
		
		#vditor{
			width: 100%;
			// height:650px;
			text-align: left;
			border: none;

			.vditor-toolbar{
				display: none;
			}
			.vditor-textarea{
				display: none;
			}
			.vditor-preview{
				box-shadow: none;
				position: relative;
				.vditor-reset{
					max-width: 100%!important;
				}
			}
			.vditor-counter{
				display: none!important;
			}
			
		}
		.el-input__inner{
			border-color: #f1f1f1;
		}
		.el-form-item{
			margin: 11px 0px;
		}
	}
</style>
<style scoped>
	body{
		background: #fbfbfb;
	}
  h3{
    font-weight: bold;
  }
  /* markdown HTML样式 */
  .cont{
    text-align: left;
    color: #333;
  }
 
</style>
