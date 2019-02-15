const root = process.cwd()
const path = require('path')
const fs = require('fs')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')
const { camelCase } = require('../../utils/codeCase.js')

let defaultConfig = {
  dir: path.resolve(root, './mock'),
  router: '/mock'
}

const install = function (options, app) {
  let { router, dir } = extend(defaultConfig, options.mock || {})

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      await next()
      return
    }

    let pathArr = reqPath.split('/').slice(1)
    // 文件名
    let filename = pathArr[1]
    let methodName = pathArr.slice(2).join('/')
    methodName = camelCase(methodName)
    let filePath = path.resolve(dir, `${filename}.js`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Mock Not found: File ${filePath}`)
    }

    delete require.cache[filePath]
    let methods = require(filePath)
    let api

    if ((api = methods[methodName])) {
      let res = await api({ query: ctx.query, body: ctx.request.body })

      ctx.body = {
        code: 0,
        msg: '',
        data: res
      }
    } else {
      // 方法不存在
      throw new Error(`Mock Not found: Function ${methodName}`)
    }
  }
}

module.exports = {
  install
}
