const webpackConf = require('./../../config/webpack.config.js')

const defaultOptions = {
  publicPath: '/static'
}

let { output = {} } = webpackConf

let config = Object.assign({}, defaultOptions, output)

module.exports = config
