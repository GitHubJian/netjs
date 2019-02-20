'use strict'
var __rest = function(obj, arr) {
  let t = {}
  for (var prop in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, prop) &&
      arr.indexOf(prop) < 0
    ) {
      t[prop] = s[prop]
    }
  }

  return t
}
Object.defineProperty(exports, '__esModule', { value: true })

const moduleTokenFactory = require('./module-token-factory')

class ModuleCompiler {
  constructor() {
    this.moduleTokenFactory = new moduleTokenFactory.ModuleTokenFactory()
  }

  async compile(metatype) {
    const { type } = await this.extractMetadata(metatype)
    const token = this.moduleTokenFactory.create(type)

    return { type, token }
  }

  async extractMetadata(metatype) {
    metatype = await metatype

    return { type: metatype }
  }
}
