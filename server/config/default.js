const projectConfig = require('./../../config/project.config.js')
const { article, ad } = require('./data/index.js')
const router = require('../../data/router/index.js')

module.exports = {
  mode: 'csr',
  ready: {
    host: 'localhost',
    port: 8418
  },
  ssr: {
    needInit: [1].map(v => {
      return {
        url: `/route/news/${v}`,
        title: projectConfig.title,
        __SSR_CONTENT__: {
          articleResult: article,
          adResult: ad,
          pageInfo: {},
          _msg_: 'success'
        }
      }
    })
  },
  router: {
    routes: router
  },
  proxy: {
    proxy: {
      '/proxy/resource/article/auxiliary': {
        url: 'http://sa.sogou.com/',
        map: function (path) {
          return `/weball/api${path}`
        }
      },
      '/proxy/resource/article/recommend': {
        url: 'http://sa.sogou.com/',
        map: path => {
          return `/weball/api${path}`
        }
      },
      '/proxy/getBaike': {
        url: 'http://sugg.search.baike.sogou.com',
        map: path => {
          return '/info_flow'
        }
      }
    }
  }
}
