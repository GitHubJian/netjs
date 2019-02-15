const root = process.cwd()
const { resolve } = require('path')

module.exports = {
  root: root,
  mock: resolve(root, 'mock'),
  src: resolve(root, 'client/src'),
  pages: resolve(root, 'client/src/pages'),
  global: resolve(root, 'client/src/global.js'),
  globalServer: resolve(root, 'client/src/global-server.js'),
  temp: resolve(root, '.temp'),
  dll: resolve(root, '.temp/dll'),
  dllVersion: resolve(root, '.temp/dll/version.json'),
  webpack: resolve(root, 'webpack'),
  template: resolve(root, 'template'),
  templateSSR: resolve(root, 'webpack/template.ssr.ejs'),
  prepackPath: resolve(root, '.temp/prepack'),
  dist: resolve(root, 'dist'),
  static: resolve(root, 'static'),
  nodeModule: resolve(root, 'node_modules'),
  favicon: resolve(root, 'favicon.ico'),
  zoo: resolve(root, 'zoo'),
  asset: resolve(root, 'asset')
}
