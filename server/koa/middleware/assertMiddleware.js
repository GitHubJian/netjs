const root = process.cwd()
const KoaSend = require('koa-send')
const path = require('path')
const fse = require('fs-extra')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')

const { webpackConfig } = require(path.resolve(
  root,
  'webpack/csr/webpack.config.js'
))

let r = webpackConfig.output.publicPath

const defaultConfig = {
  dir: webpackConfig.output.path,
  router: r.substring(0, r.length - 1)
}

const install = function (options, app) {
  let { dir, router } = extend(defaultConfig, options.assert || {})

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      return await next()
    }

    let maxage = 365 * 24 * 60 * 60 * 1000 // one year
    let realReqPath = reqPath.substring(router.length)
    let filePath = path.resolve(dir, `.${realReqPath}`)
    const exists = await fse.pathExists(filePath)

    let result
    if (exists) {
      result = await KoaSend(ctx, realReqPath, {
        root: dir,
        maxage,
        setHeaders: (res, path, stats) => {
          res.setHeader('Author', 'xiaows')
          if (path.endsWith('.json')) {
            res.setHeader('Access-Control-Allow-Origin', '*')
          }
          res.setHeader(
            'Cache-Control',
            `max-age=${
              path.endsWith('.html') ? 0 : 3.1536 * 1e10
            },must-revalidate`
          )
          res.setHeader('Cache-Control', `max-age=0,must-revalidate`)
        }
      })
    }

    if (!result) {
      ctx.status = 404
      ctx.body = `404 | Page Not Found | ${ctx.path}`
    }
  }
}

module.exports = {
  install
}
