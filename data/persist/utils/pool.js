/**
 * 服务连接池
 * @author xiaows
 * @description
 *    通过连接池获取相应的数据
 */

const Agent = require('agentkeepalive')

// agent 默认配置
const agentConfig = {
  maxSockets: 5,
  maxFreeSockets: 5,
  timeout: 15000,
  freeSocketTimeout: 15000
}

/**
 * 创建数据连接池
 * @param {Array} poolConfig
 * @param {*} agentConfig
 *
 * @returns {Array} 连接池数组
 */

function create (
  poolConfig = [],
  {
    maxSockets = 5,
    maxFreeSockets = 5,
    timeout = 15000,
    freeSocketTimeout = 15000
  } = agentConfig
) {
  if (poolConfig.length === 0) {
    console.warn(`[Pool Config]: Not found`)
    return []
  }

  return poolConfig.map(pool => {
    const agent = new Agent({
      maxSockets,
      maxFreeSockets,
      timeout,
      freeSocketTimeout
    })

    return Object.assign({ agent }, pool)
  })
}

module.exports = {
  create,
  default: create
}
