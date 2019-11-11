import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Header from '@/components/Header'
import Index from '@/pages/index'
import Post from '@/pages/post'
import Detail from '@/pages/detail'
import Login from '@/pages/login'
import Register from '@/pages/register'
import ContactMe from '@/pages/contactMe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
    },
    {
      path: '/push',
      name: 'Post',
      component: Post
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail,
		},
		{
      path: '/contactMe',
      name: 'contactMe',
      component: ContactMe
    },
  ]
})
