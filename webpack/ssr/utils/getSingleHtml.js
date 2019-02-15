// const fs = require('fs')
// const path = require('path')
// const HtmlwebpackPlugin = require('html-webpack-plugin')

// const pathConfig = require('./../config/path.config.js')

// webpackConfig.entry = {
//   global: ['webpack-hot-middleware/client', pathConfig.global]
// }

// const getSingleHtmlPlugin = page => {
//   const { entryPath, outputPath, extra } = page

//   return new HtmlwebpackPlugin({
//     filename: `${outputPath}.html`,
//     template: extra.layout || pathConfig.buildTemplate,
//     chunks: ['manifest', 'global', outputPath],
//     prefix: projectConfig.publicPath || '',
//     NODE_ENV,
//     title: extra.title,
//     appendHtml: projectConfig.appendHtml,
//     extra: extra,
//     projectConfig
//   })
// }
