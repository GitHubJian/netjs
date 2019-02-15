import config from '../config'
import Vue from 'vue'
import Router from 'vue-router'

const Outer1 = () => import(/* webpackChunkName: "1" */ '../views/1.vue')

Vue.use(Router)
const { router, entryKey } = config

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [{ path: `/${router}/${entryKey}/1`, component: Outer1 }]
  })
}
