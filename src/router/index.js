import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/login/Login'
import ForgetPassword from '@/views/login/ForgetPassword'
import Workbench from '@/views/layout'
import ProjectList from '@/views/projectList'
import Maps from '@/views/map'
import AMaps from '@/views/map/map'
import Effect from '@/views/map/effect'
import Drag from '@/views/dragComponent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/BIM/',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/workbench',
      name: 'Workbench',
      component: Workbench
    },
    {
      path: '/projectList',
      name: 'ProjectList',
      component: ProjectList
    },
    {
      path: '/map',
      name: 'Maps',
      component: Maps
    },
    {
      path: '/amap',
      name: 'AMaps',
      component: AMaps
    },
    {
      path: '/effect',
      name: 'Effect',
      component: Effect
    },
    {
      path: '/drag',
      name: 'Drag',
      component: Drag
    },
    {
      path:'/editPage',//编辑页面
      name:'EditPage',
      component:resolve=>require(['@/views/editPage/index'],resolve)
    },
  ]
})
