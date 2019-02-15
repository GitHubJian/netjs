const { extend } = require('./../../utils/extend.js')
const pathToRegexp = require('path-to-regexp')

let defaultConfig = {
  router: '/',
  routes: {}
}

const install = function (options, app) {
  let { routes } = extend(defaultConfig, options.router || {})
  let routesList = Object.entries(routes).reduce((prev, [k, v]) => {
    prev.push([k, pathToRegexp(k), v])

    return prev
  }, [])

  return async (ctx, next) => {
    let reqPath = ctx.path

    let res = routesList.find(([, re]) => {
      return re.exec(reqPath)
    })

    if (res === undefined) {
      await next()
      return
    }

    let result = res[1].exec(reqPath)

    let params = res[0]
      .split('/')
      .filter(v => {
        return v.startsWith(':')
      })
      .map(v => {
        return v.substring(1)
      })
      .reduce((prev, cur, index) => {
        prev[cur] = result[index + 1]

        return prev
      }, {})

    ctx.params = params

    let fn = res[2]

    await fn.call(ctx, ctx, next)

    await next()
  }
}

module.exports = {
  install
}
