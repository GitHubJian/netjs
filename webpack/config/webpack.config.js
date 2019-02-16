const root = process.cwd()
const path = require('path')

module.exports = {
  output: {
    publicPath: '/static/'
  },
  alias: {
    root: root,
    '@zoo': path.resolve(root, 'client/zoo'),
    '@css': path.resolve(root, 'client/zoo/css'),
    '@asset': path.resolve(root, 'client/assert')
  }
}
