'use strict'

const root = process.cwd()
const path = require('path')
const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaLogger = require('koa-logger')
const KoaFavicon = require('koa-favicon')

@
class App{
  constructor(){

  }
}

class App {
  static use (plugin) {
    if (Array.isArray(plugin)) {
      plugin.map(item => App.use(item))
    } else {
      App.installedPlugins.indexOf(plugin) === -1 &&
        App.installedPlugins.push(plugin)
    }
  }

  static life (hook, name) {
    if (name === undefined) {
      throw new Error(`Lifecycle Hook Name is Undefined`)
    }

    if (Array.isArray(hook)) {
      hook.map(item => App.life(item, name))
    } else {
      let hooks = App.lifecycleHooks[name] || []

      hooks.indexOf(hook) === -1 && hooks.push(hook)

      App.lifecycleHooks[name] = hooks
    }
  }

  constructor (options) {
    this.options = options
    this.installedPlugins = []
    this.app = null

    this.init()
  }

  init () {
    this.initPlugins()
    this.ready(this)
  }

  initPlugins () {
    this.installedPlugins = []

    App.installedPlugins.reduce((prev, plugin) => {
      let res

      if (typeof plugin.install === 'function') {
        res = plugin.install.call(this, this.options)
      } else if (typeof plugin === 'function') {
        res = plugin.call(this, this.options)
      }

      let isAsync =
        Object.prototype.toString.call(res) === '[object AsyncFunction]'

      isAsync && prev.push(res)

      return prev
    }, this.installedPlugins)
  }

  ready () {
    this.app = new Koa()
    this.app.use(KoaLogger())
    this.app.use(KoaFavicon(path.resolve(root, './favicon.ico')))
    this.app.use(KoaBody({ patchKoa: true }))
    // beforePlugin

    this.installedPlugins.map(plugin => {
      this.app.use(plugin)
    })

    // plugined
    let lifecyclePluginedHooks = App.lifecycleHooks['plugined'] || []
    lifecyclePluginedHooks.map(hook => {
      hook.call(this, this.options, this.app)
    })

    let { port, host, delay } = this.options.ready
    this.start(port, { host, delay })
  }

  start (port = 8417, { host, delay } = { host: 'localhost', delay: 0 }) {
    this.app.listen(port, () => {
      console.log(`✨ 服务已启动 http://${host}:${port}\n`)
    })

    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at:', p, 'reason:', reason)
    })

    process.on('uncaughtException', err => {
      console.error(err)
    })
  }
}

App.installedPlugins = []
App.lifecycleHooks = {}
App.LIFECYCLE_HOOKS = ['beforePlugin', 'plugined']

module.exports = App
