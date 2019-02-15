// import { clientFetchUser } from 'api'

export default {
  __SSR_CONTENT_FETCH__: ({ commit, state }, { __SSR_CONTENT__ }) => {
    return commit('__SSR_CONTENT_SET__', { __SSR_CONTENT__ })
  }
  // CLIENT_FETCH: ({ commit, stat }) => {
  //   return clientFetchUser().then(({ name }) => commit('CLIENT_SET', { name }))
  // }
}
