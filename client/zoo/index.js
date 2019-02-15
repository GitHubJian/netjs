import components from './components'
import request from './utils/request.js'

const install = (Vue, options = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$get = request.get
  Vue.prototype.$post = request.post

  // 错误统一处理
  if (typeof window !== 'undefined') {
    window.__request_error_callback__ = (e, req) => {
      console.error(`Fetch Error [ ${req.url} ]: ${e}`)
    }
  }
}

export default {
  install
}
