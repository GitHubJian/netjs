const uuidv1 = require('uuid/v1')

const install = function (options, app) {
  return async (ctx, next) => {
    ctx.uuid = uuidv1()

    await next()
  }
}

module.exports = {
  install
}
