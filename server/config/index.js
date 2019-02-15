const NODE_ENV = process.env.NODE_ENV || 'development'
const { extend } = require('./../utils/extend.js')

const defaultConfig = require('./default.js')
const config = require(`./${NODE_ENV}.js`)

module.exports = extend(defaultConfig, config)
