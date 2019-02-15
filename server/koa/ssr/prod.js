const App = require('./../app.js')

const actionsMiddleware = require('./../middleware/actionsMiddleware.js')
const assertMiddleware = require('./../middleware/assertMiddleware.js')
const exceptionMiddleware = require('./../middleware/exceptionMiddleware.js')
const mockMiddleware = require('./../middleware/mockMiddleware.js')
const paramsMiddleware = require('./../middleware/paramsMiddleware.js')
const proxyMiddleware = require('./../middleware/proxyMiddleware.js')
const uuidMiddleware = require('./../middleware/uuidMiddleware.js')
const ssrMiddleware = require('./../middleware/ssrMiddleware.js')
const log4jMiddleware = require('./../middleware/log4jMiddleware.js')
const routerMiddeleware = require('./../middleware/routerMiddleware.js')

module.exports = function (config) {
  App.use([
    log4jMiddleware,
    exceptionMiddleware,
    uuidMiddleware,
    paramsMiddleware,
    proxyMiddleware,
    actionsMiddleware,
    mockMiddleware,
    routerMiddeleware,
    ssrMiddleware,
    assertMiddleware
  ])

  new App(config)
}
