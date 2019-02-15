const webpackConfig = require('./../../config/webpack.config.js')
const pack = require('./utils/afterpack/index.js')

const hook = async () => {
  let { afterHook = [] } = webpackConfig
  let hooks =
    afterHook.filter(v => {
      return typeof v === 'function'
    }) || []

  for (const index in hooks) {
    if (hooks.hasOwnProperty(index)) {
      const fn = hooks[index]

      await fn.call()
    }
  }

  pack()
}

module.exports = hook
