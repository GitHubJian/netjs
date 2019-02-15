const root = process.cwd()
const path = require('path')

module.exports = require(path.resolve(root, './config/server.config.js'))
