const router = require('../../data/router/index.js')

module.exports = {
  mode: 'csr',
  ready: {
    host: 'localhost',
    port: 8418
  },
  ssr: {},
  router: {
    routes: router
  },
  proxy: {
    proxy: {}
  }
}
