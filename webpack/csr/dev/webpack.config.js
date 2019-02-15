const pathConfig = require('../../config/path.config.js')
const fs = require('fs')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const { entry } = require('./../utils/entry.js')
const dllEntry = require('./../utils/entry-dll.js')
const { alias } = require('./../utils/alias.js')
const { htmlAssets } = require('./../utils/asset.js')

const { publicPath } = require('./../utils/output.js')

const webpackConfig = {
  mode: 'development',
  entry: Object.assign({ global: pathConfig.global }, entry),
  output: {
    filename: 'js/[name].js',
    path: pathConfig.static,
    publicPath: publicPath
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.vue']
  },
  resolveLoader: {
    modules: [pathConfig.nodeModule]
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
        test: /\.vue$/,
        use: 'vue-loader'
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
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new webpack.ProvidePlugin({}),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    ...Object.keys(dllEntry).map(
      v =>
        new webpack.DllReferencePlugin({
          manifest: require(`${pathConfig.dll}/${v}.json`)
        })
    ),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  optimization: {},
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

if (fs.existsSync(`${pathConfig.dll}/index.json`)) {
  webpackConfig.plugins.push(
    new HtmlWebpackIncludeAssetsPlugin({
      append: false,
      assets: htmlAssets
    })
  )
}

module.exports = { webpackConfig }
