const App = require('./../app.js')

const actionsMiddleware = require('./../middleware/actionsMiddleware.js')
const exceptionMiddleware = require('./../middleware/exceptionMiddleware.js')
const mockMiddleware = require('./../middleware/mockMiddleware.js')
const paramsMiddleware = require('./../middleware/paramsMiddleware.js')
const proxyMiddleware = require('./../middleware/proxyMiddleware.js')
const uuidMiddleware = require('./../middleware/uuidMiddleware.js')
const log4jMiddleware = require('./../middleware/log4jMiddleware.js')
const routerMiddeleware = require('./../middleware/routerMiddleware.js')
const devSSRMiddleware = require('./../middleware/devSSRMiddleware.js')

module.exports = function (config) {
  App.use([
    log4jMiddleware,
    exceptionMiddleware,
    uuidMiddleware,
    paramsMiddleware,
    proxyMiddleware,
    actionsMiddleware,
    mockMiddleware,
    routerMiddeleware
  ])

  App.life(devSSRMiddleware, 'plugined')

  new App(config)
}
