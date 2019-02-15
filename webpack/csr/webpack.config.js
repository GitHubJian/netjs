const pathConfig = require('./../config/path.config.js')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')

const extractCSS = require('./utils/extract.js')
const { entry } = require('./utils/entry.js')
const dllEntry = require('./utils/entry-dll.js')
const { htmlAssets, publicPath: dllPublicPath } = require('./utils/asset.js')
const { alias } = require('./utils/alias.js')

const { publicPath } = require('./utils/output.js')

const { NODE_ENV } = process.env
let dllCopyPath = []

if (fs.existsSync(pathConfig.dll)) {
  dllCopyPath = fs
    .readdirSync(pathConfig.dll)
    .filter(v => {
      const stat = fs.statSync(path.join(pathConfig.dll, v))
      return stat.isDirectory()
    })
    .map(v => {
      return {
        from: path.resolve(pathConfig.dll, v),
        to: path.resolve(pathConfig.static, v)
      }
    })
    .concat([
      {
        from: pathConfig.favicon,
        to: pathConfig.static
      },
      {
        from: `${pathConfig.dist}/css/*.css`,
        to: `${pathConfig.static}/css/[name].[ext]`
      },
      {
        from: `${pathConfig.dist}/js/*.js`,
        to: `${pathConfig.static}/js/[name].[ext]`
      },
      {
        from: `${pathConfig.dist}/images/*.*`,
        to: `${pathConfig.static}/images/[name].[ext]`
      },
      {
        from: `${pathConfig.dll}/css/*.css`,
        to: `${pathConfig.static}/css/[name].[ext]`
      },
      {
        from: `${pathConfig.dll}/js/*.js`,
        to: `${pathConfig.static}/js/[name].[ext]`
      },
      {
        from: `${pathConfig.dll}/images/*.*`,
        to: `${pathConfig.static}/images/[name].[ext]`
      }
    ])
}

const HtmlWebpackPluginList = Object.entries(entry).map(([k, v]) => {
  // 自动追加 webpack.output.publicPath 为 prefix
  return new HtmlWebpackPlugin({
    filename: path.resolve(pathConfig.static, `${k}.html`),
    template: path.resolve(__dirname, './template/csr.ejs'),
    title: '测试',
    favicon: pathConfig.favicon,
    chunks: ['global', k],
    NODE_ENV
  })
})

const webpackConfig = {
  mode: 'production',
  entry: Object.assign({ global: pathConfig.global }, entry),
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: pathConfig.static,
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
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: extractCSS.extract({
              fallback: 'vue-style-loader',
              use: ['css-loader']
            }),
            sass: extractCSS.extract({
              fallback: 'vue-style-loader',
              use: ['sass-loader', 'css-loader']
            }),
            js: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        }
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
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.sass$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
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
    new webpack.ProvidePlugin({
      qs: 'query-string',
      axios: 'axios'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin(
      [
        {
          from: pathConfig.favicon,
          to: pathConfig.static
        },
        {
          from: `${pathConfig.dist}/css/*.css`,
          to: `${pathConfig.static}/css/[name].[ext]`
        },
        {
          from: `${pathConfig.dist}/js/*.js`,
          to: `${pathConfig.static}/js/[name].[ext]`
        },
        {
          from: `${pathConfig.dist}/images/*.*`,
          to: `${pathConfig.static}/images/[name].[ext]`
        },
        {
          from: `${pathConfig.dll}/css/*.css`,
          to: `${pathConfig.static}/css/[name].[ext]`
        },
        {
          from: `${pathConfig.dll}/js/*.js`,
          to: `${pathConfig.static}/js/[name].[ext]`
        },
        {
          from: `${pathConfig.dll}/images/*.*`,
          to: `${pathConfig.static}/images/[name].[ext]`
        }
      ],
      {
        debug: 'warning'
      }
    )
  ],
  optimization: {},
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

// 动态引入dll
webpackConfig.plugins.push(
  ...Object.keys(dllEntry).reduce((prev, v) => {
    if (fs.existsSync(`${pathConfig.dll}/${v}.json`)) {
      prev.push(
        new webpack.DllReferencePlugin({
          manifest: require(`${pathConfig.dll}/${v}.json`)
        })
      )
    }

    return prev
  }, [])
)

webpackConfig.plugins.push(
  ...[
    extractCSS,
    new CleanWebpackPlugin([pathConfig.static], {
      root: pathConfig.root,
      verbose: false
    }),
    new AssetsWebpackPlugin({
      path: pathConfig.static,
      filename: 'index.json',
      prettyPrint: true,
      processOutput (assets) {
        delete assets['']
        return JSON.stringify(assets, null, 4)
      }
    }),
    ...HtmlWebpackPluginList
  ]
)

if (fs.existsSync(`${pathConfig.dll}/index.json`)) {
  webpackConfig.plugins.push(
    new HtmlWebpackIncludeAssetsPlugin({
      append: false,
      assets: htmlAssets.map(v => {
        return v.substring(dllPublicPath.length - 1)
      })
    })
  )
}

webpackConfig.plugins.push(
  new TerserPlugin({
    parallel: true,
    terserOptions: {
      ecma: 6
    }
  })
)

module.exports = { webpackConfig }
