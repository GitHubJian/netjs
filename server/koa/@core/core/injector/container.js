const compiler = require('./compiler')
const modulesContainer = require('./modules-container')
const applicationRefHost = require('../helpers/application-ref-host')
const services = require('../services')
const invalidModuleException = require('../errors/exceptions/invalid-module.exception')
const module = require('./module')
const constants = require('../../common/constants')

class NestContainer {
  constructor(_applicationConfig = undefined) {
    this._applicationConfig = _applicationConfig
    this.globalModules = new Set()
    this.moduleCompiler = new compiler.ModuleCompiler()
    this.modules = new modulesContainer.ModulesContainer()
    this.reflector = new services.Reflector()
    this.applicationRefHost = new applicationRefHost.ApplicationReferenceHost()
  }

  get applicationConfig() {
    return this._applicationConfig
  }

  setApplicationRef(applicationRef) {
    this.applicationRef = applicationRef
    if (!this.applicationRefHost) {
      return
    }
    this.applicationRefHost.applicationRef = applicationRef
  }

  getApplicationRef() {
    return this.applicationRef
  }

  async addModule(metatype) {
    if (!metatype) {
      throw new invalidModuleException.InvalidModuleException()
    }

    const { type, token } = await this.moduleCompiler.compile(metatype)
    if (this.modules.has(token)) {
      return
    }

    const mod = new module.Module(type, this)
    this.modules.set(token, mod)

    this.isGlobalModule(type) && this.addGlobalModule(mod)
  }

  isGlobalModule(metatype) {
    return !!Reflect.getMetadata(constants.GLOBAL_MODULE_METADATA, metatype)
  }

  addGlobalModule(module) {
    this.globalModules.add(module)
  }
}
