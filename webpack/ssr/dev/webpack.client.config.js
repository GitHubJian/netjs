const pathConfig = require('./../../config/path.config.js')

const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const { alias } = require('./../utils/alias.js')
const { clientEntry } = require('../entry.js')

const { publicPath } = require('./../utils/output.js')

module.exports = {
  mode: 'development',
  entry: Object.assign({ global: pathConfig.global }, clientEntry),
  output: {
    filename: 'js/[name].js',
    path: pathConfig.dist,
    publicPath: publicPath
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.vue']
  },
  module: {
    rules: [
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
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: ['vue-style-loader', 'css-loader'],
                scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
                sass: ['vue-style-loader', 'css-loader', 'sass-loader'],
                js: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-syntax-dynamic-import']
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    new webpack.DllReferencePlugin({
      manifest: require(`${pathConfig.dll}/vendor.json`)
    }),
    new VueSSRClientPlugin(),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  performance: {
    hints: false
  },
  stats: {
    colors: true,
    children: true,
    modules: false,
    chunks: false,
    chunkModules: false
  },
  devtool: 'eval-source-map'
}
