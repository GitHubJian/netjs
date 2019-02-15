const pathConfig = require('./../config/path.config.js')

const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const extractCSS = require('./utils/extract.js')
const { alias } = require('./utils/alias.js')
const { serverEntry } = require('./entry.js')

const { publicPath } = require('./utils/output.js')

const webpackConfig = {
  mode: 'production',
  target: 'node',
  entry: Object.assign({ global: pathConfig.globalServer }, serverEntry),
  output: {
    filename: 'js/[name]-server.js',
    path: pathConfig.dist,
    publicPath: publicPath,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.vue']
  },
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              },
              presets: [['env', { modules: false }]],
              plugins: ['syntax-dynamic-import'],
              loaders: {
                css: extractCSS.extract({
                  fallback: 'vue-style-loader',
                  use: [
                    {
                      loader: 'css-loader'
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
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['syntax-dynamic-import']
            }
          }
        ]
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
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {}
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
              options: {}
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
              options: {}
            },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    extractCSS,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new VueLoaderPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require(`${pathConfig.dll}/vendor.json`)
    }),
    new VueSSRServerPlugin(),
    new FriendlyErrorsPlugin()
  ],
  optimization: {
    splitChunks: {}
  }
}

module.exports = { webpackConfig }
