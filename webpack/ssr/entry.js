const glob = require('glob')
const path = require('path')
const { pages, prepackPath } = require('../config/path.config.js')

const sp = key => path.resolve(prepackPath, `./ssr/${key}/entry-server.js`)
const cp = key => path.resolve(prepackPath, `./ssr/${key}/entry-client.js`)

let entries = glob
  .sync(path.resolve(pages, './**/app.vue'))
  .map(v => {
    return v.split('/').slice(-2, -1)[0]
  })
  .reduce(
    (prev, key) => {
      prev['serverEntry'][key] = sp(key)
      prev['clientEntry'][key] = cp(key)

      return prev
    },
    { serverEntry: {}, clientEntry: {} }
  )

module.exports = entries
