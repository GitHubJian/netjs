const defaultConfig = {
  kv: {
    limit: 5,
    timeout: 300,
    keepAliveTimeout: 15000,
    charset: 'utf8',
    pool: [
      {
        host: '',
        port: ''
      }
    ]
  },
  redis: {
    open: false,
    feCache: {
      host: '',
      port: '',
      password: '',
      db: ''
    }
  },
  mysql: {
    host: '',
    port: '',
    username: '',
    password: '',
    db: '',
    charset: '',
    maxConnection: 5
  },
  app: {
    mid: '',
    xid: '',
    retryTimes: 3,
    monica: ''
  }
}
const root = process.cwd()
const path = require('path')

const { reader } = require(path.resolve(root, './utils/personalize.js'))

let config = reader('persist.js', {
  dir: './data/config'
})

module.exports = config
