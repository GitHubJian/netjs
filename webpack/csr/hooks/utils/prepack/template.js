import Vue from 'vue'
import entry from '{{ &entryPath }}/app.vue'
// import { createRouter } from '{{ &entryPath }}/router/index.js'
import { createStore } from '{{ &entryPath }}/store/index.js'
// import { sync } from 'vuex-router-sync'

// const router = createRouter()
const store = createStore()

// sync(store, router)

export default new Vue({
  // router,
  store,
  el: '#app',
  render: h => h(entry)
})
