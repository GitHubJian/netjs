'use strict'

const url = require('url')
const KoaProxy = require('koa-proxy')
const KoaConvert = require('koa-convert')
const pathToRegExp = require('path-to-regexp')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')
const { logger } = require('./../../utils/logger.js')

const defaultConfig = {
  router: '/proxy',
  proxy: {}
}

function defaultMapFunc (path) {
  return path
}

function logProxyRule (host, path, map) {
  let targetUrl = map(path)
  targetUrl = url.resolve(host, targetUrl)
  logger.proxy(`${path} => ${targetUrl}`)
}

const install = function (options, app) {
  let { router, proxy } = extend(defaultConfig, options.proxy || {})
  let paths = proxy && Object.keys(proxy)
  let pathRegExp = paths.map(v => pathToRegExp(v))

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      await next()
      return
    }

    let map = defaultMapFunc
    let index = pathRegExp.findIndex(re => {
      return re.exec(reqPath)
    })

    if (index < 0) {
      throw new Error(`Proxy Not found: ${reqPath}`)
    }

    let c = paths[index]
    let host = proxy[c].url
    if (typeof proxy[c].map === 'function') {
      map = proxy[c].map
    }

    // 打印转发
    logProxyRule(host, reqPath, map)
    // 将 proxy 返回的 generator 转化为 async
    let fn = KoaConvert(
      KoaProxy({
        host,
        map
      })
    )

    await fn(ctx, next)
  }
}

module.exports = {
  install
}
