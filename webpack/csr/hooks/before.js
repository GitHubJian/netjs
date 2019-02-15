// const { webpack: webpackConfig } = require('./../config/index.js')
const pack = require('./utils/prepack/index.js')

const hook = () => {
  // let { beforeHook = [] } = webpackConfig
  // let hooks =
  //   beforeHook.filter(v => {
  //     return typeof v === 'function'
  //   }) || []

  // for (const index in hooks) {
  //   if (hooks.hasOwnProperty(index)) {
  //     const fn = hooks[index]

  //     await fn.call()
  //   }
  // }

  pack()
}

module.exports = hook
