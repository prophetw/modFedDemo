import { createRouter, createWebHistory } from 'vue-router'
// import { defineAsyncComponent } from 'vue'
// 本地页面

// @ts-ignore
import Home from '../pages/Home.vue'
import PageA from '../pages/PageA.vue'
// @ts-ignore
// import Viewer from '../pages/Viewer.vue'
// 通过 defineAsyncComponent + 动态 import 的方式加载远程模块
// 这里的 'remote_app/RemoteApp' 就是远程项目暴露的模块
// @ts-ignore
// const RemoteMicroFront = defineAsyncComponent(() => import('remote_app/RemoteApp'))

// console.log(' remote ', RemoteMicroFront);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/pageA',
    name: 'pageA',
    component: PageA
  },
  // {
  //   path: '/viewer',
  //   name: 'viewer',
  //   component: Viewer
  // },
  // {
  //   path: '/proj-B',
  //   name: 'project-b',
  //   component: RemoteMicroFront
  // },
  // 其他本地路由 ...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
