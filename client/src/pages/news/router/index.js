import config from '../config'
import Vue from 'vue'
import Router from 'vue-router'

const Outer1 = () => import(/* webpackChunkName: "1" */ '../views/1.vue')
const Outer2 = () => import(/* webpackChunkName: "2" */ '../views/2.vue')
const Outer3 = () => import(/* webpackChunkName: "3" */ '../views/3.vue')
const Outer4 = () => import(/* webpackChunkName: "3" */ '../views/4.vue')
const Outer5 = () => import(/* webpackChunkName: "3" */ '../views/5.vue')

Vue.use(Router)
const { router, entryKey } = config

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      { path: `/${router}/${entryKey}/1`, component: Outer1 },
      { path: `/${router}/${entryKey}/2`, component: Outer2 },
      { path: `/${router}/${entryKey}/3`, component: Outer3 },
      { path: `/${router}/${entryKey}/4`, component: Outer4 },
      { path: `/${router}/${entryKey}/5`, component: Outer5 }
    ]
  })
}
