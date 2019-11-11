// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import { Button, Select } from 'element-ui';//可以借助babel-plugin-component实现element UI的按需引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'

import { getUserInfo } from './api/user'

Vue.config.productionTip = false

// Vue.component(Button.name, Button);
// Vue.component(Select.name, Select);
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//全局路由守卫
// router.beforeEach((to, from, next) => {
// 	debugger
// 	if(window.sessionStorage.getItem('user')){
// 		//已登陆
// 		next()
// 	}else{
// 		//获取用户信息
// 	}
// })
