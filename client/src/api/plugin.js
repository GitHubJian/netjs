import config from './config.js'
import request from '@zoo/utils/request.js'
import apis from './index.js'
const isDevelopment = process.env.NODE_ENV === 'development'

const { enable, router } = config

let api = apis.reduce((prev, cur) => {
  let obj = Object.entries(cur).reduce((i, [k, v]) => {
    let { url, method = 'get', mock = false, thenable = res => res } = v
    // 开启 mock
    if (isDevelopment && enable && mock) {
      url = router + url
    }

    let fn = function (body) {
      return request[method || 'get']({
        url: url,
        params: body
      }).then(thenable)
    }

    i[k] = fn

    return i
  }, {})

  Object.assign(prev, obj)

  return prev
}, {})

const install = (Vue, opts = {}) => {
  Vue.prototype.$api = api
}

export default {
  install
}
