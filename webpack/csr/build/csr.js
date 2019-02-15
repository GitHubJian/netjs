const webpackCompiler = require('./../../compiler.js')
const { webpackConfig } = require('./../webpack.config.js')

const build = async () => {
  await webpackCompiler(webpackConfig)
}

module.exports = build
