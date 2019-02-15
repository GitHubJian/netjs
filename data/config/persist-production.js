// 基础配置，即不开启APP配置所采用的最终结果
module.exports = {
  kv: {
    limit: 5,
    timeout: 300,
    keepAliveTimeout: 15000,
    charset: 'utf8'
    // 连接后端服务
    // pool: [
    //   {
    //     host: '10.144.34.104',
    //     port: 84
    //   },
    //   {
    //     host: '10.144.34.104',
    //     port: 84
    //   },
    //   {
    //     host: '10.144.34.104',
    //     port: 84
    //   },
    //   {
    //     host: '10.144.34.104',
    //     port: 84
    //   }
    // ]
  },
  redis: {
    // 是否开启 redis, default: false
    open: false,
    feCache: {
      host: '10.144.34.104',
      port: '1669',
      password: 'xjredis',
      db: 1
    }
  },
  mysql: {
    host: '10.144.34.104',
    port: 3306,
    username: 'wx_mis',
    password: 'wx_mis_headline',
    db: 'wx',
    charset: 'UTF8_GENERAL_CI',
    maxConnection: 5
  },
  app: {
    mid: '966b@@shida_yinhe',
    xid: '6329@@shida_yinhe',
    retryTimes: 3,
    monica: 'sougouappno.0001'
  }
}
