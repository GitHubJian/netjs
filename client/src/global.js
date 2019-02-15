import Vue from 'vue'
import zoo from '@zoo/index.js'
import '@css/reset.scss'
import api from '@api/plugin.js'

Vue.use(zoo)
Vue.use(api)

if (typeof window !== 'undefined') {
  window.Vue = Vue
}

if (typeof global !== 'undefined') {
  global.Vue = Vue
}

// export default Vue
