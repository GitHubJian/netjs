/**
 * Redis 连接
 * @author xiaows
 */

const {
  redis: {
    open: isOpenRedis,
    feCache: { host, port, password, db }
  }
} = require('./../config/index.js')
const redis = require('redis')

// 创建 redis 的客户端
let client = redis.createClient({
  host,
  port,
  password,
  db
})

client.on('error', err => {
  // 打印异常
})

/**
 * 获取 Redis 中的值
 *
 * @param {String} key
 *
 * @returns {Promise}
 */

function get (key) {
  return new Promise((resolve, reject) => {
    if (!isOpenRedis) {
      resolve(null)
      return
    }
    if (!key) {
      resolve(null)
    } else {
      client.get(key, (err, value) => {
        if (!err) {
          resolve(value)
        } else {
          resolve(null)
        }
      })
    }
  })
}

/**
 * 获取 Redis 中的值
 *
 * @param {String} key
 * @param {*} value
 * @param {Number} expire this key will expire after 600 seconds
 */

function set (key, value, expire = 600) {
  if (!isOpenRedis) {
    return
  }
  client.set(key, value, 'EX', expire)
}

function quit () {
  client.quit()
}

// 程序退出关闭 Redis
process.on('exit', () => {
  client.quit()
})

module.exports = {
  get,
  set
}
