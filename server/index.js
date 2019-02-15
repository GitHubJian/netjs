let mode = process.argv.indexOf('csr') > -1 ? 'csr' : 'ssr'

const config = require('./config/index.js')
const createApp = require('./koa/index.js')

module.exports = function () {
  createApp(Object.assign(config, { mode }))
}
