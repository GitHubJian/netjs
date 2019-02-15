const glob = require('glob')
const path = require('path')
const { pages, src, prepackPath } = require('../../../../config/path.config.js')
const fs = require('fs')
const fse = require('fs-extra')
const Mustache = require('mustache')
const template = path.resolve(__dirname, './template')

const appClientTemplatePath = path.resolve(template, 'app.js')
const appServerTemplatePath = path.resolve(template, 'app-server.js')
const clientTemplatePath = path.resolve(template, 'entry-client.js')
const serverTemplatePath = path.resolve(template, 'entry-server.js')
const reader = p => fs.readFileSync(p, { encoding: 'utf-8' })
const writer = (p, c) => fse.outputFileSync(p, c, { encoding: 'utf-8' })

const createSSRFile = (key = 'index') => {
  const appContent = Mustache.render(reader(appClientTemplatePath), {
    app: path.resolve(pages, `${key}`),
    global: path.resolve(src, 'global.js')
  })

  const appServerContent = Mustache.render(reader(appServerTemplatePath), {
    app: path.resolve(pages, `${key}`),
    global: path.resolve(src, 'global-server.js')
  })

  const serverContent = reader(serverTemplatePath)
  const clientContent = reader(clientTemplatePath)

  let appPath = path.resolve(prepackPath, `./ssr/${key}/app.js`)
  let clientPath = path.resolve(prepackPath, `./ssr/${key}/entry-client.js`)
  let appPathServer = path.resolve(prepackPath, `./ssr/${key}/app-server.js`)
  let serverPath = path.resolve(prepackPath, `./ssr/${key}/entry-server.js`)

  let entries = [
    [appPathServer, appServerContent],
    [appPath, appContent],
    [serverPath, serverContent],
    [clientPath, clientContent]
  ]

  for (let i = 0, il = entries.length; i < il; i++) {
    let entry = entries[i]
    writer.apply(null, entry)
  }
}

const prepack = () => {
  let keys = glob.sync(path.resolve(pages, './**/app.vue')).map(v => {
    return v.split('/').slice(-2, -1)[0]
  })

  for (let i = 0, il = keys.length; i < il; i++) {
    let key = keys[i]
    createSSRFile(key)
  }
}

module.exports = prepack
