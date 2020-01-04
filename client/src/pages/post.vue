<template>
  <div class="post">
		<link rel="stylesheet" href="../../static/css/index.classic.css" />
    <Header active="push"></Header>

		<div class="title">
			<el-input v-model="title" placeholder="请输入文章标题" style="border-radius: 0px;border-bottom: 0;text-align: center;"></el-input>
		</div>
		<div id="vditor"></div>

		<div style="margin-top: 35px;">
			<el-button type="primary" @click="onSubmit" :disabled="!user">发表</el-button>
			<el-button>取消</el-button>
		</div> 

		<!-- <div class="indexContainer">
			<div class="btnsContainer">
					<div class="btn" @click="getMdValueFn">获取mdValue</div>
					<div class="btn" @click="getHtmlValueFn">获取htmlValue</div>
			</div>
			<div class="maskContainer" v-if="dilogStatus">
					<div class="contentContainer">
					<div class="closeBtnContainer" @click="closeMaskFn"></div>
							<textarea class="showAreaContainer" v-model="msgShow" readonly></textarea>
					</div>
			</div>
			<div class="editorContainer">
					<markdown 
					:mdValuesP="msg.mdValue"  
					:fullPageStatusP="false" 
					:editStatusP="true" 
					:previewStatusP="true" 
					:navStatusP="true"
					:icoStatusP="true"  
					@childevent="childEventHandler"
					></markdown>
			</div>
    </div>-->

		<!-- <el-container> -->
      <!-- <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <el-form ref="form" :model="form" label-width="80px" style="width: 100%;">
            <el-form-item label="标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="正文">
              <el-input type="textarea" placeholder="请用markdown编写～" v-model="form.post" class="content":autosize="{ minRows: 30, maxRows: 40}"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :disabled="!user">发表</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row> -->
    <!-- </el-container> -->

  </div>
</template>

<script>
import Vditor from 'vditor'
// import markdown from '../components/markdown'

import Header from '../components/Header';
import { postArticle, editArticle, uploadImg, articleDetail } from '../api/article'

// const vditor={}
export default {
  name: 'Post',
  components: {
		Header,
		// markdown
  },
  data () {
    return {
      user: window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')) : null,
      // form: {
      //   title: '',
      //   post: ''
			// },
			title: '',
			vditor: {},
			editCont: {},
			// msgShow:'我要显示的内容',
			// dilogStatus:false,
			// msg: {
			// 		mdValue:'## Vue-markdownEditor'
			// }
    }
  },
  created () {

		let self = this;
		let name = self.$route.params.name
		let title = self.$route.params.title
		let id = self.$route.params.id
		
		//编辑文章
		if(name && title){
			this.title = title;
			articleDetail({name:name, title:title, id:id}).then(res => {
				this.editCont = res.list[0]
				
				this.vditor = new Vditor('vditor', {
					counter: 100,
					height: 650,
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
						accept: 'image/*',
						token: 'test',
						url: '/api/article/upload',
						// linkToImgUrl: '/api/upload/fetch',
						// filename (name) {
						// 	// ? \ / : | < > * [ ] white to -
						// 	// return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')

						// 	var fileFormat = (name).split(".");
						// 	return fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]
						// },
						// handler (file) {
						// 	// debugger
						// 	// console.log(file)
						// 	// let param = new FormData(); //创建form对象
						// 	// param.append('file',file[0]);//通过append向form对象添加数据
						// 	// let config = {
						// 	// 	headers:{'Content-Type':'multipart/form-data'}
						// 	// }; 
						// 	// uploadImg(param, config).then(res => {
						// 	// 	if(res.code === 1000){
						// 	// 		return res
						// 	// 	}
						// 	// })
						// 	return {
						// 		code: 0,
						// 		msg: '',
						// 		data: {
						// 			errFiles: [],
						// 			succMap: {
						// 				'flow-300x224.png': 'http://tech.etouch.cn/wp-content/uploads/2019/08/flow-300x224.png'
						// 			}
						// 		}
						// 	}

						// 	// return {"code":0,"msg": '',"data":{"succMap":{"flow-300x224.png":"http://tech.etouch.cn/wp-content/uploads/2019/08/flow-300x224.png"}}}
							
						// }
					},
					preview: {
						mode: "both",
						parse: () => {
							LazyLoadImage()
						},
					},
				})
				this.vditor.focus()
				this.vditor.setValue(this.editCont.post)
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

		}else{
			//初始化markdown编辑器
			setTimeout(() => {
				this.vditor = new Vditor('vditor', {
					counter: 100,
					height: 650,
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
						accept: 'image/*',
						token: 'test',
						url: '/api/article/upload',
					},
					preview: {
						mode: "both",
						parse: () => {
							LazyLoadImage()
						},
					},
				})
				this.vditor.focus()

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
			},0)
		}
		
  },
  methods: {
    onSubmit() {
			// debugger
			var self = this

			if(self.title===''){
				this.$message({
					message: '请填写文章标题！',
					type: 'warning',
					duration: 2 * 1000
				})
				return
			}

			let cont = self.vditor.getValue()

			self.vditor.getHTML().then(res => {
				let name = self.$route.params.name
				let title = self.$route.params.title
				if(name && title){
					editArticle({title: self.title, id: self.editCont._id, post: cont, htmlCont: res}).then(res => {
						this.$message({
							message: res.data,
							type: 'success',
							duration: 1 * 1000,
							onClose: function(){
								self.vditor.clearCache()
								self.$router.push({path:'/'})
							}
						});
					}).catch(err => {
						this.$message({
							message: err,
							type: 'error',
							duration: 2 * 1000
						})
					})
				}else{
					postArticle({title: self.title, post: cont, htmlCont: res}).then(res => {
						this.$message({
							message: res.data,
							type: 'success',
							duration: 1 * 1000,
							onClose: function(){
								self.vditor.clearCache()
								self.$router.push({path:'/'})
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
				
			})
			
      
		},
		// childEventHandler:function(res){
		// 	// res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
		// 	this.msg=res;
		// },
		// getMdValueFn:function(){
		// 	this.msgShow=this.msg.mdValue;
		// 	this.dilogStatus=true;
		// },
		// getHtmlValueFn:function(){
		// 	this.msgShow=this.msg.htmlValue;
		// 	this.dilogStatus=true;
		// },
		// closeMaskFn:function(){
		// 	this.msgShow='';
		// 	this.dilogStatus=false;
		// },
	},
	destroyed () {
		this.vditor.clearCache()
	}
}
</script>
<style lang="scss">
	.post{
		#vditor{
			width: 100%;
			height:650px;
			text-align: left;

			.vditor-content{
				text-align: left;
			}
			.vditor-textarea{
				background-color: #333;
				color: #fdfdfd;
			}
			.vditor-preview{
				.vditor-reset{
					img{
						max-width: 100%;
					}
				}
			}
		}
	}
</style>
<style scoped>
  .title .el-input .el-input__inner{
		border-bottom: 0;
		border-top: 0px;
		height: 50px;
		line-height: 50px;
	}
  li{
		display: list-item!important;
	}
  /* #vditor{
		width: 100%;
		height:650px;
		text-align: left;
  }
	#vditor .vditor-content{
		text-align: left;
	}
	#vditor .vditor-textarea{
		background-color: #333;
		color: #fdfdfd;
	} */
</style>

