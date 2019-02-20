const root = process.cwd()
const path = require('path')
const pathConfig = require(path.resolve(root, './config/path.config.js'))

const glob = require('glob')
const fse = require('fs-extra')
const fs = require('fs')
const Mustache = require('mustache')
const template = fs.readFileSync(path.resolve(__dirname, './template.js'), {
  encoding: 'utf-8'
})

const createContent = entryPath => {
  return Mustache.render(template, {
    entryPath: entryPath
  })
}

const prepack = async () => {
  return glob
    .sync(path.resolve(pathConfig.src, './pages/**/app.vue'))
    .forEach(async entry => {
      let key = entry.split('/').slice(-2, -1)[0]
      let entryPath = entry
        .split('/')
        .slice(0, -1)
        .join('/')

      let filePath = path.resolve(pathConfig.prepackPath, `csr/${key}.js`)
      await fse.ensureFileSync(filePath)
      await fs.writeFileSync(filePath, createContent(entryPath))
    })
}

module.exports = prepack
