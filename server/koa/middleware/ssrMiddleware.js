const root = process.cwd()
const path = require('path')
const templatePath = path.resolve(__dirname, './../template/ssr.html')
const { path: pathConfig, project: projectConfig } = require(path.resolve(
  root,
  'config/index.js'
))
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const { serverEntry } = require(path.resolve(root, 'webpack/ssr/entry.js'))
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')

const { webpackConfig: dllWebpackConfig } = require(path.resolve(
  root,
  'webpack/ssr/webpack.dll.config.js'
))

let dllOutputPublicPath = dllWebpackConfig.output.publicPath

let defaultConfig = {
  router: '/route',
  title: '搜狗搜索App',
  needInit: [],
  getEntry: function (path) {
    let entry = path.split('/')[2]
    return entry
  }
}

const install = function (options, app) {
  let { router, needInit, getEntry } = extend(defaultConfig, options.ssr || {})

  const template = fs.readFileSync(templatePath, 'utf-8')
  let bundle = require(path.resolve(
    pathConfig.dist,
    'vue-ssr-server-bundle.json'
  ))
  let clientManifest = require(path.resolve(
    pathConfig.dist,
    'vue-ssr-client-manifest.json'
  ))
  const dllJSON = require(path.resolve(pathConfig.dll, 'index.json'))
  const dllVendor = Object.values(dllJSON)
    .reduce((prev, cur) => {
      let val = Object.values(cur)
      prev = prev.concat(val)
      return prev
    }, [])
    .map(v => v.substring(1))

  /* --- 预热 ---- */
  function createBundleRendererInstance (folder) {
    // 入口
    let entry = `js/${folder}-server.js`
    /* 重置 initial & entry */
    let oldInitial = clientManifest.initial
    let initial = oldInitial.filter(v => {
      return ['js/global', 'css/global', `js/${folder}`, `css/${folder}`].some(
        k => {
          return v.startsWith(k)
        }
      )
    })

    // 重置 global 在上面
    initial = initial.reduce((prev, cur) => {
      if (
        ['js/global', 'css/global'].some(k => {
          return cur.startsWith(k)
        })
      ) {
        prev.unshift(cur)
      } else {
        prev.push(cur)
      }
      return prev
    }, [])

    let realDllVendor = dllVendor.map(v => {
      return v.substring(dllOutputPublicPath.length - 1)
    })

    initial = realDllVendor.concat(initial)
    Object.assign(clientManifest, { initial })
    Object.assign(bundle, { entry })

    let bundleRenderer = createBundleRenderer(bundle, {
      template,
      clientManifest,
      basedir: pathConfig.dist,
      runInNewContext: false
    })

    return bundleRenderer
  }

  let bundleRendererInstanceMapping = Object.keys(serverEntry).reduce(
    (prev, folder) => {
      prev[folder] = createBundleRendererInstance(folder)
      return prev
    },
    {}
  )

  Object.values(needInit).forEach(params => {
    let { url } = params
    let folder = getEntry(url)
    bundleRendererInstanceMapping[folder].renderToString(params)
  })

  /* --- End ---- */

  const handleError = (err, ctx) => {
    if (err.url) {
      ctx.redirect(err.url)
    } else if (err.code === 404) {
      ctx.status = 404
      ctx.body = '404 | Page Not Found'
    } else {
      // Render Error Page or Redirect
      ctx.status = 500
      ctx.body = '500 | Internal Server Error'

      console.error(`error during render : ${ctx.path}`)
      console.error(err.stack)
    }
  }

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      await next()
      return
    }

    try {
      let folder = getEntry(reqPath)
      let bundleRendererInstance = bundleRendererInstanceMapping[folder]
      if (!bundleRendererInstance) {
        throw new Error('404 | Page Not Found')
      }

      const context = {
        url: ctx.originalUrl,
        title: ctx.__SSR_TITLE__ || projectConfig.title,
        __SSR_CONTENT__: ctx.__SSR_CONTENT__
      }

      const renderer = function () {
        return new Promise((res, rej) => {
          bundleRendererInstance.renderToString(context, (err, html) => {
            if (err) {
              console.log(err)
              console.log(err.stack)
              rej(err)
            } else {
              res(html)
            }
          })
        })
      }

      let rid = ctx.log4j.add('RenderToString')
      let html = await renderer()
      ctx.log4j.get(rid).end()

      ctx.body = html
    } catch (e) {
      handleError(e, ctx)
    }
  }
}

module.exports = {
  install
}
