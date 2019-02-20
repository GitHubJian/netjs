'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const messages = require('../messages')
const runtimeException = require('./runtime.exception')

class InvalidModuleException extends runtimeException.RuntimeException {
  constructor(trace) {
    const scope = (trace || []).map(module => module.name).join(' -> ')
    super(messages.INVALID_MODULE_MESSAGE`${scope}`)
  }
}


exports.InvalidModuleException = InvalidModuleException
