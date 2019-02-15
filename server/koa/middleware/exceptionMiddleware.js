const { logger } = require('./../../utils/logger.js')

const install = function (options, app) {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      logger.error(e, [ctx.request.url])

      if (ctx.status === 404) {
        ctx.status = 500
      }

      let msg = (e && e.toString()) || '服务器错误'
      if (
        ctx.accept.headers.accept &&
        ~ctx.accept.headers.accept.indexOf('json')
      ) {
        ctx.body = { code: -1, msg: msg, data: null }
      } else {
        ctx.body = msg
      }
    }
  }
}

module.exports = {
  install
}
