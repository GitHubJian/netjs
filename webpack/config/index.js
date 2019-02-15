const root = process.cwd()
const path = require('path')

const { educe } = require(path.resolve(root, './utils/educe.js'))

module.exports = educe(__dirname)
