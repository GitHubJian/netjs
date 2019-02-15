// require('@babel/core').transform('code', {
//   plugins: ['@babel/plugin-syntax-dynamic-import']
// })
// require('babel-polyfill')
// require('babel-register')({
//   presets: ['env'],
//   plugins: ['add-module-exports']
// })
const {
  path: pathConfig,
  server: serverConfig
} = require('./../../config/index.js')

const glob = require('glob')
const path = require('path')

const { host, port } = serverConfig

const chalk = require('chalk')
const { clientEntry } = require('./../../utils/entry.js')

const url = `${host}${port ? ':' + port : ''}`

const log = (str, color) => console.log(color ? chalk[color](str) : str)
const printRoute = async () => {
  // if (isDevelopment) {
  log('路由列表', 'cyan')
  log('-'.repeat(30), 'cyan')

  Object.keys(clientEntry).forEach(v => {
    // let views = glob.sync(pathConfig.pages + '/' + v + '/index.vue')
    let views = glob.sync(pathConfig.pages + '/' + v + '/views/*.vue')
    views
      .filter(v => {
        return !path.basename(v).includes('.csr.vue')
      })
      .map(k => {
        return path
          .basename(k)
          .split('.')
          .shift()
      })
      .forEach(k => {
        console.log('http://' + [url, v, k].join('/'))
      })
  })

  log('-'.repeat(30), 'cyan')
  // }
}

printRoute()

module.exports = { printRoute }
