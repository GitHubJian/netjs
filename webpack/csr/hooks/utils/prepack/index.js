const root = process.cwd()
const path = require('path')
const pathConfig = require(path.resolve(root, './config/path.config.js'))

const glob = require('glob')
const fse = require('fs-extra')
const fs = require('fs')

const createContent = entryPath => {
  return [
    `import Vue from 'vue';`,
    `import entry from '${entryPath}/app.vue';`,
    `import { createRouter } from '${entryPath}/router/index.js';`,
    `import { createStore } from '${entryPath}/store/index.js';`,
    `import { sync } from 'vuex-router-sync';`,
    '',
    `const router = createRouter();`,
    `const store = createStore();`,
    '',
    `sync(store, router);`,
    '',
    `export default new Vue({`,
    `    router,`,
    `    store,`,
    `    el: '#app',`,
    `    render: h => h(entry)`,
    `})`
  ].join('\n')
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
