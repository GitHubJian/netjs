'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const sharedUtils = require('../../utils/shared.utils')

function Controller(prefix) {
  const path = sharedUtils.isUndefined(prefix) ? '/' : prefix
  return target => {
    Reflect.defineProperty(target, 'PATH', {
      value: path
    })
  }
}

exports.Controller = Controller
