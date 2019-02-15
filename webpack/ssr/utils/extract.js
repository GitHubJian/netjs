const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].[chunkhash].css',
  allChunks: true
})

module.exports = extractCSS
