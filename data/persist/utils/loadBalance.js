/**
 * 负载均衡
 * @author xiaows
 */

const random = require('random')

class LoadBalance {
  /**
   * 剔除有故障的连接
   * @param {Array} servers 服务器连接
   * @param {Array} excludeServerIds 排除故障连接Id
   *
   * @returns {Array<id, server>}
   *
   * @example
   * LoadBalance.nextServer()
   */
  static nextServer (servers = [], excludeServerIds = []) {
    let serversLength = servers.length
    if (!excludeServerIds || !excludeServerIds.length) {
      let id = random.int(0, serversLength - 1)
      return [id, servers[id]]
    } else {
      // excludeServerIds 少于 servers
      if (excludeServerIds.length >= serversLength) {
        throw new Error('Servers Corrupted') // 服务器崩溃了
      } else {
        let serverIds = Array.from(new Array(serversLength), (v, i) => i)
        let result = serverIds.filter(k => !excludeServerIds.includes(k))
        let id = result[random.int(0, result.length - 1)]

        return [id, servers[id]]
      }
    }
  }
}

module.exports = LoadBalance
