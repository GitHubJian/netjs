const pathConfig = require('./../config/path.config.js')

const os = require('os')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const LIBRARY_NAME = '__[name]_[chunkhash]__'

const extractCSS = require('./utils/extract.js')
const entry = require('./utils/entry-dll.js')

const { publicPath } = require('./utils/output.js')

const webpackConfig = {
  mode: 'production',
  entry,
  output: {
    filename: `js/[name].[chunkhash].js`,
    path: pathConfig.dll,
    publicPath: publicPath,
    library: LIBRARY_NAME
  },
  resolve: {
    extensions: ['.js', '.css'],
    modules: [pathConfig.nodeModule]
  },
  resolveLoader: {
    modules: [pathConfig.nodeModule]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract([
          {
            loader: 'css-loader'
          }
        ])
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[name].[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CleanWebpackPlugin([pathConfig.dll], {
      root: pathConfig.root,
      verbose: false
    }),
    extractCSS,
    new webpack.DllPlugin({
      path: `${pathConfig.dll}/[name].json`,
      name: LIBRARY_NAME
    }),
    new AssetsWebpackPlugin({
      path: pathConfig.dll,
      filename: 'index.json',
      prettyPrint: true
    }),
    new ParallelUglifyPlugin({
      workerCount: os.cpus().length,
      uglifyJS: {
        compress: {
          warnings: false
        }
      }
    }),
    new OptimizeCssAssetsPlugin()
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

module.exports = { webpackConfig }
