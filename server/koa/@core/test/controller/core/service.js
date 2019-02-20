require('babel-register')({
  plugins: ['transform-decorators-legacy']
})

const { AppService } = require('./service.spec')

let a = new AppService().getHello()
console.log(a)
