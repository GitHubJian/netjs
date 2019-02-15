import { createApp } from './app-server.js'

const isProd = process.env.NODE_ENV === 'production'

export default context => {
  return new Promise((resolve, reject) => {
    const s = !isProd && Date.now()

    const { app, router, store } = createApp()
    const { url, __SSR_CONTENT__ } = context

    // const { fullPath } = router.resolve(url).route
    // if (fullPath !== url) {
    //   return reject({ url: fullPath })
    // }

    // 兼容之前url参数未编码
    let path = router.resolve(url).route.path
    let reqPath = url.split('?')[0]

    if (path !== reqPath) {
      return reject({ url: reqPath })
    }

    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404, message: 'no matched routes' })
      }

      Promise.all(
        matchedComponents.map(
          ({ asyncData }) =>
            asyncData &&
            asyncData({ store, route: router.currentRoute, __SSR_CONTENT__ })
        )
      )
        .then(() => {
          !isProd && console.log(`data pre-fetch: ${Date.now() - s}ms`)
          context.state = store.state
          resolve(app)
        })
        .catch(reject)
    }, reject)
  })
}
