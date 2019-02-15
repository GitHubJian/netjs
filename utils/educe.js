const glob = require('glob')
const path = require('path')

function camelCase (str) {
  return str.replace(/\.([a-zA-Z])/g, w => {
    return w.substring(1, 2).toUpperCase() + w.substring(2)
  })
}

function firstCase (str, separator = '.') {
  return str.split(separator)[0]
}

function educe (
  dir,
  {
    ext = 'js',
    exclude = ['index'],
    encode = firstCase,
    partten = './*.js'
  } = {}
) {
  return glob
    .sync(path.resolve(dir, partten))
    .filter(v => {
      return !exclude.some(k => {
        return path.basename(v).indexOf(k) > -1
      })
    })
    .reduce((prev, cur) => {
      let key = encode(path.basename(cur, `.${ext}`))

      prev[key] = require(cur)

      return prev
    }, {})
}

module.exports = {
  educe,
  camelCase
}
