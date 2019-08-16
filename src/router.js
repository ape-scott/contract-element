import Vue from 'vue'
import Router from 'vue-router'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      redirect: 'home',
      component: () => import('@/views/index'),
      children: [
        { path: '/home', name: '首页', component: () => import('@/views/Home') },
        { path: '/infoshow', name: '个人信息', component: () => import('@/views/sys/InfoShow') },
        { path: '/foundlist', name: '客户信息列表', component: () => import('@/views/customers/FoundList') },
        { path: '/foundlist/detail', name: '客户详情', component: () => import('@/views/customers/detail/index') },
        { path: '/foundcheck', name: '客户信息审核', component: () => import('@/views/customers/FoundCheck') },
        { path: '/contractlist', name: '合同信息列表', component: () => import('@/views/contracts/contractlist') },
      ]
    },
    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login/Login')
    },
    {
      path: '*',
      component: () => import('@/views/errors/404')
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // const isLogin = localStorage.eleToken ? true: false;
  const isLogin = Boolean(localStorage.eleToken);
  if(to.path === '/login' || to.path === '/register') {
    localStorage.removeItem('eleToken')
    next();
  } else {
    isLogin ? next() : next('/login')
  }
})

router.afterEach(() => {
  NProgress.done() // end progress bar
})

export default router;
