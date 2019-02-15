const glob = require('glob')
const path = require('path')
const pathConfig = require('../../../config/path.config.js')

const entry = glob
  .sync(path.resolve(pathConfig.src, './pages/**/app.vue'))
  .reduce((prev, cur) => {
    let entryKey = cur.split('/').slice(-2, -1)[0]
    let entryValue = path.resolve(pathConfig.prepackPath, `csr/${entryKey}.js`)

    prev[entryKey] = entryValue
    return prev
  }, {})

module.exports = { entry }
