// 基础配置，即不开启APP配置所采用的最终结果
module.exports = {
  kv: {
    limit: 5,
    timeout: 300,
    keepAliveTimeout: 15000,
    charset: 'utf8',
    // 连接后端服务
    pool: []
  },
  redis: {
    // 是否开启 redis, default: false
    open: true,
    feCache: {
      host: '',
      port: '',
      password: '',
      db: 1
    }
  },
  mysql: {
    host: '',
    port: 3306,
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
