const glob = require('glob')
const path = require('path')

let key = glob
  .sync(path.resolve(__dirname, './*.js'))
  .filter(v => {
    return !['index'].some(k => {
      return path.basename(v).indexOf(k) > -1
    })
  })
  .reduce((prev, cur) => {
    prev[path.basename(cur, '.js')] = require(cur)

    return prev
  }, {})

console.log(key)

module.exports = {}
