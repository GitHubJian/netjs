const { extend } = require('./../../utils/extend.js')
const Log4j = require('./../../../utils/log4j.js')

const defaultConfig = {
  enable: true
}

const install = function (options, app) {
  let { enable } = extend(defaultConfig, options.log4j || {})

  return async (ctx, next) => {
    ctx.log4j = new Log4j({ enable })
    await next()
    ctx.log4j.print()
  }
}

module.exports = {
  install
}
