const root = process.cwd()
const path = require('path')
const KoaSend = require('koa-send')
const pathConfig = require(path.resolve(root, './config/path.config.js'))
const projectConfig = require(path.resolve(root, './config/project.config.js'))

const templatePath = path.resolve(__dirname, '../template/ssr.html')
const fs = require('fs')
const fse = require('fs-extra')
const webpack = require('webpack')
const clientConfig = require(path.resolve(
  root,
  'webpack/ssr/dev/webpack.client.config.js'
))
const serverConfig = require(path.resolve(
  root,
  'webpack/ssr/dev/webpack.server.config.js'
))
const webpackDevMiddleware = require('webpack-dev-middleware')
const { hotMiddleware } = require('koa-webpack-middleware')
// const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const { createBundleRenderer } = require('vue-server-renderer')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')
const { webpackConfig: dllWebpackConfig } = require(path.resolve(
  root,
  'webpack/ssr/webpack.dll.config.js'
))

let dllOutputPublicPath = dllWebpackConfig.output.publicPath

const lifecycleHook = function (options, app) {
  const dllJSON = require(path.resolve(pathConfig.dll, 'index.json'))
  const dllVendor = Object.values(dllJSON)
    .reduce((prev, cur) => {
      let val = Object.values(cur)
      prev = prev.concat(val)
      return prev
    }, [])
    .map(v => v.substring(1))

  const readFile = (fs, file) => {
    try {
      return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    } catch (e) {}
  }

  clientConfig.entry = {
    global: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=false&reload=true',
      pathConfig.global
    ]
  }

  serverConfig.entry = {
    global: [pathConfig.globalServer]
  }

  const template = fs.readFileSync(templatePath, 'utf-8')

  const clientCompiler = webpack(clientConfig)
  const clientDevInstance = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: clientConfig.stats
  })
  let clientPromise = function () {
    return new Promise((resolve, reject) => {
      clientDevInstance.waitUntilValid(function (stats) {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) {
          reject(stats)
        } else {
          let clientManifest = JSON.parse(
            readFile(
              clientDevInstance.fileSystem,
              'vue-ssr-client-manifest.json'
            )
          )
          resolve(clientManifest)
        }
      })
    })
  }

  const serverCompiler = webpack(serverConfig)
  const serverDevInstance = webpackDevMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPath,
    stats: serverConfig.stats
  })
  let serverPromise = function () {
    return new Promise((resolve, reject) => {
      serverDevInstance.waitUntilValid(function (stats) {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) {
          reject(stats)
        } else {
          let bundle = JSON.parse(
            readFile(serverDevInstance.fileSystem, 'vue-ssr-server-bundle.json')
          )
          resolve(bundle)
        }
      })
    })
  }

  /* 传入重置后 clientManifest & bundle */
  function renderer (clientManifest, bundle, context) {
    return new Promise((resolve, reject) => {
      createBundleRenderer(bundle, {
        template,
        clientManifest,
        runInNewContext: false
      }).renderToString(context, (err, html) => {
        if (err) {
          console.log(err)
          console.log(err.stack)
          reject(err)
        } else {
          resolve(html)
        }
      })
    })
  }

  const defaultConfig = {
    router: '/route',
    getEntryKey: path => {
      return path.split('/')[2]
    },
    dir: pathConfig.dll
  }
  /* router */
  let { router, getEntryKey, dir } = extend(defaultConfig, options.ssr || {})

  app.use(async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      await next()
    } else {
      // #issure folder is path of entry
      let entryKey = getEntryKey(reqPath)

      let clientEntryValue = [
        'webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=false&reload=true',
        path.resolve(
          pathConfig.prepackPath,
          `./ssr/${entryKey}/entry-client.js`
        )
      ]

      clientCompiler.apply(
        new MultiEntryPlugin(pathConfig.root, clientEntryValue, entryKey)
      )
      clientDevInstance.invalidate()

      let serverEntryValue = [
        // 'webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=false&reload=true',
        path.resolve(
          pathConfig.prepackPath,
          `./ssr/${entryKey}/entry-server.js`
        )
      ]

      serverCompiler.apply(
        new MultiEntryPlugin(pathConfig.root, serverEntryValue, entryKey)
      )
      serverDevInstance.invalidate()
      try {
        let [clientManifest, bundle] = await Promise.all([
          clientPromise(),
          serverPromise()
        ])

        // clientManifestAll = clientManifest.all // 临时存储

        let realDllVendor = dllVendor.map(v => {
          return v.substring(dllOutputPublicPath.length - 1)
        })

        let initial = realDllVendor.concat([
          'js/global.js',
          `js/${entryKey}.js`
        ])

        Object.assign(clientManifest, { initial })
        Object.assign(bundle, { entry: `js/${entryKey}-server.js` })

        const context = {
          url: ctx.originalUrl,
          title: ctx.__SSR_TITLE__ || projectConfig.title,
          __SSR_CONTENT__: ctx.__SSR_CONTENT__
        }

        let html = await renderer(clientManifest, bundle, context)
        ctx.body = html
      } catch (e) {
        ctx.body = e
      }
    }
  })

  app.use(async (ctx, next) => {
    ctx.status = 200
    await clientDevInstance(ctx.req, ctx.res, async () => {
      await next()
    })
  })

  app.use(async (ctx, next) => {
    let reqPath = ctx.path
    if (reqPath === '/__webpack_hmr') {
      await next()
    } else {
      let maxage = 365 * 24 * 60 * 60 * 1000
      let start = 0
      let filepath = reqPath.substring(start, reqPath.length)
      const exists = await fse.pathExists(`${dir}${filepath}`)

      let result
      if (exists) {
        result = await KoaSend(ctx, filepath, {
          root: pathConfig.static,
          maxage
        })
      }

      if (!result) {
        await next()
      }
    }
  })

  app.use(hotMiddleware(clientCompiler))
}

module.exports = lifecycleHook
