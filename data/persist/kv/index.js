/**
 * KV 请求连接
 * @author xiaows
 */

const { kv: kvConfig } = require('./../config/index.js')
const LoadBalance = require('./../utils/loadBalance.js')
const http = require('http')
const Pool = require('./../utils/pool.js')

let pool = kvConfig.pool

let kvServers = Pool.create(pool, {
  maxSockets: kvConfig.limit,
  maxFreeSockets: kvConfig.limit,
  timeout: kvConfig.keepAliveTimeout,
  freeSocketTimeout: kvConfig.keepAliveTimeout
})

function request (
  path,
  id,
  server = {},
  method = 'get',
  timeout = kvConfig.timeout
) {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Server Id:${id} timeout`))
      }, timeout)
    }),
    new Promise((resolve, reject) => {
      let req = http.request(
        {
          host: server.host,
          port: server.port,
          agent: server.agent,
          path,
          method: method.toUpperCase()
        },
        res => {
          let chunks = []
          res.setEncoding(kvConfig.charset || 'utf8')
          res.on('data', chunk => {
            chunks.push(chunk)
          })
          res.on('end', () => {
            resolve(chunks.join(''))
          })
        }
      )

      req.on('error', err => {
        reject(new Error(`Server Id: ${id} request error`))
      })

      req.end()
    })
  ]).then(
    data => {
      return data
    },
    e => {
      throw e
    }
  )
}

/**
 * 获取数据
 *
 * @param {String} path 请求的地址
 * @param {Number} retry 重试次数 2
 * @param {String} method 请求方法 GET
 * @param {Array} servers 数据连接池
 */

async function get (path, retry = 2, method = 'get', servers = kvServers) {
  let result

  let excludeServerIds = []

  for (let i = 0; i < retry; i++) {
    try {
      let [id, server] = LoadBalance.nextServer(servers, excludeServerIds)
      excludeServerIds.push(id)
      result = await request(path, id, server, method, kvConfig.timeout)
      break
    } catch (e) {}
  }

  return result
}

// 程序退出，关闭所有的连接池
process.on('exit', () => {
  kvServers &&
    kvServers.forEach(v => {
      let { agent } = v
      agent.destroy && agent.destroy()
    })
})

module.exports = {
  get
}
