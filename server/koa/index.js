module.exports = function createApp (config) {
  let { mode = 'csr' } = config

  let app = ~process.argv.indexOf('dev')
    ? require(`./${mode}/dev.js`)
    : require(`./${mode}/prod.js`)

  app(config)
}
