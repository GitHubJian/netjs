const root = process.cwd()
const fse = require('fs-extra')
const path = require('path')
const KoaSend = require('koa-send')
const pathConfig = require('./../../../config/path.config.js')
const webpack = require('webpack')
// const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { hotMiddleware } = require('koa-webpack-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const { webpackConfig } = require(path.resolve(
  root,
  'webpack/csr/dev/webpack.config.js'
))
const templatePath = path.resolve(root, 'webpack/csr/template/csr.ejs')
const { NODE_ENV } = process.env
const deepClone = v => JSON.parse(JSON.stringify(v))
const projectEntry = deepClone(webpackConfig.entry)

const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const { htmlAssets, publicPath: dllPublicPath } = require(path.resolve(
  root,
  'webpack/csr/utils/asset.js'
))

webpackConfig.entry = {
  global: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true',
    pathConfig.global
  ]
}

const getSingleHtmlPlugin = function (k, v) {
  return new HtmlWebpackPlugin({
    filename: path.resolve(pathConfig.static, `${k}.html`),
    title: '测试',
    template: templatePath,
    favicon: pathConfig.favicon,
    chunks: ['global', k],
    NODE_ENV
  })
}

const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(webpackConfig.output.path, file), 'utf-8')
  } catch (e) {}
}

const defaultConfig = {
  htmlRouter: '/route',
  assertRouter: webpackConfig.output.publicPath,
  dir: pathConfig.dll,
  getEntryKey: path => {
    return path.split('/')[2]
  }
}

const lifecycleHook = (options, app) => {
  let { htmlRouter, getEntryKey, dir, assertRouter } = extend(
    defaultConfig,
    options.csr || {}
  )

  const compiler = webpack(webpackConfig)
  const devMiddlewareInstance = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats
  })

  let devMiddlewarePromise = function (entryKey) {
    return new Promise((resolve, reject) => {
      devMiddlewareInstance.waitUntilValid(function (stats) {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) {
          reject(stats)
        } else {
          let html = readFile(
            devMiddlewareInstance.fileSystem,
            `${entryKey}.html`
          )
          resolve(html)
        }
      })
    })
  }

  app.use(async (ctx, next) => {
    let reqPath = ctx.path
    if (ctx.path === '/' || matchRoute(reqPath, htmlRouter)) {
      const entryKey = ctx.path === '/' ? 'index' : getEntryKey(reqPath)

      if (projectEntry[entryKey]) {
        const entryValue = [
          'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true',
          projectEntry[entryKey]
        ]

        compiler.apply(new MultiEntryPlugin(root, entryValue, entryKey))
        compiler.apply(getSingleHtmlPlugin(entryKey, entryValue))

        const assets = htmlAssets.map(v => {
          return v.substring(dllPublicPath.length - 1)
        })

        compiler.apply(
          new HtmlWebpackIncludeAssetsPlugin({
            append: false,
            assets: assets
          })
        )

        devMiddlewareInstance.invalidate()

        let html = await devMiddlewarePromise(entryKey)
        ctx.body = html
      }
    } else {
      await next()
    }
  })

  app.use(async (ctx, next) => {
    ctx.status = 200
    await devMiddlewareInstance(ctx.req, ctx.res, async () => {
      await next()
    })
  })

  app.use(async (ctx, next) => {
    // 静态资源
    let reqPath = ctx.path
    if (reqPath === '/__webpack_hmr') {
      await next()
    } else {
      let maxage = 365 * 24 * 60 * 60 * 1000

      let filePathOpposite = reqPath.substring(assertRouter.length - 1)
      let filePath = path.resolve(dir, `.${filePathOpposite}`)

      const exists = await fse.pathExists(filePath)
      let result
      if (exists) {
        result = await KoaSend(ctx, filePathOpposite, {
          root: dir,
          maxage
        })
      }

      if (!result) {
        await next()
      }
    }
  })

  app.use(hotMiddleware(compiler))
}

module.exports = lifecycleHook
