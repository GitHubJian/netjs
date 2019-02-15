import Vue from 'vue'
import { createApp } from './app'

const { app, csr, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // don't double-fetch the data
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false

    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })

    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })

  app.$mount('#app')

  // new Vue({
  //   el: '#csr',
  //   render: h => h(csr)
  // })
})

// service worker
// if (location.protocal === 'https:' && navigator.serviceWorker) {
//   navigator.serviceWorker.register('/service-worker.js')
// }
