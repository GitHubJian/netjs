require('babel-register')({
  plugins: ['transform-decorators-legacy']
})

const { CatsController } = require('./cats.spec')
let cats = new CatsController()

console.log(cats.appServer.getHello())
