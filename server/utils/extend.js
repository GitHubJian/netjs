const merge = require('deepmerge')

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

function extend () {
  let args = Array.prototype.slice.call(arguments)
  let res = merge.all(args, { arrayMerge: overwriteMerge })

  return res
}

module.exports = {
  extend
}
