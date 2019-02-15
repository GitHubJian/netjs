const glob = require('glob')
const path = require('path')
const fs = require('fs')
const pathConfig = require('./../../config/path.config.js')
const { alias: customAlias } = require('./../../config/webpack.config.js')

const alias = glob
  .sync(path.resolve(pathConfig.src, './*'))
  .filter(v => {
    return fs.statSync(v).isDirectory()
  })
  .reduce((prev, cur) => {
    prev['@' + path.basename(cur)] = cur

    return prev
  }, {})

Object.assign(alias, customAlias || {})

module.exports = {
  alias
}
