/**
 * Mysql 连接
 *
 * @author xiaows
 * @desc
 */

const {
  mysql: {
    host,
    port,
    username,
    password,
    db: database,
    charset,
    maxConnection: limit
  }
} = require('./../config/index.js')
const Mysql = require('mysql')

let pool = Mysql.createPool({
  host,
  port,
  username,
  password,
  database,
  charset,
  limit
})

/**
 * 从数据库中取值
 * @param {Object} options 详情请查看 mysql->connection->query 参数
 *
 * @returns {Promise}
 */

function get (query) {
  return new Promise((resolve, reject) => {
    if (!key) {
      resolve(null)
    } else {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err)
          resolve(null)
        } else {
          connection.query(query, (err, results, field) => {
            if (err) {
              console.error(err)
              connection.destroy()
              resolve(null)
            } else {
              connection.release()
              resolve(results)
            }
          })
        }
      })
    }
  })
}

// 系统退出，结束数据库池
process.on('exit', () => {
  pool.end()
})

module.exports = {
  get
}
