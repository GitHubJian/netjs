const install = function (options, app) {
  return async (ctx, next) => {
    ctx.realip =
      ctx.request.headers['x-real-ip'] ||
      (ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip) ||
      ''
    ctx.queryParams = ctx.request.query

    await next()
  }
}

module.exports = {
  install
}
