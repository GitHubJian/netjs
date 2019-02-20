'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ApplicationConfig = require('./application-config')
const Container = require('./injector/container')
const Application = require('./application')

class NestFactoryStatic {
  constructor() {}

  async create(module, serverOrOptions, options) {
    let [httpServer, appOptions] = [serverOrOptions, options]

    const applicationConfig = new ApplicationConfig.ApplicationConfig()
    const container = new Container.NestContainer(applicationConfig)
    await this.initialize(module, container)

    return this.createNestInstance(
      new Application.NestApplication(
        _container,
        httpServer,
        applicationConfig,
        appOptions
      )
    )
  }
}
