const pathConfig = require('./../config/path.config.js')

const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const SWPrecachePlugin = require('sw-precache-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { alias } = require('./utils/alias.js')
const { clientEntry } = require('./entry.js')

const dllEntry = require('./utils/entry-dll.js')
const extractCSS = require('./utils/extract.js')

const { publicPath } = require('./utils/output.js')

const webpackConfig = {
  mode: 'production',
  entry: Object.assign({ global: pathConfig.global }, clientEntry),
  output: {
    filename: `js/[name].[chunkhash].js`,
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
                css: extractCSS.extract({
                  fallback: 'vue-style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: {}
                    }
                  ]
                }),
                sass: extractCSS.extract({
                  fallback: 'vue-style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: {}
                    },
                    'sass-loader'
                  ]
                }),
                scss: extractCSS.extract({
                  fallback: 'vue-style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: {}
                    },
                    'sass-loader'
                  ]
                }),
                js: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true, // css压缩，
                url: true
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true // css压缩
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.sass$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true // css压缩
              }
            },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new VueSSRClientPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),

    ...Object.keys(dllEntry).map(
      v =>
        new webpack.DllReferencePlugin({
          manifest: require(`${pathConfig.dll}/${v}.json`)
        })
    ),

    extractCSS,
    new CleanWebpackPlugin(
      ['dist', 'static'], // glob 匹配
      {
        root: pathConfig.root, // 根目录
        exclude: ['favicon.ico', 'vue-ssr-server-bundle.json'], // 不包含
        verbose: true, // 开启输出
        dry: false // 启动删除文件
      }
    ),
    new ParallelUglifyPlugin({
      uglifyES: {
        compress: {
          warnings: false
        }
      }
    }),
    new OptimizeCssAssetsPlugin()
  ],
  optimization: {
    splitChunks: {
      name: 'global',
      minChunks: Infinity
    }
  },
  performance: {
    hints: false
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
  // devtool: '#eval-source-map'
}

module.exports = { webpackConfig }
