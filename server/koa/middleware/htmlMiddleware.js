const root = process.cwd()
const path = require('path')
const fse = require('fs-extra')
const KoaSend = require('koa-send')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')

const defaultConfig = {
  dir: path.resolve(root, './static'),
  router: '/route',
  getRealURI: path => {
    let realURI = '/' + path.split('/')[2] + '.html'

    return realURI
  }
}

const install = function (options, app) {
  let { dir, router, getRealURI } = extend(defaultConfig, options.assert || {})

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      return await next()
    }

    let maxage = 365 * 24 * 60 * 60 * 1000 // one year
    let realReqPath = getRealURI(reqPath)
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
