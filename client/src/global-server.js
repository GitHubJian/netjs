import Vue from 'vue'
import SgLayout from '@zoo/components/layout/index.js'

let components = [SgLayout]

const install = (Vue, options = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

Vue.use({ install })

if (typeof window !== 'undefined') {
  window.Vue = Vue
}

if (typeof global !== 'undefined') {
  global.Vue = Vue
}

export default Vue
