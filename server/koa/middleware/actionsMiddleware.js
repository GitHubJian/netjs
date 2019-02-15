const path = require('path')
const glob = require('glob')
const co = require('co')
const { extend } = require('./../../utils/extend.js')
const { match: matchRoute } = require('./../../utils/match.js')

const defaultConfig = {
  actionsDir: path.resolve(__dirname, './actions'),
  router: '/actions'
}

const install = function (options, app) {
  let { actionsDir, router } = extend(defaultConfig, options.actions || {})
  let dirs = [actionsDir]

  const getActions = dir => {
    return glob.sync(`${dir}/*.js`).map(file => {
      return file.replace(`${dir}/`, '').replace('.js', '')
    })
  }

  const actionKeys = dirs.map(getActions).reduce((prev, cur) => {
    return Array.from(new Set(prev.concat(cur)))
  }, [])

  return async (ctx, next) => {
    let reqPath = ctx.path
    if (!matchRoute(reqPath, router)) {
      await next()
      return
    }

    let reqPathArr = reqPath.split('/')
    let actionKey = reqPathArr[2]
    if (!actionKeys.includes(actionKey)) {
      return await next()
    }

    let methodName = reqPathArr.slice(3).map((v, i) => {
      if (i !== 0) {
        return v.toUpperCase()
      }

      return v
    })

    let api
    dirs.some(dir => {
      let targetFile = path.join(dir, `${actionKey}.js`)
      let actions
      if (!fs.existsSync(targetFile)) return false

      actions = require(targetFile)

      if (typeof actions === 'object' && actions[methodName]) {
        api = actions[methodName]
      } else if (typeof actions === 'function') {
        api = actions
      }

      return api
    })

    if (!api) {
      return await next()
    }

    let funcType = api && api.constructor.name

    if (funcType === 'GeneratorFunction') {
      await co.call(ctx, api.call(ctx))
    } else {
      await api.call(ctx)
    }
  }
}

module.exports = {
  install
}
