const webpackCompiler = require('./../../compiler.js')
// const { createDllVersion } = require('./../dllVersion')
const { webpackConfig } = require('./../webpack.dll.config.js')

const build = async () => {
  if (Object.keys(webpackConfig.entry).length > 0) {
    try {
      await webpackCompiler(webpackConfig)
    } catch (e) {
      console.log(e)
    }
  }

  // createDllVersion()
}

module.exports = build
