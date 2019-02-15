import Vue from 'vue'

export default {
  __SSR_CONTENT_SET__: (state, { __SSR_CONTENT__ }) => {
    Vue.set(state, '__SSR_CONTENT__', __SSR_CONTENT__)
  },
  CLIENT_SET: (state, { name }) => {
    // Vue.set(state.client, 'name', name);
  }
}
